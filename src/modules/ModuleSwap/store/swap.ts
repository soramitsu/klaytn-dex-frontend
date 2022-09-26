import { acceptHMRUpdate, defineStore } from 'pinia'
import invariant from 'tiny-invariant'
import { Address, TokenSymbol, Trade, WeiAsToken, Wei, TokenImpl, Pair, TokenAmount, LP_TOKEN_DECIMALS } from '@/core'
import BigNumber from 'bignumber.js'
import { TokenType, TokensPair, mirrorTokenType, buildPair } from '@/utils/pair'
import Debug from 'debug'
import { useSwapAmounts, GetAmountsProps } from '../composable.get-amounts'
import { useTrade } from '../composable.trade'
import { usePairAddress, usePairBalance } from '../../ModuleTradeShared/composable.pair-by-tokens'
import { useSwapValidation } from '../composable.validation'
import { buildSwapProps, TokenAddrAndWeiInput } from '../util.swap-props'
import {
  usePairInput,
  useEstimatedLayer,
  useLocalStorageAddrsOrigin,
} from '../../ModuleTradeShared/composable.pair-input'
import { Ref } from 'vue'
import { useRates } from '@/modules/ModuleTradeShared/composable.rates'
import { RouteName } from '@/types'
import { useControlledComposedKey } from '@/utils/composable.controlled-composed-key'
import { usePairsQuery } from '../query.pairs'
import { MAX_UINT256 } from '@/modules/ModuleEarnShared/const'

const debugModule = Debug('swap-store')

type NormalizedWeiInput = TokensPair<TokenAddrAndWeiInput> & { trade: Trade; amountFor: TokenType }

function useSwap(input: Ref<null | NormalizedWeiInput>) {
  const dexStore = useDexStore()
  const swapStore = useSwapStore()
  const tokensStore = useTokensStore()
  const { notify } = useNotify()

  const swapKey = computed(() => {
    if (!input.value) return null
    const { tokenA, tokenB, amountFor, trade } = input.value
    return (
      dexStore.active.kind === 'named' && {
        key: `${tokenA.addr}-${tokenA.input}-${tokenB.addr}-${tokenB.input}-${amountFor}`,
        payload: { props: { trade, tokenA, tokenB, amountFor }, dex: dexStore.active.dex() },
      }
    )
  })

  const { filteredKey, setActive } = useControlledComposedKey(swapKey)

  const scope = useParamScope(filteredKey, ({ props: { trade, tokenA, tokenB, amountFor }, dex }) => {
    const { state: prepareState, run: prepare } = useTask(
      async () => {
        // 1. Approve amount of the tokenA or max amount if expert mode is enabled
        const amount = swapStore.expertMode ? new Wei(MAX_UINT256) : tokenA.input
        await dex.agent.approveAmount(tokenA.addr, amount)

        // 2. Perform swap according to which token is "exact" and if
        // some of them is native
        const swapProps = buildSwapProps({ trade, tokenA, tokenB, referenceToken: mirrorTokenType(amountFor) })
        const { send, fee } = await dex.swap.prepareSwap(swapProps)

        return { send, fee }
      },
      { immediate: true },
    )

    usePromiseLog(prepareState, 'prepare-swap')
    useNotifyOnError(prepareState, notify, 'Swap preparation failed')

    const { state: swapState, run: swap } = useTask(async () => {
      invariant(prepareState.fulfilled)
      const { send } = prepareState.fulfilled.value
      await send()
    })

    usePromiseLog(swapState, 'swap')
    wheneverFulfilled(swapState, () => {
      tokensStore.touchUserBalance()
    })
    useNotifyOnError(swapState, notify, 'Swap failed')

    return {
      prepare,
      swap,
      fee: computed(() => prepareState.fulfilled?.value.fee ?? null),
      prepareState: promiseStateToFlags(prepareState),
      swapState: promiseStateToFlags(swapState),
    }
  })

  return {
    prepare: () => {
      scope.value ? scope.value.expose.prepare() : setActive(true)
    },
    clear: () => setActive(false),
    swapFee: computed(() => scope.value?.expose.fee ?? null),
    prepareState: computed(() => scope.value?.expose.prepareState ?? null),
    swapState: computed(() => scope.value?.expose.swapState ?? null),
    swap: () => scope.value?.expose.swap(),
  }
}

