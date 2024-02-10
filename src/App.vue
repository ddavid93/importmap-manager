<template>
  <div class="dark">
    <Button variant="outline" size="icon">
      <Braces class="w-6 h-6" />
    </Button>
    <Table/>
  </div>

</template>
<script setup lang="ts">
import Table from '@/views/Table.vue'
import {Braces} from 'lucide-vue-next'
</script>