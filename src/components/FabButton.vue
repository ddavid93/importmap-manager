<template>
  <div ref="containerDiv" :style style="position: fixed" @click="handleClick">
    <div
      :class="[
        {
          'bg-slate-800 hover:bg-slate-900': !hasOverrides,
          'bg-green-700 hover:bg-green-900': hasOverrides,
          'animate-pulse': isDragging
        },
        !disabled ? 'cursor-move' : 'cursor-pointer'
      ]"
      class="fixed w-[50px] h-[50px] rounded-md p-1 flex items-center justify-center"
      @mouseup="endPress"
      @mousedown="endPress"
    >
      <div class="w-full h-full flex items-center justify-center">
        <CodeXml class="text-gray-300" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, shallowRef, useTemplateRef, watch } from 'vue'
import { onLongPress, useDraggable, useStorage } from '@vueuse/core'
import { CodeXml } from 'lucide-vue-next'
import { useImportMapOverrides } from '@/composables/useImportMapOverrides.js'
import { useModal } from '@/composables/useModal.js'

const position = useStorage('draggable-position', { x: 0, y: 0 })
const disabled = shallowRef(true)
const wasDragged = shallowRef(false)

const { overrides, externalImportMap } = useImportMapOverrides()
const { dialogs } = useModal()
const hasOverrides = computed(
  () => overrides.value.some((override) => override.enabled) || externalImportMap.value?.enabled
)

const containerRef = useTemplateRef('containerDiv')
const { x, y, style, isDragging } = useDraggable(containerRef, {
  initialValue: position.value,
  preventDefault: true,
  disabled,
  onStart: () => (wasDragged.value = true)
})

onLongPress(
  containerRef,
  (event) => {
    disabled.value = false
    wasDragged.value = false
    containerRef.value.dispatchEvent(new PointerEvent('pointerdown', event))
  },
  { delay: 100 }
)

const endPress = () => {
  disabled.value = true
}

const handleClick = () => {
  if (!wasDragged.value) {
    dialogs.isWidgetOpened = !dialogs.isWidgetOpened
  }
  wasDragged.value = false
}

watch([x, y], () => {
  position.value = { x: x.value, y: y.value }
})
</script>
