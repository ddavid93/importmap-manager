/**
 * Core import map manipulation utilities
 */

import { ImportMap } from './types';
import { getParameterByName } from './url-parameter';
import {
  LOCAL_STORAGE_PREFIX,
  LOCAL_STORAGE_SCOPE_PREFIX,
  DISABLED_OVERRIDES_KEY,
  QUERY_PARAM_NAME
} from './constants';
import { getLocalStorageItem } from './storage-utils';

/**
 * Creates an empty import map object
 * @returns Empty import map with imports and scopes
 */
export function createEmptyImportMap(): ImportMap {
  return {
    imports: {},
    scopes: {}
  };
}

/**
 * Gets overrides from the URL query parameter
 * @returns Import map from URL or null if none exists
 */
export function getQueryParamOverrides(): ImportMap | null {
  const queryParam = getParameterByName(
    QUERY_PARAM_NAME,
    window.location !== window.parent.location ? document.referrer : window.location.href
  );

  if (!queryParam) {
    return null;
  }

  try {
    return JSON.parse(queryParam);
  } catch (e) {
    throw new Error(`Invalid importMap query param - text content must be valid JSON`);
  }
}

/**
 * Retrieves all module overrides from localStorage
 * @returns Record of module name to URL mappings
 */
export function getModuleOverridesFromLocalStorage(): Record<string, string> {
  const overrides: Record<string, string> = {};

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(LOCAL_STORAGE_PREFIX)) {
      const moduleName = key.slice(LOCAL_STORAGE_PREFIX.length);
      const value = localStorage.getItem(key);
      if (value) {
        overrides[moduleName] = value;
      }
    }
  }

  return overrides;
}

/**
 * Retrieves all scope overrides from localStorage
 * @returns Record of scope to module mappings
 */
export function getScopeOverridesFromLocalStorage(): Record<string, Record<string, string>> {
  const scopeOverrides: Record<string, Record<string, string>> = {};

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(LOCAL_STORAGE_SCOPE_PREFIX)) {
      // Format is LOCAL_STORAGE_SCOPE_PREFIX + scopeName + ":" + moduleName
      const parts = key.slice(LOCAL_STORAGE_SCOPE_PREFIX.length).split(':');
      if (parts.length === 2) {
        const [scopeName, moduleName] = parts;
        const value = localStorage.getItem(key);

        if (!scopeOverrides[scopeName]) {
          scopeOverrides[scopeName] = {};
        }

        if (value) {
          scopeOverrides[scopeName][moduleName] = value;
        }
      }
    }
  }

  return scopeOverrides;
}

/**
 * Gets a list of disabled overrides
 * @returns Array of disabled module names
 */
export function getDisabledOverrides(): string[] {
  const disabledItem = getLocalStorageItem(DISABLED_OVERRIDES_KEY);
  if (!disabledItem) {
    return [];
  }

  try {
    return JSON.parse(disabledItem);
  } catch {
    console.error(`Error parsing disabled overrides from localStorage`);
    return [];
  }
}

/**
 * Builds a complete import map from all sources
 * @param includeDisabled - Whether to include disabled overrides
 * @returns Complete import map with all overrides
 */
export function buildFullOverrideMap(includeDisabled = false): ImportMap {
  const overrideMap = createEmptyImportMap();
  const disabledOverrides = includeDisabled ? [] : getDisabledOverrides();

  // Add module imports from localStorage
  const moduleOverrides = getModuleOverridesFromLocalStorage();
  Object.entries(moduleOverrides).forEach(([moduleName, url]) => {
    if (!disabledOverrides.includes(moduleName)) {
      overrideMap.imports[moduleName] = url;
    }
  });

  // Add scope overrides from localStorage
  const scopeOverrides = getScopeOverridesFromLocalStorage();
  Object.entries(scopeOverrides).forEach(([scopeName, modules]) => {
    const scopeKey = `${scopeName}:`;

    if (!overrideMap.scopes) {
      overrideMap.scopes = {};
    }

    if (!overrideMap.scopes[scopeName]) {
      overrideMap.scopes[scopeName] = {};
    }

    Object.entries(modules).forEach(([moduleName, url]) => {
      const fullKey = `${scopeName}:${moduleName}`;
      if (!disabledOverrides.includes(fullKey)) {
        overrideMap.scopes[scopeName][moduleName] = url;
      }
    });
  });

  // Add URL overrides
  const queryParamMap = getQueryParamOverrides();
  if (queryParamMap) {
    // Merge imports
    Object.entries(queryParamMap.imports || {}).forEach(([moduleName, url]) => {
      if (!disabledOverrides.includes(moduleName)) {
        overrideMap.imports[moduleName] = url as string;
      }
    });

    // Merge scopes
    if (queryParamMap.scopes) {
      if (!overrideMap.scopes) {
        overrideMap.scopes = {};
      }

      Object.entries(queryParamMap.scopes).forEach(([scopeName, modules]) => {
        if (!overrideMap.scopes![scopeName]) {
          overrideMap.scopes![scopeName] = {};
        }

        Object.entries(modules).forEach(([moduleName, url]) => {
          const fullKey = `${scopeName}:${moduleName}`;
          if (!disabledOverrides.includes(fullKey)) {
            overrideMap.scopes![scopeName][moduleName] = url as string;
          }
        });
      });
    }
  }

  return overrideMap;
}

/**
 * Merges two import maps together
 * @param base - Base import map to extend
 * @param extension - Import map to merge into the base
 * @returns Combined import map
 */
export function mergeImportMaps(base: ImportMap, extension: ImportMap): ImportMap {
  const merged: ImportMap = {
    imports: { ...base.imports }
  };

  // Merge regular imports
  Object.entries(extension.imports || {}).forEach(([key, value]) => {
    merged.imports[key] = value;
  });

  // Merge scopes
  if (base.scopes || extension.scopes) {
    merged.scopes = { ...(base.scopes || {}) };

    Object.entries(extension.scopes || {}).forEach(([scope, modules]) => {
      merged.scopes![scope] = { ...(merged.scopes![scope] || {}) };

      Object.entries(modules).forEach(([key, value]) => {
        merged.scopes![scope][key] = value;
      });
    });
  }

  return merged;
}