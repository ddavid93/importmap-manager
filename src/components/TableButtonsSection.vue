<template>
  <div class="flex flex-row flex-wrap gap-2 py-4">
    <AddModule
      v-model:open="dialogs.newModule"
      class="flex-shrink-0"
      v-bind="currentSelectedModule"
    />
    <AddImportMap
      v-model:open="dialogs.newImportMap"
      class="bg-red flex-shrink-0"
    />
    <Button
      :class="buttonVariants({ variant: 'warning' })"
      :disabled="!overrides.some((s) => s.enabled)"
      class="flex-shrink-0"
      text=""
      @click="overrides = overrides.map((m) => ({ ...m, enabled: false }))"
    >
      Disable all overrides
    </Button>
    <ConfirmDelete
      v-model="dialogs.confirmRemove"
      :color="buttonVariants({ variant: 'destructive' })"
      :disabled="!overrides.length && !externalImportMap?.enabled"
      class="flex-shrink-0"
      description="This will permanently remove your imports."
      text="Remove all overrides"
      @confirm="removeAll"
    />
    <!-- Templates Bar next to remove all -->
    <TemplatesBar class="ml-auto flex-shrink-0" />
  </div>
</template>

<script lang="ts" setup>
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
