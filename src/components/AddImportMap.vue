<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button variant="outline">
        Add import map
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Add External Import Map</DialogTitle>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid w-full max-w-sm items-center gap-1.5">
          <Label for="import_map">
            Import map url:
          </Label>
          <Input id="import_map" />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit">
          Apply override
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>