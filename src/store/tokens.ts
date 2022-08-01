import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia'
import { Address, Kaikas, Token, Wei } from '@/core/kaikas'
import { WHITELIST_TOKENS } from '@/core/kaikas/const'
import invariant from 'tiny-invariant'
import { Ref } from 'vue'

export interface TokenWithOptionBalance extends Token {
  balance: null | Wei
}

function listItemsFromMapOrNull<K, V>(keys: K[], map: Map<K, V>): null | V[] {
  const fromMap: V[] = []

  for (const key of keys) {
    const value = map.get(key)
    if (!value) return null
    fromMap.push(value)
  }

  return fromMap
}

async function loadTokens(kaikas: Kaikas, addrs: Address[]): Promise<Map<Address, Token>> {
  const pairs = await Promise.all(
    addrs.map(async (addr) => {
      const token = await kaikas.tokens.getToken(addr)
      return [addr, token] as [Address, Token]
    }),
  )

  return new Map(pairs)
}

async function loadBalances(kaikas: Kaikas, tokens: Address[]): Promise<Map<Address, Wei>> {
  const entries = await Promise.all(
    tokens.map(async (addr) => {
      const balance = await kaikas.tokens.getTokenBalanceOfUser(addr)
      return [addr, balance] as [Address, Wei]
    }),
  )

  return new Map(entries)
}

function useImportedTokens() {
  const kaikasStore = useKaikasStore()
  const { isConnected } = storeToRefs(kaikasStore)

  const tokens = useLocalStorage<Address[]>('klaytn-dex-imported-tokens', [])

  const fetchScope = useParamScope(isConnected, () => {
    const { state, run } = useTask(
      async () => {
        const kaikas = kaikasStore.getKaikasAnyway()
        return loadTokens(kaikas, tokens.value)
      },
      { immediate: true },
    )

    usePromiseLog(state, 'imported-tokens')
    useErrorRetry(state, run)

    return useStaleState(state)
  })

  const isPending = computed(() => fetchScope.value?.expose.pending ?? false)
  const result = computed(() => fetchScope.value?.expose.fulfilled?.value ?? null)
  const isLoaded = computed(() => !!result.value)

  const tokensFetched = computed<null | Token[]>(() => {
    if (!result.value) return null
    return listItemsFromMapOrNull(tokens.value, result.value)
  })

  /**
   * Saves new imported token.
   * Does not fetch token data again
   */
  function importToken(token: Token): void {
    tokens.value.unshift(token.address)
    if (result.value) {
      result.value.set(token.address, token)
    }
  }

  return {
    tokens,
    tokensFetched,
    isPending,
    isLoaded,
    importToken,
  }
}

function useUserBalance(tokens: Ref<null | Address[]>) {
  const kaikasStore = useKaikasStore()

  const fetchScope = useParamScope(
    computed(() => !!tokens.value && kaikasStore.isConnected),
    () => {
      const { state, run } = useTask<Map<Address, Wei>>(
        async () => {
          const kaikas = kaikasStore.getKaikasAnyway()
          invariant(tokens.value)

          return loadBalances(kaikas, tokens.value)
        },
        { immediate: true },
      )

      usePromiseLog(state, 'user-balance')
      useErrorRetry(state, run)
      watch(tokens, run)
      whenever(() => kaikasStore.isConnected, run, { immediate: true })

      /**
       * Refetch balance
       */
      function touch() {
        run()
      }

      return reactive({ ...toRefs(useStaleState(state)), touch })
    },
  )

  const isPending = computed<boolean>(() => fetchScope.value?.expose.pending ?? false)
  const result = computed<null | Map<Address, Wei>>(() => {
    const data = fetchScope.value?.expose.fulfilled?.value
    if (data) return new Map([...data].map(([addr, balance]) => [addr.toLowerCase() as Address, balance]))
    return null
  })
  const isLoaded = computed<boolean>(() => !!result.value)

  function touch() {
    fetchScope.value?.expose.touch()
  }

  function lookup(addr: Address): Wei | null {
    return result.value?.get(addr.toLowerCase() as Address) ?? null
  }

  return { isPending, isLoaded, lookup, touch }
}

function useTokensIndex(tokens: Ref<null | readonly Token[]>) {
  /**
   * All addresses are written in lower-case
   */
  type TokensIndexMap = Map<Address, Token>

  const tokensIndexMap = computed<null | TokensIndexMap>(() => {
    const list = tokens.value
    if (!list) return null
    return new Map(list.map((item) => [item.address.toLowerCase() as Address, item]))
  })

  /**
   * Lookup for token data by token's address. **Case insensitive**.
   */
  function findTokenData(addr: Address): null | Token {
    return tokensIndexMap.value?.get(addr.toLowerCase() as Address) ?? null
  }

  return { findTokenData }
}

export const useTokensStore = defineStore('tokens', () => {
  const {
    tokensFetched: importedFetched,
    isLoaded: isImportedLoaded,
    isPending: isImportedPending,
    importToken,
  } = useImportedTokens()

  const tokensLoaded = computed(() => {
    return importedFetched.value ? [...importedFetched.value, ...WHITELIST_TOKENS] : WHITELIST_TOKENS
  })
  const tokensLoadedAddrs = computed(() => tokensLoaded.value?.map((x) => x.address) ?? null)

  const { findTokenData } = useTokensIndex(tokensLoaded)

  const {
    lookup: lookupUserBalance,
    isPending: isBalancePending,
    touch: touchUserBalance,
  } = useUserBalance(tokensLoadedAddrs)

  const tokensWithBalance = computed(() => {
    return (
      tokensLoaded.value?.map<TokenWithOptionBalance>((x) => {
        return {
          ...x,
          balance: lookupUserBalance(x.address),
        }
      }) ?? null
    )
  })

  return {
    isBalancePending,
    isImportedPending,
    isImportedLoaded,
    tokensLoaded,
    tokensWithBalance,

    importToken,
    findTokenData,
    lookupUserBalance,
    touchUserBalance,
  }
})

import.meta.hot?.accept(acceptHMRUpdate(useTokensStore, import.meta.hot))
