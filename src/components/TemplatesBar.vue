<template>
  <div
    class="flex flex-col md:flex-row items-stretch md:items-center gap-2 w-full"
  >
    <!-- Save template dialog -->
    <div class="flex items-center gap-2">
      <Dialog v-model:open="isSaving">
        <DialogTrigger asChild>
          <Button :disabled="activeTemplateName?.length"> Add template </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save current overrides as a template</DialogTitle>
          </DialogHeader>
          <div class="grid gap-3 py-2">
            <label class="text-sm font-medium" for="template-name"
              >Template name</label
            >
            <Input
              id="template-name"
              ref="nameInput"
              v-model="templateName"
              class="h-9"
              placeholder="e.g. Staging setup"
              @keydown.enter.prevent="handleSave"
              @keydown.esc.prevent="cancelSaving"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" @click="cancelSaving">Cancel</Button>
            <Button :disabled="!templateName.trim().length" @click="handleSave"
              >Save</Button
            >
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>

    <!-- Templates list -->
    <div :key="templates.length" class="flex items-center flex-wrap gap-2">
      <template v-for="template in templates" :key="template.name">
        <div class="flex items-stretch">
          <Button
            :class="
              buttonVariants({
                variant:
                  activeTemplateName === template.name
                    ? 'success-outline'
                    : 'secondary',
              })
            "
            :title="template.name"
            class="group max-w-[220px] truncate"
            @click="apply(template.name)"
          >
            <span class="truncate min-w-0 flex-1">{{ template.name }}</span>
            <span
              :aria-label="`Delete template ${template.name}`"
              :title="`Delete ${template.name}`"
              class="ml-2 inline-flex items-center justify-center rounded-sm text-destructive/50 opacity-40 transition-opacity duration-150 ease-out group-hover:opacity-100 group-focus-within:opacity-100 hover:text-destructive focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              role="button"
              tabindex="0"
              @click.stop="remove(template.name)"
              @keydown.enter.stop.prevent="remove(template.name)"
              @keydown.space.stop.prevent="remove(template.name)"
            >
              <Trash class="w-4 h-4" />
            </span>
          </Button>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, ref, useTemplateRef, watch } from "vue";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useImportMapTemplates } from "@/composables/useImportMapTemplates.ts";
import { Trash } from "lucide-vue-next";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const {
  templates,
  saveTemplate,
  applyTemplate,
  deleteTemplate,
  activeTemplateName,
} = useImportMapTemplates();

const isSaving = ref(false);
const templateName = ref("");
const nameInput = useTemplateRef("nameInput");

watch(isSaving, (open) => {
  if (open) {
    templateName.value = "";
    nextTick(() => nameInput.value?.inputField?.focus());
  }
});

function cancelSaving() {
  isSaving.value = false;
  templateName.value = "";
}

function handleSave() {
  const ok = saveTemplate(templateName.value.trim());
  if (ok) {
    cancelSaving();
  }
}

function apply(name: string) {
  applyTemplate(name);
}

function remove(name: string) {
  deleteTemplate(name);
}
</script>
