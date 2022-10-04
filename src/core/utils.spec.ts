import { describe, test, expect } from 'vitest'
import { NATIVE_TOKEN } from './const'
import { formatAddress, parseAddress, isEmptyAddress, computeTransactionFee } from './utils'
import { Wei } from './entities'

describe('Formatting address', () => {
  const ADDRESS = parseAddress('0xae3a8a1D877a446b22249D8676AFeB16F056B44e')

  test.each([
    [4, 'ae3a....B44e'],
    [7, 'ae3a8a1....056B44e'],
    [4, '0xae3a....B44e', true],
  ] as Array<[number, string, boolean?]>)('with length %o formats to %o (prefix = %o)', (len, result, prefix) => {
    expect(formatAddress(ADDRESS, len, prefix)).toEqual(result)
  })
})

describe('Empty address check', () => {
  test('native token is not empty', () => {
    expect(isEmptyAddress(NATIVE_TOKEN)).toBe(false)
  })

  test('zero addr is empty', () => {
    expect(isEmptyAddress(parseAddress('0x0000000000000000000000000000000000000000'))).toBe(true)
  })
})

describe('compute transaction fee', () => {
  test('fee for 31000 gas', () => {
    // https://www.klaytnfinder.io/tx/0x2200c24c6495372dce76203a9c06661e3524cc7f84e6574d40d604ac629509a9
    expect(computeTransactionFee(new Wei(250000000000), 31_000).toToken({ decimals: 18 })).toEqual('0.00775')
  })
})
