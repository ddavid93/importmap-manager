<template>
  <TableHeader>
    <TableRow>
      <TableHead class="w-8 bg-background/95"></TableHead>
      <TableHead
        v-for="column in visibleColumns"
        :key="column.key"
        class="bg-background/95"
      >
        <Button
          class="flex items-center"
          variant="ghost"
          @click="onToggleSort(column.key)"
        >
          {{ column.label }}
          <ArrowUpDown
            v-if="sortConfig.key !== column.key"
            class="ml-2 h-4 w-4"
          />
          <ArrowUp
            v-else-if="sortConfig.direction === 'asc'"
            class="ml-2 h-4 w-4"
          />
          <ArrowDown v-else class="ml-2 h-4 w-4" />
        </Button>
      </TableHead>
    </TableRow>
  </TableHeader>
</template>

<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-vue-next";
import type {
  IOverridesTableColumn,
  OverridesTableColumnKeyType,
} from "@/types/importMap.ts";

defineProps<{
  visibleColumns: IOverridesTableColumn[];
  sortConfig: {
    key: OverridesTableColumnKeyType | null;
    direction: "asc" | "desc";
  };
  onToggleSort: (key: OverridesTableColumnKeyType) => void;
}>();
</script>