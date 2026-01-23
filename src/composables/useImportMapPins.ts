import { createSharedComposable, useLocalStorage } from "@vueuse/core";
import type { IModuleInfo } from "@/types/importMap.ts";

export const IMPORT_MAP_MANAGER_PINNED_KEY = "importmap-manager:pinned-modules";

function useImportMapPinsSingleton() {
  const pinnedIds = useLocalStorage<string[]>(
    IMPORT_MAP_MANAGER_PINNED_KEY,
    []
  );

  function toIdentifier(target: string | IModuleInfo): string {
    return typeof target === "string" ? target : target.module_name;
  }

  function isPinned(target: string | IModuleInfo): boolean {
    const identifier = toIdentifier(target);
    return pinnedIds.value.includes(identifier);
  }

  function setPinned(target: string | IModuleInfo, pinned: boolean): void {
    const identifier = toIdentifier(target);
    const isCurrentlyPinned = pinnedIds.value.includes(identifier);

    if (pinned && !isCurrentlyPinned) {
      pinnedIds.value = [...pinnedIds.value, identifier];
    } else if (!pinned && isCurrentlyPinned) {
      pinnedIds.value = pinnedIds.value.filter((id) => id !== identifier);
    }
  }

  function togglePin(target: string | IModuleInfo): void {
    setPinned(target, !isPinned(target));
  }

  return {
    pinnedIds,
    isPinned,
    togglePin,
  };
}

export const useImportMapPins = createSharedComposable(
  useImportMapPinsSingleton
);
