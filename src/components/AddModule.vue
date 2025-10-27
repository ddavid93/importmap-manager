<template>
  <ImportDialog
    v-model="open"
    :title="module_name ? 'Edit module' : 'New module'"
    btnTriggerLabel="Add new module"
    btnFooterLabel="Apply override"
    @submit="saveOverride"
  >
    <template #body>
      <div class="grid w-full max-w-full items-center gap-1.5">
        <Label for="name"> Module name: </Label>
        <Input id="name" v-model="name" :disabled="!!module_name" class="w-full" />
      </div>
      <div class="grid w-full max-w-full items-center gap-1.5">
        <Label for="url"> URL: </Label>
        <div class="flex items-center gap-2 w-full">
          <Checkbox v-model="enabled" class="shrink-0" />
          <OverrideInput
            v-if="isOverride"
            id="url"
            v-model="url"
            :class="{
              'rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset':
                isOverride && url !== domain,
            }"
            class="flex-1 min-w-0"
          /><Input
            v-else
            id="url"
            v-model="url"
            :class="{
              'rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset':
                isOverride && url !== domain,
            }"
            class="flex-1 min-w-0"
          />
        </div>

        <div
          v-if="urlOverrideFromImportMap && urlOverrideFromImportMap !== url"
          class="mt-4 p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
        >
          <div class="flex items-center" role="alert">
            <Home class="w-5 h-5 me-3 shrink-0" />
            <div class="break-all">
              {{ urlOverrideFromImportMap }}
            </div>
          </div>
        </div>
      </div>
    </template>
  </ImportDialog>
</template>

<script setup lang="ts">
import { Home } from "lucide-vue-next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { computed, shallowRef, watch } from "vue";
import { Checkbox } from "@/components/ui/checkbox";
import {
  type IModuleInfo,
  useImportMapOverrides,
} from "@/composables/useImportMapOverrides.ts";
import ImportDialog from "@/components/ImportDialog.vue";
import OverrideInput from "@/components/OverrideInput.vue";

const open = defineModel<boolean>("open", { default: false });
const props = defineProps<IModuleInfo>();
const { overrides, overridesFromImportMap, getItemOverride } =
  useImportMapOverrides();
const enabled = shallowRef<boolean>(true);
const name = shallowRef(props.module_name);
const url = shallowRef(getItemOverride(name.value)?.url || props.domain);

watch(props, () => {
  url.value = getItemOverride(props.module_name)?.url || props.domain;
  name.value = props.module_name;
  enabled.value = true;
});

const urlOverrideFromImportMap = computed(
  () => overridesFromImportMap.value.imports[name.value]
);

function saveOverride() {
  const findOverride = getItemOverride(name.value);
  if (findOverride) {
    findOverride.url = url.value;
    findOverride.enabled = enabled.value;
    findOverride.scope = props.scope;
    overrides.value = [
      ...overrides.value.filter((f) => f.name !== name.value),
      findOverride,
    ];
  } else {
    overrides.value.push({
      enabled: enabled.value,
      url: url.value,
      name: name.value,
      scope: props.scope,
    });
  }
  open.value = false;
}
</script>
