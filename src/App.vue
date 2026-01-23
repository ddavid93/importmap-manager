<template>
  <div id="widget">
    <Wrapper v-if="canLoadWidget" />
  </div>
</template>

<script lang="ts" setup>
import { provide, shallowRef } from "vue";
import Wrapper from "@/Wrapper.vue";

const { activation = "importmap-manager", scriptType = "injector-importmap" } =
  defineProps<{
    activation?: string;
    scriptType?: "injector-importmap" | "systemjs-importmap";
  }>();

const canLoadWidget = shallowRef(
  import.meta.env.DEV || window.localStorage.getItem(activation)
);
provide("scriptType", scriptType);
</script>

<style>
@import "@/assets/main.css";
</style>
