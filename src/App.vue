<template>
  <div>
    <Button v-show="!isOpened" @click="isOpened = true"
            class="fixed bottom-0 right-0 m-4 w-[50px] h-[50px] hover:animate-background-shine bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%]">
      <p class="text-gray-300">{ ··· }</p>
    </Button>
    <div v-show="isOpened"
         class="animate-expand-vertically absolute inset-x-0 bottom-96 h-16">
      <Card>
        <CardHeader>
          <CardTitle>Import Map Overrides</CardTitle>
          <CardDescription>This developer tool allows you to view and override your import maps. Start by clicking on a
            module that you'd like to override.
          </CardDescription>
          <button
            @click="isOpened= false"
            class="absolute right-4 top-4 rounded-sm opacity-70"
            variant="outline" size="icon">
            <Minus class="w-5 h-5" />
          </button>
        </CardHeader>
        <CardContent>
          <OverridesTable />
        </CardContent>
      </Card>
    </div>
  </div>

</template>
<script setup lang="ts">
import { Minus } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import OverridesTable from '@/components/OverridesTable.vue'
import { ref } from 'vue'

const isOpened = ref()
</script>