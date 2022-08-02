import { deadlineFiveMinutesFromNow, Address, Wei, WeiAsToken } from '@/core/kaikas'
import {
  usePairAddress,
  PairAddressResult,
  usePairBalance,
  usePairReserves,
} from '@/modules/ModuleTradeShared/composable.pair-by-tokens'
import { buildPair, mirrorTokenType, TokensPair, TokenType } from '@/utils/pair'
import { acceptHMRUpdate, defineStore } from 'pinia'
import invariant from 'tiny-invariant'
import { Ref } from 'vue'
import { useRates } from '@/modules/ModuleTradeShared/composable.rates'
import {
  InputWei,
  useExchangeRateInput,
  useInertExchangeRateInput,
} from '@/modules/ModuleTradeShared/composable.exchange-rate-input'
import { RouteName } from '@/types'

type NormalizedWeiInput = TokensPair<{ addr: Address; input: Wei }>

function useQuoting(props: { pair: Ref<null | PairAddressResult>; input: Ref<null | InputWei> }) {
  const kaikasStore = useKaikasStore()

  const scope = useParamScope(
    computed(() => {
      if (props.pair.value?.kind !== 'exist') return null
      const { tokens, addr: pair } = props.pair.value

      const { type: quoteFrom, wei: value } = props.input.value ?? {}
      if (!quoteFrom || !value) return null
      const quoteFor = mirrorTokenType(quoteFrom)

      return {
        key: `${pair}-${quoteFor}-${value}`,
        payload: { tokens, quoteFor, quoteFrom, value },
      }
    }),
    ({ tokens: { tokenA, tokenB }, quoteFor, value }) => {
      const { state, run } = useTask(
        () =>
          kaikasStore
            .getKaikasAnyway()
            .tokens.getTokenQuote({
              tokenA,
              tokenB,
              value,
              quoteFor,
            })
            .then((value) => ({ exchangeRate: value })),
        { immediate: true },
      )
      usePromiseLog(state, 'add-liquidity-quoting')

      return { state: flattenState(state), run }
    },
  )

  const pendingFor = computed(() => (scope.value?.expose.state.pending ? scope.value.payload.quoteFor : null))
  const exchangeRate = computed(() => {
    if (!scope.value) return null
    const {
      payload: props,
      expose: {
        state: { fulfilled },
      },
    } = scope.value
    if (!fulfilled) return null
    return { props, value: fulfilled.exchangeRate }
  })
  const touch = () => scope.value?.expose.run()

  return { pendingFor, exchangeRate, touch }
}

function usePrepareSupply(props: { tokens: Ref<NormalizedWeiInput | null>; onSupply: () => void }) {
  const kaikasStore = useKaikasStore()
  const tokensStore = useTokensStore()
  const { notify } = useNotify()

  const [active, setActive] = useToggle(false)

  const scopeKey = computed(() => {
    const { tokenA, tokenB } = props.tokens.value ?? {}

    return (
      tokenA &&
      tokenB && {
        key: `${tokenA.addr}-${tokenA.input}-${tokenB.addr}-${tokenB.input}`,
        payload: { tokenA, tokenB },
      }
    )
  })
  watch(scopeKey, () => setActive(false))

  const scope = useParamScope(
    computed(() => active.value && scopeKey.value),
    (tokens) => {
      const { state: statePrepare, run: runPrepare } = useTask(
        async () => {
          const kaikas = kaikasStore.getKaikasAnyway()
          const { send, fee } = await kaikas.liquidity.prepareAddLiquidity({
            tokens: buildPair((type) => ({ addr: tokens[type].addr, desired: tokens[type].input })),
            deadline: deadlineFiveMinutesFromNow(),
          })
          return { send, fee }
        },
        { immediate: true },
      )

      function prepare() {
        !statePrepare.pending && runPrepare()
      }

      const { state: stateSupply, run: supply } = useTask(async () => {
        invariant(statePrepare.fulfilled)
        await statePrepare.fulfilled.value.send()
      })

      usePromiseLog(statePrepare, 'add-liquidity-prepare')
      usePromiseLog(stateSupply, 'add-liquidity-supply')
      useNotifyOnError(statePrepare, notify, 'Preparation failed')
      useNotifyOnError(stateSupply, notify, 'Liquidity addition failed')
      wheneverFulfilled(stateSupply, () => {
        tokensStore.touchUserBalance()
        props.onSupply()
        notify({ type: 'ok', description: 'Liquidity addition succeeded!' })
      })

      const fee = computed(() => statePrepare.fulfilled?.value.fee ?? null)
      const statePrepareFlags = promiseStateToFlags(statePrepare)
      const stateSupplyFlags = promiseStateToFlags(stateSupply)

      return readonly({
        prepare,
        fee,
        prepareState: statePrepareFlags,
        supplyState: stateSupplyFlags,
        supply,
      })
    },
  )

  return {
    prepare: () => {
      if (scope.value) {
        scope.value.expose.prepare()
      } else {
        setActive(true)
      }
    },
    clear: () => setActive(false),
    scope: computed(() => scope.value?.expose),
  }
}

