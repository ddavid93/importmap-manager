import { createSharedComposable, useLocalStorage } from "@vueuse/core";
import { computed } from "vue";
import { useImportMapOverrides } from "@/composables/useImportMapOverrides.ts";
import type { IOverrideInfo, IOverrideTemplate } from "@/types/importMap.ts";
import { deepCloneOverrideList, isEqual } from "@/lib/utils.ts";

export const IMPORT_MAP_MANAGER_TEMPLATES_KEY = "importmap-manager-templates";
function useImportMapTemplatesSingleton() {
  const { overrides } = useImportMapOverrides();

  const templates = useLocalStorage<IOverrideTemplate[]>(
    IMPORT_MAP_MANAGER_TEMPLATES_KEY,
    []
  );

  function normalizeOverrides(list: IOverrideInfo[]) {
    return [...list].sort((a, b) => a.name.localeCompare(b.name));
  }

  const areOverridesEqual = (a: IOverrideInfo, b: IOverrideInfo): boolean => {
    const scopeA = a.scope || {};
    const scopeB = b.scope || {};

    const isScopeEqual = isEqual(scopeA, scopeB);

    return (
      a.name === b.name &&
      a.url === b.url &&
      a.enabled === b.enabled &&
      isScopeEqual
    );
  };

  function areOverrideListsEqual(
    listA: IOverrideInfo[],
    listB: IOverrideInfo[]
  ): boolean {
    if (listA.length !== listB.length) {
      return false;
    }

    const normalizedA = normalizeOverrides(listA);
    const normalizedB = normalizeOverrides(listB);

    return normalizedA.every((overrideA, index) => {
      const overrideB = normalizedB[index];
      if (!overrideB) return false;
      return areOverridesEqual(overrideA, overrideB);
    });
  }

  const activeTemplateName = computed<string | null>(() => {
    const template = templates.value.find((t) =>
      areOverrideListsEqual(t.items, overrides.value)
    );
    return template ? template.name : null;
  });

  function saveTemplate(name: string) {
    const trimmed = name.trim();
    if (!trimmed) return false;
    const copy = deepCloneOverrideList(overrides.value);
    const existingIndex = templates.value.findIndex((t) => t.name === trimmed);
    if (existingIndex < 0) {
      templates.value.push({ name: trimmed, items: copy });
    } else {
      return false;
    }
    return true;
  }

  function applyTemplate(name: string) {
    const template = templates.value.find((t) => t.name === name);
    if (!template) return false;
    // Assign a deep-cloned copy to avoid mutating the stored template items via reactive edits
    overrides.value = deepCloneOverrideList(template.items);
    return true;
  }

  function deleteTemplate(name: string) {
    templates.value = templates.value.filter((t) => t.name !== name);
  }

  return {
    activeTemplateName,
    saveTemplate,
    applyTemplate,
    deleteTemplate,
    templates,
  };
}

export const useImportMapTemplates = createSharedComposable(
  useImportMapTemplatesSingleton
);
