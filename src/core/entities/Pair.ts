import TokenImpl from './TokenImpl'
import { TokensPair } from '@/utils/pair'
import { Writable } from 'type-fest'
import TokenAmount from './TokenAmount'

import { UniPair, UniCurrencyAmount } from './uni-entities'

export default class Pair {
  public static fromUni(pair: UniPair): Pair {
    return new Pair({
      token0: TokenAmount.fromUni(pair.reserve0),
      token1: TokenAmount.fromUni(pair.reserve1),
      liquidityToken: TokenImpl.fromUni(pair.liquidityToken),
    })
  }

  #tokenAmounts: TokensPair<TokenAmount>
  #liquidityToken: TokenImpl

  public constructor({
    token0,
    token1,
    liquidityToken,
  }: {
    token0: TokenAmount
    token1: TokenAmount
    liquidityToken: TokenImpl
  }) {
    this.#tokenAmounts = { tokenA: token0, tokenB: token1 }
    this.#liquidityToken = liquidityToken
  }

  private get reserve0(): TokenAmount {
    return this.#tokenAmounts.tokenA
  }

  private get reserve1(): TokenAmount {
    return this.#tokenAmounts.tokenB
  }

  public toUni(): UniPair {
    const pair = new UniPair(this.reserve0, this.reserve1)
    ;(pair as Writable<UniPair, 'liquidityToken'>).liquidityToken = this.#liquidityToken.toUni()
    return pair
  }
}
