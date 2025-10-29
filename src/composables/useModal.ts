import { createSharedComposable } from "@vueuse/core";
import { reactive } from "vue";

function useModalSingleton() {
  const dialogs = reactive({
    newModule: false,
    newImportMap: false,
    confirmDisable: false,
    confirmRemove: false,
    isWidgetOpened: false,
    command: false,
  });

  return { dialogs };
}

export const useModal = createSharedComposable(useModalSingleton);
