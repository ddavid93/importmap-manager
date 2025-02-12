<template>
  <UseDraggable
    p="x-4 y-2"
    v-show="!isOpen"
    class="fixed cursor-move w-[50px] h-[50px] hover:animate-background-shine bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%]"
    :initial-value="position"
    prevent-default
    :storage-key="storageKey"
    storage-type="session"
    :disabled="isDraggingDisabled"
  >
    <div class="cursor-move p-1 w-full h-full flex flex-align-center justify-center">
      <div
        class="w-full h-full flex items-center justify-center cursor-pointer"
        @click="$emit('close')"
        @mouseenter="isDraggingDisabled = true"
        @mouseleave="isDraggingDisabled = false"
      >
        <p class="text-gray-300 select-none">{ ... }</p>
      </div>
    </div>
  </UseDraggable>
</template>
<script setup lang="ts">
import { UseDraggable } from '@vueuse/components'
import { computed, shallowRef } from 'vue'
import { useStorage, useWindowSize, watchDebounced } from '@vueuse/core'

const storageKey = 'dev-tools-fab-position'

defineProps<{ isOpen: boolean }>()
defineEmits(['close'])

const isDraggingDisabled = shallowRef(false)
const position = useStorage(storageKey, { x: 0, y: 0 })

const { width: windowWidth, height: windowHeight } = useWindowSize()

const constrainPosition = computed(() => {
  const elementWidth = 50
  const elementHeight = 50

  return {
    x: Math.max(0, Math.min(position.value.x, windowWidth.value - elementWidth)),
    y: Math.max(0, Math.min(position.value.y, windowHeight.value - elementHeight))
  }
})

watchDebounced(
  constrainPosition,
  (value) => {
    position.value = value
  },
  { debounce: 200 }
)
</script>
