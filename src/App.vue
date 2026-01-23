<template>
  <div id="widget">
    <Wrapper v-if="canLoadWidget" />
  </div>
</template>

<script lang="ts" setup>
import { provide, shallowRef } from "vue";
import Wrapper from "@/Wrapper.vue";
import { IMPORT_MAP_SCRIPT_TYPE_KEY } from "@/composables/useImportMapOverrides.ts";

const props = withDefaults(
  defineProps<{ activation?: string; importMapType?: string }>(),
  { importMapType: "injector-importmap" }
);

provide(IMPORT_MAP_SCRIPT_TYPE_KEY, props.importMapType);

const activationStorage = props.activation;
const canLoadWidget = shallowRef(
  import.meta.env.DEV ||
    (activationStorage && window.localStorage.getItem(activationStorage))
);
</script>

<style>
@import "@/assets/main.css";
</style>
