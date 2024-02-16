import { shallowReactive } from 'vue'

export function useConfiguration() {
  const configuration = shallowReactive({
    position: 'left'
  })
}
