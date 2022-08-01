import { Address, Token, WeiRaw } from '@/core/kaikas'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { Except } from 'type-fest'
import { Ref } from 'vue'
import { REFETCH_POOLS_INTERVAL } from './const'

type ApolloToken = Except<Token, 'address'> & { id: Address }

export interface PoolsQueryResult {
  pools: {
    id: Address
    stakeToken: ApolloToken
    rewardToken: ApolloToken
    createdAtBlock: string
    totalTokensStaked: WeiRaw<string>
    endBlock: string
    users: {
      amount: WeiRaw<string>
    }[]
  }[]
}

export function usePoolsQuery(userId: Ref<Address | null>) {
  return useQuery<PoolsQueryResult>(
    gql`
      query PoolsQuery($userId: String!) {
        pools {
          id
          stakeToken {
            id
            decimals
            symbol
            name
          }
          rewardToken {
            id
            decimals
            symbol
            name
          }
          createdAtBlock
          totalTokensStaked
          endBlock
          users(where: { address: $userId }) {
            amount
          }
        }
      }
    `,
    () => ({
      userId: userId.value,
    }),
    {
      clientId: 'staking',
      pollInterval: REFETCH_POOLS_INTERVAL,
    },
  )
}
