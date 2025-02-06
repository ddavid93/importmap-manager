<template>
  <div :style="style" ref="principalButton">
    <Button
      v-show="!isOpen"
      @click="$emit('close')"
      class="relative m-4 w-[50px] h-[50px] hover:animate-background-shine bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%]"
    >
      <p class="text-gray-300">{ ··· }</p>
    </Button>
  </div>
</template>
<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { shallowRef, unref } from 'vue'
import { useDraggable, type UseDraggableOptions, useStorage, watchDebounced } from '@vueuse/core'

defineProps<{ isOpen: boolean }>()
defineEmits(['close'])

const principalButton = shallowRef()
const stylesStorage = useStorage<UseDraggableOptions['initialValue']>(
  'draggable-importmap-manager',
  { x: 0, y: 0 }
)
// x=left and y=top
const { style, x, y } = useDraggable(principalButton, { initialValue: unref(stylesStorage.value) })

watchDebounced([x, y], () => (stylesStorage.value = { x: x.value, y: y.value }), { debounce: 1500 })
</script>
