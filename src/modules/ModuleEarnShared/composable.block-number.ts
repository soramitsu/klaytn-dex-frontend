import { Kaikas } from '@/core/kaikas'
import invariant from 'tiny-invariant'
import { Ref } from 'vue'

export function useBlockNumber(kaikas: Kaikas): Ref<number | null> {
  const blockNumber = ref<number | null>(null)
  const inc = () => {
    invariant(typeof blockNumber.value === 'number')
    blockNumber.value++
  }
  const { resume } = useIntervalFn(inc, 1000, { immediate: false })

  const { state } = useTask<number>(() => kaikas.cfg.caver.klay.getBlockNumber(), { immediate: true })
  wheneverFulfilled(state, (num) => {
    blockNumber.value = num
    resume()
  })

  return blockNumber
}
