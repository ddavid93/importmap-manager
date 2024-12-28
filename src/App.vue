<template>
  <FabButton :isOpen="isOpen" @close="isOpen = true" />
  <div v-show="isOpen" class="animate-expand-vertically absolute inset-x-0 bottom-96 h-16">
    <Card>
      <CardHeader>
        <CardTitle>Import Map Overrides</CardTitle>
        <CardDescription
          >This developer tool allows you to view and override your import maps. Start by clicking
          on a module that you'd like to override.
        </CardDescription>

        <button
          @click="mode = mode === 'dark' ? 'light' : 'dark'"
          class="absolute right-12 top-4 rounded-sm opacity-70"
        >
          <component :is="mode === 'dark' ? Moon : Sun" class="w-5 h-5 animate-fade-in" />
        </button>

        <button @click="isOpen = false" class="absolute right-4 top-4 rounded-sm opacity-70">
          <Minus class="w-5 h-5" />
        </button>
      </CardHeader>
      <CardContent>
        <OverridesTable />
      </CardContent>
    </Card>
  </div>
</template>
<script setup lang="ts">
/**
 * Very important since this is the init of Overrides
 */
import '@/original/api/js-api'
import { Minus, Moon, Sun } from 'lucide-vue-next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import OverridesTable from '@/components/OverridesTable.vue'
import { shallowRef } from 'vue'
import { useColorMode } from '@vueuse/core'
import FabButton from '@/components/FabButton.vue'

const mode = useColorMode()
const isOpen = shallowRef(true)
</script>
<style>
@import '@/assets/main.css';
</style>
