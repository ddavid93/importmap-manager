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
        Add new module
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>New module</DialogTitle>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid w-full max-w-sm items-center gap-1.5">
          <Label for="name">
            Module name:
          </Label>
          <Input id="name" />
        </div>
        <div class="grid w-full max-w-sm items-center gap-1.5">
          <Label for="url">
            Override URL:
          </Label>
          <Input id="url" />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit">
          Apply override || Reset to default
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>