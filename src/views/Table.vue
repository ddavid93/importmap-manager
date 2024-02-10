<script setup lang='ts'>
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import DataTable from '@/components/payments/DataTable.vue'
import {  Minus } from 'lucide-vue-next'
</script>

<template>
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
        <DataTable />
      </CardContent>
    </Card>
  </div>

</template>