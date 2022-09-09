import TokenImpl from './TokenImpl'
import Wei, { WeiAsToken } from './Wei'

import { UniToken, UniCurrencyAmount } from './uni-entities'

export default class TokenAmount extends UniCurrencyAmount<UniToken> {
  public static fromWei(token: TokenImpl, amount: Wei): TokenAmount {
    const { numerator, denominator } = token.amountToFraction(amount.asBigInt)
    return new TokenAmount(token.toUni(), numerator, denominator)
  }

  public static fromToken(token: TokenImpl, amount: WeiAsToken): TokenAmount {
    const { numerator, denominator } = token.amountToFraction(amount, true)
    return new TokenAmount(token.toUni(), numerator, denominator)
  }

  public static fromUni(amount: UniCurrencyAmount<UniToken>): TokenAmount {
    return new TokenAmount(amount.currency, amount.numerator, amount.denominator)
  }

  public toWei(): Wei {
    return new Wei(this.numerator.toString())
  }
}
