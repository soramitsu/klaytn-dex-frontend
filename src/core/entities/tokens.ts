import { isEmptyAddress } from '../utils'
import type { Address, Token, TokenSymbol } from '../types'
import Wei from './Wei'
import CommonContracts from './CommonContracts'
import invariant from 'tiny-invariant'
import type { TokensPair, TokenType } from '@/utils/pair'
import { AgentPure, Agent } from './agent'
import { IsomorphicContract } from './isomorphic-contract'

export interface GetTokenQuoteProps extends TokensPair<Address> {
  value: Wei
  quoteFor: TokenType
}

export interface PairReserves {
  reserve0: Wei
  reserve1: Wei
}

/**
 * Depending on what token for we are going to compute `quote`,
 * we might swap reserves with each other
 */
function sortReservesForQuote({
  reserves,
  token0,
  tokenA,
  quoteFor,
}: {
  reserves: PairReserves
  token0: Address
  tokenA: Address
  quoteFor: TokenType
}): PairReserves {
  if (quoteFor === 'tokenB' && token0 === tokenA) return reserves
  return { reserve0: reserves.reserve1, reserve1: reserves.reserve0 }
}

/**
 * # Todo
 *
 * - optimize pair contract creation; use the same one for the set of operations
 */
export class TokensPure {
  #agent: AgentPure
  #contracts: CommonContracts

  public constructor(props: { agent: AgentPure; contracts: CommonContracts }) {
    this.#agent = props.agent
    this.#contracts = props.contracts
  }

  public async getTokenQuote({ tokenA, tokenB, value, quoteFor }: GetTokenQuoteProps): Promise<Wei> {
    const router = this.#contracts.get('router') || (await this.#contracts.init('router'))

    const contract = await this.createPairContract({ tokenA, tokenB })
    const token0 = (await contract.token0([]).call()) as Address
    const reserves = await this.getPairReserves({ tokenA, tokenB })

    const sortedReserves = sortReservesForQuote({ reserves, token0, tokenA, quoteFor })

    return new Wei(
      await router.quote([value.asStr, sortedReserves.reserve0.asStr, sortedReserves.reserve1.asStr]).call(),
    )
  }

  public async getPairReserves(tokens: TokensPair<Address>): Promise<PairReserves> {
    const contract = await this.createPairContract(tokens)
    const reserves = await contract.getReserves([]).call()
    return {
      reserve0: new Wei(reserves[0]),
      reserve1: new Wei(reserves[1]),
    }
  }

  /**
   * If there is no such a pair, returns an empty one (`0x00...`)
   */
  public async getPairAddress({ tokenA, tokenB }: TokensPair<Address>): Promise<Address> {
    const factory = this.#contracts.get('factory') || (await this.#contracts.init('factory'))
    const addr = (await factory.getPair([tokenA, tokenB]).call()) as Address
    return addr
  }

  public async getToken(address: Address): Promise<Token> {
    const contract = await this.#agent.createContract(address, 'kip7')
    const [name, symbol, decimals] = await Promise.all([
      contract.name([]).call(),
      contract.symbol([]).call() as Promise<TokenSymbol>,
      contract
        .decimals([])
        .call()
        .then((x) => Number(x)),
    ])
    return { address, name, symbol, decimals }
  }

  public async getTokenBalanceOfAddr(token: Address, balanceOf: Address): Promise<Wei> {
    const contract = await this.#agent.createContract(token, 'kip7')
    const balance = await contract.balanceOf([balanceOf]).call()
    return new Wei(balance)
  }

  public async createPairContract(pair: TokensPair<Address>): Promise<IsomorphicContract<'pair'>> {
    const pairAddr = await this.getPairAddress(pair)
    invariant(!isEmptyAddress(pairAddr), 'Empty address')
    return this.#agent.createContract(pairAddr, 'pair')
  }
}

export class Tokens extends TokensPure {
  #agent: Agent

  public constructor(props: { agent: Agent; contracts: CommonContracts }) {
    super(props)
    this.#agent = props.agent
  }

  private get address() {
    return this.#agent.address
  }

  public async getTokenBalanceOfUser(token: Address): Promise<Wei> {
    return this.getTokenBalanceOfAddr(token, this.address)
  }

  public async getKlayBalance(): Promise<Wei> {
    return this.#agent.getBalance(this.address)
  }

  /**
   * Fails if there is no such a pair
   */
  public async getPairBalanceOfUser(pair: TokensPair<Address>): Promise<{ totalSupply: Wei; userBalance: Wei }> {
    const contract = await this.createPairContract(pair)
    const totalSupply = new Wei(await contract.totalSupply([]).call())
    const userBalance = new Wei(await contract.balanceOf([this.address]).call())
    return { totalSupply, userBalance }
  }
}