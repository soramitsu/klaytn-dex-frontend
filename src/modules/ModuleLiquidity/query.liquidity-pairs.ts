import { Address } from '@/core/kaikas'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { Opaque } from 'type-fest'

export interface LiquidityPairsResult {
  user: null | {
    liquidityPositions: Array<LiquidityPairsPosition>
  }
}

export interface LiquidityPairsPosition {
  liquidityTokenBalance: LiquidityPairValueRaw
  pair: LiquidityPairsPositionItem
}

export interface LiquidityPairsPositionItem {
  id: Address
  name: string
  token0: { id: Address }
  token1: { id: Address }
  totalSupply: LiquidityPairValueRaw
  token1Price: LiquidityPairValueRaw
  reserve0: LiquidityPairValueRaw
  reserve1: LiquidityPairValueRaw
  reserveKLAY: LiquidityPairValueRaw
  reserveUSD: LiquidityPairValueRaw
  volumeUSD: LiquidityPairValueRaw
}

export type LiquidityPairValueRaw = Opaque<string, 'ValueRaw'>

export function useLiquidityPairsQuery() {
  const kaikasStore = useKaikasStore()

  return useQuery<LiquidityPairsResult>(
    gql`
      query GetUserPairs($id: String!) {
        user(id: $id) {
          liquidityPositions {
            liquidityTokenBalance
            pair {
              id
              name
              reserve0
              reserve1
              token0 {
                id
                name
                symbol
              }
              token1 {
                id
                name
                symbol
              }
              reserveKLAY
              reserveUSD
              token1Price
              totalSupply
              volumeUSD
            }
          }
        }
      }
    `,
    () => ({
      id: kaikasStore.address,
    }),
    () => ({
      enabled: !!kaikasStore.address,
      clientId: 'exchange',
    }),
  )
}