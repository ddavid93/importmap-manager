<template>
  <FabButton :isOpen="isOpen" @close="isOpen = true" />
  <div v-show="isOpen" class="animate-expand-vertically fixed inset-x-0 bottom-0">
    <div
      class="bg-background border rounded-lg shadow-lg m-2 flex flex-col max-h-[50vh] overflow-hidden"
    >
      <!-- Header -->
      <div class="relative flex-none p-6 pb-2 shrink-0">
        <div class="space-y-1.5">
          <h3 class="text-2xl font-semibold leading-none tracking-tight text-foreground">
            Import Map Manager
          </h3>
          <p class="text-sm text-muted-foreground">
            This developer tool allows you to view and override your import maps. Start by clicking
            on a module that you'd like to override.
          </p>
        </div>

        <button
          @click="mode = mode === 'dark' ? 'light' : 'dark'"
          class="absolute right-12 top-6 rounded-sm opacity-70 hover:opacity-100 transition"
        >
          <component
            :is="mode === 'dark' ? Moon : Sun"
            class="w-5 h-5 animate-fade-in text-foreground"
          />
        </button>

        <button
          @click="isOpen = false"
          class="absolute right-4 top-6 rounded-sm opacity-70 hover:opacity-100 transition"
        >
          <Minus class="w-5 h-5 text-foreground" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 pt-2 grow overflow-hidden flex flex-col">
        <OverridesTable :isOpen class="min-h-0 h-full"/>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
/**
 * Very important since this is the init of Overrides
 */
import '@/original/js-api'
import { Minus, Moon, Sun } from 'lucide-vue-next'
import { shallowRef, watch } from 'vue'
import { useColorMode, useMagicKeys } from '@vueuse/core'
import FabButton from '@/components/FabButton.vue'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import OverridesTable from '@/components/OverridesTable.vue'

const mode = useColorMode()
const isOpen = shallowRef(false)
const keys = useMagicKeys()
const CtrlAltD = keys['Ctrl+Alt+D']

watch(CtrlAltD, (v) => {
  if (v) {
    isOpen.value = !isOpen.value
  }
})
</script>
<style>
@import '@/assets/main.css';
</style>
