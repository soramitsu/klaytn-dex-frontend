import BigNumber from 'bignumber.js'
import invariant from 'tiny-invariant'
import { Address, BigNumberIsh, Token, TokenSymbol } from '../types'
import { parseAddress, parseBigNumberIsh } from '../utils'

import { UniToken, UniFraction } from './uni-entities'

export default class TokenImpl implements Token {
  public static fromUni(uni: UniToken): TokenImpl {
    const { name, symbol, address, decimals } = uni
    invariant(name && symbol)
    return new TokenImpl({ name, symbol: symbol as TokenSymbol, decimals, address: parseAddress(address) })
  }

  public readonly address: Address
  public readonly symbol: TokenSymbol
  public readonly name: string
  public readonly decimals: number

  public constructor({ address, decimals, symbol, name }: Token) {
    this.address = address
    this.symbol = symbol
    this.name = name
    this.decimals = decimals
  }

  public toUni(): UniToken {
    return new UniToken(-1, this.address, this.decimals, this.symbol, this.name)
  }

  public amountToFraction(amount: BigNumberIsh, raw = false): UniFraction {
    const parsedAmount = parseBigNumberIsh(amount)
    const denominator = new BigNumber(10).pow(this.decimals)
    const numenator = raw ? BigInt(parsedAmount.multipliedBy(denominator).toFixed()) : BigInt(parsedAmount.toFixed())
    return new UniFraction(numenator.toString(), denominator.toFixed())
  }
}
