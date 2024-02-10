<template>
  <div class="dark">
    <Button variant="outline" size="icon">
      <Braces class="w-6 h-6" />
    </Button>
    <div class="absolute inset-x-0 bottom-96 h-16">
      <Card>
        <CardHeader>
          <CardTitle>Import Map Overrides</CardTitle>
          <CardDescription>This developer tool allows you to view and override your import maps. Start by clicking on a
            module that you'd like to override.
          </CardDescription>
          <Button
            class="absolute right-4 top-4 rounded-sm opacity-70"
            variant="outline" size="icon">
            <Minus class="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent>
          <OverridesTable />
        </CardContent>
      </Card>
    </div>
  </div>

</template>
<script setup lang="ts">
import { Braces, Minus } from 'lucide-vue-next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import OverridesTable from '@/components/OverridesTable.vue'
</script>