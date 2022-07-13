import {
  ValueWei,
  deadlineFiveMinutesFromNow,
  Address,
  isEmptyAddress,
  ValueEther,
  toWei,
  Balance,
} from '@/core/kaikas'
import { MAGIC_GAS_PRICE } from '@/core/kaikas/const'
// import { AddLiquidityAmountPropsBase } from '@/core/kaikas/Liquidity'
import { DexPair } from '@/types/typechain/swap'
import { Status } from '@vueuse/core'
import BigNumber from 'bignumber.js'
import { KIP7 } from 'caver-js'
import { acceptHMRUpdate, defineStore } from 'pinia'
import invariant from 'tiny-invariant'

// TODO
export const useLiquidityStore = defineStore('liquidity', () => {
  const kaikasStore = useKaikasStore()
  const tokensStore = useTokensStore()

  const state = reactive<State>({
    removeLiquidityPair: {
      lpTokenValue: null,
      tokenA: null,
      tokenB: null,
      amount1: null,
      amount0: null,
    },
  })

  async function quoteForToken(value: ValueWei<string>, whichToken: 'tokenA' | 'tokenB') {
    const kaikas = kaikasStore.getKaikasAnyway()

    try {
      const { selectedTokens, computedToken } = tokensStore
      const { tokenA, tokenB } = selectedTokens
      invariant(tokenA && tokenB && computedToken, 'No selected tokens')

      const exchangeRate = await kaikas.tokens.getTokenQuote(tokenA.address, tokenB.address, value, whichToken)
      const { pairBalance, userBalance } = await kaikas.tokens.getPairBalance(tokenA.address, tokenB.address)

      tokensStore.setTokenValue({ type: computedToken, value: exchangeRate, pairBalance, userBalance })
    } catch (e) {
      console.error(e)
      $notify({ status: Status.Error, description: String(e) })
    }
  }

  async function addLiquidityAmount(mode: 'in' | 'out') {
    const kaikas = kaikasStore.getKaikasAnyway()

    const { tokenA, tokenB } = tokensStore.selectedTokens
    invariant(tokenA?.value && tokenB?.value)

    try {
      const tokenAValue = new BigNumber(tokenA.value)
      const tokenBValue = new BigNumber(tokenB.value)

      const deadline = deadlineFiveMinutesFromNow()
      const amountAMin = tokenAValue.minus(tokenAValue.dividedToIntegerBy(100))
      const amountBMin = tokenBValue.minus(tokenBValue.dividedToIntegerBy(100))

      await kaikas.cfg.approveAmount(tokenA.address, KIP7_ABI, tokenAValue.toFixed(0))
      await kaikas.cfg.approveAmount(tokenB.address, KIP7_ABI, tokenBValue.toFixed(0))

      const pairAddress = (await kaikas.cfg.contracts.factory.methods.getPair(tokenA.address, tokenB.address).call({
        from:
          // FIXME is it correct?
          // this.address,
          kaikas.cfg.addrs.self,
      })) as Address

      if (!isEmptyAddress(pairAddress)) {
        const baseParams: AddLiquidityAmountPropsBase = {
          tokenAValue,
          tokenBValue,
          tokenAddressA: tokenA.address,
          tokenAddressB: tokenB.address,
          deadline,
        }

        const { send } = await kaikas.liquidity.addLiquidityAmountForExistingPair({
          ...baseParams,
          ...(mode === 'in' ? { mode, amountBMin } : { mode, amountAMin }),
        })

        await send()
        $notify({
          status: Status.Success,
          description: `Liquidity success ${tokenA.name} + ${tokenB.name}`,
        })

        return
      }

      const addLiquidity = () =>
        kaikas.cfg.contracts.router.methods.addLiquidity(
          // FIXME in original methods there is no difference between IN and OUT
          // but in core `Liquidity` there is a difference `addLiquidity` order:
          // A,B,A,B,A,B for OUT and B,A,B,A,B,A for IN
          // see Liquidity.addLiquidityForExisingPair
          tokenA.address,
          tokenB.address,
          tokenAValue.toFixed(0),
          tokenBValue.toFixed(0),
          amountAMin.toFixed(0),
          amountBMin.toFixed(0),
          kaikas.cfg.addrs.self,
          deadline,
        )

      const lqGas = await addLiquidity().estimateGas()
      await addLiquidity().send({
        gas: lqGas,
        gasPrice: MAGIC_GAS_PRICE,
      })

      $notify({ status: Status.Success, description: 'Liquidity success' })
    } catch (e) {
      console.error(e)
      $notify({ status: Status.Error, description: `${e}` })
      throw new Error('Error')
    }
  }

  async function addLiquidityETH() {
    const kaikas = kaikasStore.getKaikasAnyway()

    const { tokenA, tokenB } = tokensStore.selectedTokens
    invariant(tokenA && tokenB)

    const sortedPair = sortKlayPair(tokenA, tokenB)
    const tokenAValue = new BigNumber(sortedPair[0].value!) // FIXME `.value!`
    const tokenBValue = new BigNumber(sortedPair[1].value!) // KLAY

    const deadline = deadlineFiveMinutesFromNow()
    const amountAMin = tokenAValue.minus(tokenAValue.dividedToIntegerBy(100))
    const amountBMin = tokenBValue.minus(tokenBValue.dividedToIntegerBy(100))

    await kaikas.cfg.approveAmount(sortedPair[0].address, KIP7_ABI, tokenAValue.toFixed(0))
    await kaikas.cfg.approveAmount(sortedPair[1].address, KIP7_ABI, tokenBValue.toFixed(0))

    const pairAddress = (await kaikas.cfg.contracts.factory.methods
      .getPair(sortedPair[0].address, sortedPair[1].address)
      .call({
        from: kaikas.cfg.addrs.self,
      })) as Address

    if (isEmptyAddress(pairAddress)) {
      const { send } = await kaikas.liquidity.addLiquidityKlayForExistingPair({
        addressA: sortedPair[0].address,
        tokenAValue,
        tokenBValue,
        amountAMin,
        deadline,
      })
      return await send()
    }

    const { send } = await kaikas.liquidity.addLiquidityKlay({
      addressA: sortedPair[0].address,
      tokenAValue,
      tokenBValue,
      amountAMin,
      amountBMin,
      deadline,
    })
    return await send()
  }

  // async function calcRemoveLiquidityAmounts(
  //   // FIXME type stricter
  //   // seems to be ether value
  //   lpTokenValue: ValueEther<string>,
  // ) {
  //   const kaikas = kaikasStore.getKaikasAnyway()

  //   const { tokenA, tokenB, pairAddress } = tokensStore.selectedTokens
  //   invariant(tokenA && tokenB && pairAddress)

  //   const pairContract = kaikas.cfg.createContract<DexPair>(pairAddress, PAIR_ABI)

  //   const totalSupply = new BigNumber(await pairContract.methods.totalSupply().call())
  //   const lpToken = new BigNumber(toWei(lpTokenValue, 'ether'))

  //   const computeAmount = async (token: Address): Promise<ValueWei<string>> => {
  //     const contract = kaikas.cfg.createContract<KIP7>(token, KIP7_ABI)
  //     const balance = await contract.methods.balanceOf(pairAddress).call({
  //       from: kaikas.selfAddress,
  //     })
  //     const amount = lpToken.multipliedBy(balance).dividedBy(totalSupply).minus(BN_ONE)
  //     return amount.toFixed(0) as ValueWei<string>
  //   }

  //   state.removeLiquidityPair = {
  //     ...state.removeLiquidityPair,
  //     amount0: await computeAmount(tokenA.address),
  //     amount1: await computeAmount(tokenB.address),
  //   }
  // }

  // async function removeLiquidity() {
  //   const kaikas = kaikasStore.getKaikasAnyway()
  //   const selfAddr = kaikas.cfg.addrs.self

  //   const { tokenA, tokenB, pairAddress } = tokensStore.selectedTokens
  //   const { removeLiquidityPair } = state
  //   invariant(tokenA && tokenB && pairAddress)

  //   // amount0 = (liquidity * balance0) / _totalSupply; // using balances ensures pro-rata distribution
  //   // amount1 = (liquidity * balance1) / _totalSupply; // using balances ensures pro-rata distribution
  //   //
  //   // amountAMin = amount0
  //   //
  //   // amountBMin = amount1
  //   //
  //   // balance0 = IKIP7(_token0).balanceOf(pairAddress);
  //   // balance1 = IKIP7(_token1).balanceOf(pairAddress);

  //   const pairContract = kaikas.cfg.createContract<DexPair>(pairAddress, PAIR_ABI)

  //   // FIXME unused...
  //   const pairBalance = await pairContract.methods.balanceOf(pairAddress).call()
  //   const totalSupply = new BigNumber(await pairContract.methods.totalSupply().call())

  //   if (!removeLiquidityPair.lpTokenValue) throw new Error(`No lp token value`)
  //   const lpToken = new BigNumber(toWei(removeLiquidityPair.lpTokenValue, 'ether').toString())

  //   await kaikas.cfg.approveAmount(pairAddress, PAIR_ABI, lpToken.toFixed(0))

  //   const amountByTokenAddr = async (addr: Address) => {
  //     const contract = kaikas.cfg.createContract<KIP7>(addr, KIP7_ABI)

  //     const balance = (await contract.methods.balanceOf(pairAddress).call({
  //       from: selfAddr,
  //     })) as Balance

  //     // FIXME what is amount?
  //     const amount = lpToken
  //       .multipliedBy(balance)
  //       .dividedBy(totalSupply)
  //       // FIXME there is minus 1 again later... is it a bug?
  //       .minus(BN_ONE)

  //     return amount
  //   }

  //   const deadLine = Math.floor(Date.now() / 1000 + 300)

  //   const params = {
  //     addressA: tokenA.address,
  //     addressB: tokenB.address,
  //     lpToken: lpToken.toFixed(0),
  //     amount0: (await amountByTokenAddr(tokenA.address))
  //       // FIXME minus 1 duplication - bug?
  //       .minus(BN_ONE)
  //       .toFixed(0),
  //     amount1: (await amountByTokenAddr(tokenB.address)).minus(BN_ONE).toFixed(0),
  //     address: selfAddr,
  //     deadLine,
  //   }

  //   const removeLiquidity = () =>
  //     kaikas.cfg.contracts.router.methods.removeLiquidity(
  //       params.addressA,
  //       params.addressB,
  //       params.lpToken,
  //       params.amount0,
  //       params.amount1,
  //       params.address,
  //       params.deadLine,
  //     )

  //   const removeLiqGas = await removeLiquidity().estimateGas({
  //     from: selfAddr,
  //     gasPrice: MAGIC_GAS_PRICE,
  //   })
  //   await removeLiquidity().send({
  //     from: selfAddr,
  //     gasPrice: MAGIC_GAS_PRICE,
  //     gas: removeLiqGas,
  //   })

  //   $notify({
  //     status: Status.Success,
  //     description: `Remove liquidity success ${tokenA.name} + ${tokenB.name}`,
  //   })
  // }

  // async function removeLiquidityETH() {
  //   const kaikas = kaikasStore.getKaikasAnyway()
  //   const selfAddr = kaikas.cfg.addrs.self

  //   const { tokenA, tokenB, pairAddress } = tokensStore.selectedTokens
  //   invariant(tokenA && tokenB && pairAddress)

  //   //   address token, not klay
  //   //   uint256 liquidity,
  //   //   uint256 amountTokenMin, // amountTokenMin = (liquidity * balance1) / _totalSupply;
  //   //   uint256 amountETHMin,   // amountTokenMin = (liquidity * wklayBalance) / _totalSupply;
  //   //   address to,
  //   //   uint256 deadline

  //   const pairContract = kaikas.cfg.createContract<DexPair>(pairAddress, PAIR_ABI)

  //   // const oneBN = new BigNumber('1')

  //   const pairBalance = (await pairContract.methods.balanceOf(pairAddress).call()) as Balance
  //   const totalSupply = new BigNumber(await pairContract.methods.totalSupply().call())
  //   const lpToken = new BigNumber(toWei('10', 'ether')) as ValueWei<BigNumber>

  //   await kaikas.cfg.approveAmount(pairAddress, PAIR_ABI, lpToken.toFixed(0))

  //   const computeTokenAmount = async (addr: Address) => {
  //     const contract = kaikas.cfg.createContract<KIP7>(addr, KIP7_ABI)
  //     const balance = new BigNumber(
  //       await contract.methods.balanceOf(pairAddress).call({
  //         from: selfAddr,
  //       }),
  //     )
  //     const amount = lpToken.multipliedBy(balance).dividedBy(totalSupply).minus(BN_ONE)
  //     return amount
  //   }

  //   // FIXME magic numbers. 5 minutes?
  //   const deadLine = Math.floor(Date.now() / 1000 + 300)

  //   const params = {
  //     addressA: tokenA.address,
  //     addressB: tokenB.address,
  //     lpToken: lpToken.toFixed(0),
  //     amount0: (await computeTokenAmount(tokenA.address)).minus(BN_ONE).toFixed(0),
  //     amount1: (await computeTokenAmount(tokenB.address)).minus(BN_ONE).toFixed(0),
  //     address: selfAddr,
  //     deadLine,
  //   }

  //   // - address tokenA,
  //   // - address tokenB,
  //   // - uint256 liquidity,
  //   // - uint256 amountAMin,
  //   // - uint256 amountBMin,
  //   // - address to,
  //   // - uint256 deadline

  //   const removeLiquidityMethod = () =>
  //     kaikas.cfg.contracts.router.methods.removeLiquidity(
  //       params.addressA,
  //       params.addressB,
  //       params.lpToken,
  //       params.amount0,
  //       params.amount1,
  //       params.address,
  //       params.deadLine,
  //     )

  //   const removeLiqGas = await removeLiquidityMethod().estimateGas({
  //     from: selfAddr,
  //     gasPrice: MAGIC_GAS_PRICE,
  //   })

  //   await removeLiquidityMethod().send({
  //     from: selfAddr,
  //     gasPrice: MAGIC_GAS_PRICE,
  //     gas: removeLiqGas,
  //   })
  // }

  // function setRmLiqValue(lpTokenValue: ValueEther<string>) {
  //   state.removeLiquidityPair = {
  //     ...state.removeLiquidityPair,
  //     lpTokenValue,
  //   }
  // }

  return {
    ...toRefs(state),

    quoteForToken,
    addLiquidityAmount,
    addLiquidityETH,
    calcRemoveLiquidityAmounts,
    // removeLiquidity,
    // removeLiquidityETH,
    // setRmLiqValue,
  }
})

if (import.meta.hot) import.meta.hot?.accept(acceptHMRUpdate(useLiquidityStore, import.meta.hot))