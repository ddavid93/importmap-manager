<template>
  <div id="widget">
    <Wrapper v-if="canLoadWidget" />
  </div>
</template>

<script setup lang="ts">
import { shallowRef, useAttrs } from "vue";
import Wrapper from "@/Wrapper.vue";

const attrs = useAttrs();
const activationStorage = attrs.activation as string;
const canLoadWidget = shallowRef(
  activationStorage && window.localStorage.getItem(activationStorage)
);
</script>

<style>
@import "@/assets/main.css";
</style>
