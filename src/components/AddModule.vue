<template>
  <ImportDialog
    v-model="open"
    :title="module_name ? 'Edit module' : 'New module'"
    btnTriggerLabel="Add new module"
    btnFooterLabel="Apply override"
    @submit="saveOverride"
  >
    <template #body>
      <div class="grid w-full items-center gap-1.5">
        <Label for="name"> Module name: </Label>
        <Input id="name" v-model="name" :disabled="!!module_name" />
      </div>
      <div class="grid w-full items-center gap-1.5">
        <Label for="url"> URL: </Label>
        <div class="flex items-center gap-2">
          <Checkbox v-model="enabled" />
          <Input
            id="url"
            v-model="url"
            :class="{
              'rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset':
                isOverride && url !== domain,
            }"
          />
        </div>

        <div
          v-if="urlOverrideFromImportMap && urlOverrideFromImportMap !== url"
          class="mt-4 p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
        >
          <div class="flex items-center" role="alert">
            <InfoIcon class="w-5 h-5 me-3" />
            <div>
              {{ urlOverrideFromImportMap }}
            </div>
          </div>
        </div>
      </div>
    </template>
  </ImportDialog>
</template>

<script setup lang="ts">
import { InfoIcon } from "lucide-vue-next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { computed, shallowRef, watch } from "vue";
import { Checkbox } from "@/components/ui/checkbox";
import {
  type IModuleInfo,
  useImportMapOverrides,
} from "@/composables/useImportMapOverrides.ts";
import ImportDialog from "@/components/ImportDialog.vue";

const open = defineModel<boolean>("open", { default: false });
const props = defineProps<IModuleInfo>();
const { overrides, overridesFromImportMap, getItemOverride } =
  useImportMapOverrides();
const enabled = shallowRef(props.isOverride);
const name = shallowRef(props.module_name);
const url = shallowRef(getItemOverride(name.value)?.url || props.domain);

watch(props, () => {
  url.value = getItemOverride(props.module_name)?.url || props.domain;
  name.value = props.module_name;
  if (props.module_name && overridesFromImportMap.value.imports[name.value]) {
    enabled.value = url.value === urlOverrideFromImportMap.value;
  } else {
    enabled.value = props.isOverride;
  }
});

watch(url, () => {
  if (props.module_name) {
    enabled.value =
      getItemOverride(name.value)?.enabled ||
      url.value === urlOverrideFromImportMap.value;
  }
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
