<template>
  <div class="flex flex-col md:flex-row gap-2 py-4">
    <AddModule
      v-model:open="dialogs.newModule"
      v-bind="currentSelectedModule"
    />
    <AddImportMap v-model:open="dialogs.newImportMap" class="bg-red" />
    <ConfirmDelete
      v-model="dialogs.confirmDisable"
      :disabled="!overrides.some((s) => s.enabled)"
      text="Disable all overrides"
      :color="buttonVariants({ variant: 'warning' })"
      description="This will permanently disable your imports (but won't be removed from LocalStorage). You can still enable them back at any time."
      @confirm="overrides = overrides.map((m) => ({ ...m, enabled: false }))"
    />
    <ConfirmDelete
      v-model="dialogs.confirmRemove"
      :disabled="!overrides.length && !externalImportMap?.enabled"
      text="Remove all overrides"
      :color="buttonVariants({ variant: 'destructive' })"
      description="This will permanently remove your imports."
      @confirm="removeAll"
    />
  </div>
</template>

<script setup lang="ts">
import { buttonVariants } from "@/components/ui/button";
import ConfirmDelete from "@/components/ui/confirm-delete/ConfirmDelete.vue";
import AddModule from "@/components/AddModule.vue";
import AddImportMap from "@/components/AddImportMap.vue";
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
