<template>
  <div id="widget">
    <FabButton v-show="!dialogs.isWidgetOpened" />
    <div
      v-show="dialogs.isWidgetOpened"
      class="animate-expand-vertically fixed inset-x-0 bottom-0" style="z-index: 9000"
    >
      <div
        class="bg-background border rounded-lg shadow-lg m-2 flex flex-col max-h-[50vh] overflow-hidden"
      >
        <!-- Header -->
        <div class="relative flex-none p-6 pb-2 shrink-0">
          <div class="space-y-1.5">
            <h3
              class="text-2xl font-semibold leading-none tracking-tight text-foreground"
            >
              Import Map Manager
            </h3>
            <p class="text-sm text-muted-foreground">
              This developer tool allows you to view and override your import
              maps.
            </p>
          </div>

          <button
            type="button"
            class="absolute right-4 top-6 rounded-sm opacity-70 hover:opacity-100 transition"
            @click="dialogs.isWidgetOpened = false"
          >
            <Minus class="w-5 h-5 text-foreground" />
          </button>
        </div>

        <!-- Content -->
        <div class="p-6 pt-2 grow overflow-hidden flex flex-col">
          <OverridesTable />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Minus } from "lucide-vue-next";
import { watch } from "vue";
import { useMagicKeys } from "@vueuse/core";
import FabButton from "@/components/FabButton.vue";
import OverridesTable from "@/components/OverridesTable.vue";
import { useModal } from "@/composables/useModal.ts";

const { dialogs } = useModal();
const keys = useMagicKeys();
const CtrlAltD = keys["Ctrl+Alt+D"];

watch(CtrlAltD, (v) => {
  if (v) {
    dialogs.isWidgetOpened = !dialogs.isWidgetOpened;
  }
});
</script>

<style>
@import "@/assets/main.css";
</style>