export const useLiquidityAddStore = defineStore('liquidity-add', () => {
  const route = useRoute()
  const isActiveRoute = computed(() => route.name === RouteName.LiquidityAdd)

  const selection = useExchangeRateInput({ localStorageKey: 'liquidity-add-selection', isActive: isActiveRoute })
  const selectionInput = useInertExchangeRateInput({ input: selection.input })
  const { rates: inputRates } = selectionInput
  const { tokens, resetInput } = selection
  const symbols = computed(() => buildPair((type) => tokens[type]?.symbol ?? null))
  const addrsReadonly = readonly(selection.addrs)

  const { pair: gotPair } = usePairAddress(addrsReadonly)
  const isEmptyPair = computed(() => gotPair.value?.kind === 'empty')
  const { result: pairBalance, touch: touchPairBalance } = usePairBalance(
    addrsReadonly,
    computed(() => gotPair.value?.kind === 'exist'),
  )
  const { result: pairReserves, touch: touchPairReserves } = usePairReserves(addrsReadonly)
  const {
    userBalance: pairUserBalance,
    totalSupply: pairTotalSupply,
    poolShare,
  } = toRefs(
    toReactive(
      computed(() => {
        const { userBalance = null, totalSupply = null, poolShare = null } = pairBalance.value ?? {}
        return { userBalance, totalSupply, poolShare }
      }),
    ),
  )
  const formattedPoolShare = useFormattedPercent(poolShare, 7)

  const {
    pendingFor: isQuotePendingFor,
    exchangeRate: quoteExchangeRate,
    touch: touchQuote,
  } = useQuoting({
    pair: gotPair,
    input: selection.inputNormalized,
  })

  watch(
    [quoteExchangeRate, selection.tokens],
    ([rate, tokens]) => {
      if (rate && tokens[rate.props.quoteFor]) {
        const token = rate.value.toToken(tokens[rate.props.quoteFor]!)
        selectionInput.setEstimated(token)
      }
    },
    { immediate: true, deep: true },
  )

  const weiNormalized = computed<null | NormalizedWeiInput>(() => {
    if (quoteExchangeRate.value) {
      const {
        value: amount,
        props: { quoteFor, value: referenceValue, tokens },
      } = quoteExchangeRate.value
      return {
        ...buildPair((type) => ({ addr: tokens[type], input: quoteFor === type ? amount : referenceValue })),
      }
    }
    return null
  })

  const rates = useRates(
    computed(() => {
      if (!weiNormalized.value) return null
      if (!quoteExchangeRate.value) return null
      return buildPair((type) => {
        const wei = weiNormalized.value![type].input
        return wei
      })
    }),
  )

  const {
    prepare: prepareSupply,
    clear: clearSupply,
    scope: supplyScope,
  } = usePrepareSupply({
    tokens: weiNormalized,
    onSupply() {
      touchPairBalance()
      touchPairReserves()
      touchQuote()
    },
  })
  const isValid = computed(() => !!rates.value)

  function input(token: TokenType, raw: WeiAsToken) {
    selectionInput.set(token, raw)
  }

  function setToken(token: TokenType, addr: Address) {
    selection.addrs[token] = addr
  }

  function setBoth(tokens: TokensPair<Address>) {
    selection.setAddrs(tokens)
    selection.input.value = null
  }

  return {
    inputRates,
    addrs: addrsReadonly,
    symbols,
    tokens,
    isEmptyPair,
    pair: gotPair,
    pairUserBalance,
    pairTotalSupply,
    poolShare,
    formattedPoolShare,
    pairReserves,

    rates,

    isQuotePendingFor,
    quoteExchangeRate,

    input,
    setToken,
    setBoth,
    resetInput,

    prepareSupply,
    clearSupply,
    supplyScope,
    isValid,
  }
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useLiquidityAddStore, import.meta.hot))
