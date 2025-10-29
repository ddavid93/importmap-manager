<template>
  <div class="flex flex-row flex-wrap gap-2 py-4">
    <AddModule
      v-model:open="dialogs.newModule"
      v-bind="currentSelectedModule"
      class="flex-shrink-0"
    />
    <AddImportMap v-model:open="dialogs.newImportMap" class="bg-red flex-shrink-0" />
    <Button
      :disabled="!overrides.some((s) => s.enabled)"
      text=""
      :class="buttonVariants({ variant: 'warning' })"
      class="flex-shrink-0"
      @click="overrides = overrides.map((m) => ({ ...m, enabled: false }))"
    >
      Disable all overrides
    </Button>
    <ConfirmDelete
      v-model="dialogs.confirmRemove"
      :disabled="!overrides.length && !externalImportMap?.enabled"
      text="Remove all overrides"
      :color="buttonVariants({ variant: 'destructive' })"
      description="This will permanently remove your imports."
      class="flex-shrink-0"
      @confirm="removeAll"
    />
    <!-- Templates Bar next to remove all -->
    <TemplatesBar class="ml-auto flex-shrink-0" />
  </div>
</template>

<script setup lang="ts">
import { Button, buttonVariants } from "@/components/ui/button";
import ConfirmDelete from "@/components/ui/confirm-delete/ConfirmDelete.vue";
import AddModule from "@/components/AddModule.vue";
import AddImportMap from "@/components/AddImportMap.vue";
import TemplatesBar from "@/components/TemplatesBar.vue";
import { useModal } from "@/composables/useModal.ts";
import {
  type IModuleInfo,
  useImportMapOverrides,
} from "@/composables/useImportMapOverrides.ts";
import { watch } from "vue";

const currentSelectedModule = defineModel<IModuleInfo>({
  default: {
    module_name: "",
    domain: "",
    isOverride: false,
    scope: {},
  },
});
const { dialogs } = useModal();
const { overrides, externalImportMap, overridesFromImportMap } =
  useImportMapOverrides();

function removeAll() {
  externalImportMap.value = { enabled: false, url: "" };
  overrides.value = [];
  overridesFromImportMap.value = { imports: {}, scopes: {} };
}

watch(currentSelectedModule, (val) => {
  dialogs.newModule = !!val.module_name;
});

watch(
  () => dialogs.newModule,
  (val) => {
    if (!val) {
      currentSelectedModule.value = {
        module_name: "",
        domain: "",
        isOverride: false,
        scope: {},
      };
    }
  }
);
</script>
