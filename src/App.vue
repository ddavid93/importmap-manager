<template>
  <div id="widget">
    <Wrapper v-if="canLoadWidget" />
  </div>
</template>

<script lang="ts" setup>
import { shallowRef, useAttrs } from "vue";
import Wrapper from "@/Wrapper.vue";

const attrs = useAttrs();
const activationStorage = attrs.activation as string;
const canLoadWidget = shallowRef(
  import.meta.env.DEV ||
    (activationStorage && window.localStorage.getItem(activationStorage))
);
</script>

<style>
@import "@/assets/main.css";
</style>