export const useSwapStore = defineStore('swap', () => {
  const dexStore = useDexStore()

  const pageRoute = useRoute()
  const isActiveRoute = computed(() => pageRoute.name === RouteName.Swap)

  const expertMode = useLocalStorage<boolean>('expert-mode', true)

  const multihops = useLocalStorage<boolean>('swap-multi-hops', true)
  const disableMultiHops = computed({
    get: () => !multihops.value,
    set: (v) => {
      multihops.value = !v
    },
  })

  const slippageTolerance = ref(0)

  // #region selection

  const selection = usePairInput({ addrsOrigin: useLocalStorageAddrsOrigin('swap-selection', isActiveRoute) })
  const { tokens, resetInput, tokenValues } = selection
  const addrsReadonly = readonly(selection.addrs)

  const tokenImpls = reactive(
    buildPair((type) =>
      computed(() => {
        const token = tokens[type]
        return token && new TokenImpl(token)
      }),
    ),
  )

  const symbols = computed(() => buildPair((type) => tokens[type]?.symbol ?? null))

  function setTokenAddress(type: TokenType, addr: Address | null) {
    selection.addrs[type] = addr
  }

  function setBothTokens(pair: TokensPair<Address>) {
    selection.setBothAddrs(pair)
    selection.resetInput()
  }

  const { estimatedFor, setEstimated, setMainToken } = useEstimatedLayer(selection)

  // #endregion

  // #region Pair data

  const PairsQuery = usePairsQuery()

  const pairs = computed(() => {
    return (
      PairsQuery.result.value?.pairs.map((pair) => {
        const token0 = new TokenImpl({
          name: pair.token0.name,
          address: pair.token0.id,
          decimals: Number(pair.token0.decimals),
          symbol: pair.token0.symbol,
        })
        const token1 = new TokenImpl({
          name: pair.token1.name,
          address: pair.token1.id,
          decimals: Number(pair.token1.decimals),
          symbol: pair.token1.symbol,
        })
        const pairSymbol = (token0.symbol + '-' + token1.symbol) as TokenSymbol
        return new Pair({
          liquidityToken: new TokenImpl({
            address: pair.id,
            decimals: LP_TOKEN_DECIMALS,
            symbol: pairSymbol,
            name: pairSymbol,
          }),
          token0: TokenAmount.fromToken(token0, pair.reserve0),
          token1: TokenAmount.fromToken(token1, pair.reserve1),
        })
      }) ?? null
    )
  })

  const { pair: pairAddrResult } = usePairAddress(addrsReadonly)
  const { result: pairBalance } = usePairBalance(
    addrsReadonly,
    computed(() => pairAddrResult.value?.kind === 'exist'),
  )
  const poolShare = computed(() => pairBalance.value?.poolShare ?? null)
  // const formattedPoolShare = useFormattedPercent(poolShare, 7)

  // #endregion

  // #region Route & Amounts

  const inputAmount = computed(() => {
    const amountFor = estimatedFor.value
    if (!amountFor) return null

    const amountFrom = mirrorTokenType(amountFor)
    const referenceValue = selection.weiFromTokens[amountFrom]
    if (!referenceValue?.asBigInt) return null

    return {
      for: amountFor,
      from: amountFrom,
      wei: referenceValue,
    }
  })

  const tradeResult = useTrade({
    pairs,
    amount: inputAmount,
    tokens: tokenImpls,
    disableMultiHops,
  })

  const trade = computed(() => (tradeResult.value?.kind === 'exist' ? tradeResult.value.trade : null))
  const priceImpact = computed(() => trade.value?.priceImpact ?? null)

  const { gotAmountFor, gettingAmountFor } = useSwapAmounts(
    computed<GetAmountsProps | null>(() => {
      const input = inputAmount.value
      if (!input) return null
      const { for: amountFor, wei: referenceValue } = input

      const tradeVal = trade.value
      if (!tradeVal) return null

      return {
        trade: tradeVal,
        amountFor,
        referenceValue,
      }
    }),
  )

  watch(
    [gotAmountFor, selection.tokens],
    ([result]) => {
      if (result) {
        const {
          props: { amountFor },
          amount,
        } = result
        const tokenData = selection.tokens[amountFor]
        if (tokenData) {
          debugModule('Setting computed amount %o for %o', amount, amountFor)
          const raw = amount.toToken(tokenData)
          setEstimated(new BigNumber(raw).toFixed(5) as WeiAsToken)
        }
      }
    },
    { deep: true },
  )

  const estimatedForAfterAmountsComputation = computed<null | TokenType>(() => {
    return gotAmountFor.value?.props.amountFor ?? null
  })

  const normalizedWeiInputs = computed<NormalizedWeiInput | null>(() => {
    if (gotAmountFor.value) {
      const {
        amount,
        props: { amountFor, referenceValue, trade },
      } = gotAmountFor.value
      return {
        ...buildPair((type) => ({
          addr: type === 'tokenA' ? trade.route.input.address : trade.route.output.address,
          input: amountFor === type ? amount : referenceValue,
        })),
        trade,
        amountFor,
      }
    }
    return null
  })

  const finalRates = useRates(
    computed(() => {
      const wei = normalizedWeiInputs.value
      if (!wei) return null
      return buildPair((type) => wei[type].input)
    }),
  )

  // #endregion

  // #region Action

  const { prepare, prepareState, swapState, swapFee, swap, clear: clearSwap } = useSwap(normalizedWeiInputs)

  // #endregion

  // #region validation

  const swapValidation = useSwapValidation({
    selected: reactive(buildPair((type) => computed(() => !!selection.addrs[type]))),
    tokenABalance: computed(() => selection.balance.tokenA as Wei | null),
    tokenAInput: computed(() => selection.weiFromTokens.tokenA),
    trade: computed(() => tradeResult.value?.kind ?? 'pending'),
    wallet: computed(() => (dexStore.isWalletConnected ? 'connected' : 'anonymous')),
  })

  const isValid = computed(() => swapValidation.value.kind === 'ok')
  const isValidationPending = computed(() => swapValidation.value.kind === 'pending')
  const validationError = computed(() => (swapValidation.value.kind === 'err' ? swapValidation.value.err : null))

  // #endregion

  return {
    tokenValues: readonly(tokenValues),
    finalRates,
    addrs: addrsReadonly,
    normalizedWeiInputs,
    tokens,
    trade,
    symbols,
    priceImpact,

    isValid,
    isValidationPending,
    validationError,

    swap,
    swapState,
    prepareState,
    prepare,
    swapFee,
    gettingAmountFor,
    gotAmountFor,
    clearSwap,
    estimatedFor: estimatedForAfterAmountsComputation,

    setTokenAddress,
    setToken: setMainToken,
    setBothTokens,
    resetInput,

    slippageTolerance,
    expertMode,
    disableMultiHops,
  }
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useSwapStore, import.meta.hot))
