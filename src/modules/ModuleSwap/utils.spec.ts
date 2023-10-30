import { describe, expect, test } from 'vitest'
import { computeFeesByAmounts } from './utils'
import { Percent, Wei } from '@/core'
import { TOKENS_LIST } from '../../../test/util'

describe('Compute fees', () => {
  test('Single swap', () => {
    const path = TOKENS_LIST.slice(0, 2)
    const amounts = [new Wei(1000), new Wei(2000)]

    expect(computeFeesByAmounts({ amounts, path, commission: new Percent(3, 1000) })).toMatchInlineSnapshot(`
      [
        {
          "fee": "3",
          "pair": [
            {
              "address": "0x1e8d0A7F0Cc9B6F840Ca407586A648834A7187aD",
              "decimals": 18,
              "name": "KLAY",
              "symbol": "KLAY",
            },
            {
              "address": "0xeB800b8ac8B503e2544F4dfc3EF7012793172b9b",
              "decimals": 18,
              "name": "DEX Token",
              "symbol": "DEX",
            },
          ],
        },
      ]
    `)
  })

  test('Multi-step swap', () => {
    const path = TOKENS_LIST.slice(0, 3)
    const amounts = [new Wei(1000), new Wei(2000), new Wei(3000)]

    expect(computeFeesByAmounts({ amounts, path, commission: new Percent(1, 10) })).toMatchInlineSnapshot(`
      [
        {
          "fee": "100",
          "pair": [
            {
              "address": "0x1e8d0A7F0Cc9B6F840Ca407586A648834A7187aD",
              "decimals": 18,
              "name": "KLAY",
              "symbol": "KLAY",
            },
            {
              "address": "0xeB800b8ac8B503e2544F4dfc3EF7012793172b9b",
              "decimals": 18,
              "name": "DEX Token",
              "symbol": "DEX",
            },
          ],
        },
        {
          "fee": "200",
          "pair": [
            {
              "address": "0xeB800b8ac8B503e2544F4dfc3EF7012793172b9b",
              "decimals": 18,
              "name": "DEX Token",
              "symbol": "DEX",
            },
            {
              "address": "0xb9920bd871e39c6ef46169c32e7ac4c698688881",
              "decimals": 18,
              "name": "Mercury",
              "symbol": "MER",
            },
          ],
        },
      ]
    `)
  })

  test("Throws an error if the amounts count doesn't match the path's length", () => {
    expect(() =>
      computeFeesByAmounts({ amounts: [], path: TOKENS_LIST.slice(0, 3), commission: new Percent(0) }),
    ).toThrow()
  })
})
