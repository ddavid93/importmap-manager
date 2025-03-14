/**
 * Core implementation of the import-map-overrides API
 */

import type { ImportMap, ImportMapOverridesApi, ExternalOverrideMap, ExternalMapResponse } from './types';

import { escapeStringRegexp } from './string-regex';
import { includes } from './includes';
import {
  LOCAL_STORAGE_PREFIX,
  LOCAL_STORAGE_SCOPE_PREFIX,
  DISABLED_OVERRIDES_KEY,
  EXTERNAL_MAPS_KEY,
  OVERRIDE_ATTRIBUTE,
  CHANGE_EVENT_NAME,
  importMapType,
  importMapMetaElement,
  DEFAULT_PORT,
  PORT_PROTOCOL,
  DEFAULT_PORT_PATH
} from './constants';

import {
  createEmptyImportMap,
  buildFullOverrideMap,
  getDisabledOverrides,
  mergeImportMaps
} from './import-map';

import {
  setLocalStorageItem,
  getLocalStorageItem,
  removeLocalStorageItem
} from './storage-utils';

// Cache for external override map fetches
const externalOverrideMapPromises: Record<string, Promise<ExternalMapResponse>> = {};

/**
 * Gets the configured import map type
 * @returns Import map type (importmap or systemjs-importmap)
 */
export function getImportMapType(): string {
  return importMapType;
}

/**
 * Creates a URL from a port number
 * @param moduleName - Module name to create URL for
 * @param port - Port number
 * @returns Full URL
 */
export function getUrlFromPort(moduleName: string, port: string | number): string {
  try {
    // Check for custom port mapping in meta tag
    const portMappingElement = document.querySelector(
      `meta[name="importmap-override-port-${port}"]`
    );

    if (portMappingElement) {
      const portMapping = portMappingElement.getAttribute('content');
      if (portMapping) {
        return portMapping.replace(/\{moduleName\}/g, moduleName);
      }
    }

    // Check for default port mapping
    const defaultPortMappingElement = document.querySelector(
      'meta[name="importmap-override-default-port"]'
    );

    if (defaultPortMappingElement) {
      const defaultMapping = defaultPortMappingElement.getAttribute('content');
      if (defaultMapping) {
        return defaultMapping
          .replace(/\{port\}/g, port.toString())
          .replace(/\{moduleName\}/g, moduleName);
      }
    }

    // Use default mapping
    return DEFAULT_PORT_PATH
      .replace('PORT', port.toString())
      .replace('MODULENAME', moduleName)
      .replace(/^\/\//, `${PORT_PROTOCOL}://`);
  } catch (err) {
    console.error('Error generating URL from port:', err);
    return `${PORT_PROTOCOL}://localhost:${port}/${moduleName}`;
  }
}

/**
 * Fires an event to notify subscribers that overrides have changed
 */
function fireChangedEvent(): void {
  const event = new CustomEvent(CHANGE_EVENT_NAME);
  window.dispatchEvent(event);
}

/**
 * Initializes and returns the import-map-overrides API
 */
export function initializeImportMapOverridesApi(): ImportMapOverridesApi {
  // Get server-related configurations
  const serverOverrides = importMapMetaElement
    ? importMapMetaElement.hasAttribute('server-cookie')
    : false;

  const serverOnly = importMapMetaElement
    ? importMapMetaElement.hasAttribute('server-only')
    : false;

  // Cache for default map
  let defaultMapPromise: Promise<ImportMap> | null = null;

  const api: ImportMapOverridesApi = {
    // MAIN API METHODS

    addOverride(moduleName: string, url: string): ImportMap {
      // Handle port number shorthand
      const portRegex = /^\d+$/g;
      if (portRegex.test(url)) {
        url = api.getUrlFromPort(moduleName, url);
      }

      // Save to localStorage
      const key = LOCAL_STORAGE_PREFIX + moduleName;
      setLocalStorageItem(key, url);

      // Add server cookie if configured
      if (serverOverrides) {
        document.cookie = `${key}=${url}`;
      }

      // Notify listeners
      fireChangedEvent();

      return api.getOverrideMap();
    },

    addScopeOverride(scopeName: string, moduleName: string, url: string): ImportMap {
      // Handle port number shorthand
      const portRegex = /^\d+$/g;
      if (portRegex.test(url)) {
        url = api.getUrlFromPort(moduleName, url);
      }

      // Save to localStorage
      const key = `${LOCAL_STORAGE_SCOPE_PREFIX}${scopeName}:${moduleName}`;
      setLocalStorageItem(key, url);

      // Add server cookie if configured
      if (serverOverrides) {
        document.cookie = `${key}=${url}`;
      }

      // Notify listeners
      fireChangedEvent();

      return api.getOverrideMap();
    },

    getOverrideMap(includeDisabled = false): ImportMap {
      return buildFullOverrideMap(includeDisabled);
    },

    removeOverride(moduleName: string): ImportMap {
      const key = LOCAL_STORAGE_PREFIX + moduleName;
      removeLocalStorageItem(key);

      if (serverOverrides) {
        document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      }

      // Also remove from disabled list if present
      const disabledOverrides = api.getDisabledOverrides();
      const index = disabledOverrides.indexOf(moduleName);
      if (index >= 0) {
        disabledOverrides.splice(index, 1);
        setLocalStorageItem(DISABLED_OVERRIDES_KEY, JSON.stringify(disabledOverrides));
      }

      fireChangedEvent();

      return api.getOverrideMap();
    },

    removeScopeOverride(scopeName: string, moduleName: string): ImportMap {
      const fullKey = `${scopeName}:${moduleName}`;
      const key = `${LOCAL_STORAGE_SCOPE_PREFIX}${fullKey}`;

      removeLocalStorageItem(key);

      if (serverOverrides) {
        document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      }

      // Also remove from disabled list if present
      const disabledOverrides = api.getDisabledOverrides();
      const index = disabledOverrides.indexOf(fullKey);
      if (index >= 0) {
        disabledOverrides.splice(index, 1);
        setLocalStorageItem(DISABLED_OVERRIDES_KEY, JSON.stringify(disabledOverrides));
      }

      fireChangedEvent();

      return api.getOverrideMap();
    },

    resetOverrides(): void {
      const keysToRemove: string[] = [];

      // Find all override keys
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (
          key.startsWith(LOCAL_STORAGE_PREFIX) ||
          key.startsWith(LOCAL_STORAGE_SCOPE_PREFIX) ||
          key === DISABLED_OVERRIDES_KEY
        )) {
          keysToRemove.push(key);
        }
      }

      // Remove all keys
      keysToRemove.forEach(key => {
        removeLocalStorageItem(key);

        if (serverOverrides) {
          document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        }
      });

      fireChangedEvent();
    },

    // OVERRIDE MANAGEMENT

    getOverriddenModules(): string[] {
      const modules: string[] = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(LOCAL_STORAGE_PREFIX)) {
          modules.push(key.slice(LOCAL_STORAGE_PREFIX.length));
        }
      }

      return modules;
    },

    getOverriddenScopes(): Record<string, string[]> {
      const scopes: Record<string, string[]> = {};

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(LOCAL_STORAGE_SCOPE_PREFIX)) {
          const parts = key.slice(LOCAL_STORAGE_SCOPE_PREFIX.length).split(':');
          if (parts.length === 2) {
            const [scopeName, moduleName] = parts;

            if (!scopes[scopeName]) {
              scopes[scopeName] = [];
            }

            scopes[scopeName].push(moduleName);
          }
        }
      }

      return scopes;
    },

    enableOverride(moduleName: string, enabled: boolean): string[] {
      const disabledOverrides = api.getDisabledOverrides();
      const moduleIndex = disabledOverrides.indexOf(moduleName);

      if (enabled && moduleIndex >= 0) {
        // Enable by removing from disabled list
        disabledOverrides.splice(moduleIndex, 1);
        setLocalStorageItem(DISABLED_OVERRIDES_KEY, JSON.stringify(disabledOverrides));
        fireChangedEvent();
      } else if (!enabled && moduleIndex < 0) {
        // Disable by adding to disabled list
        disabledOverrides.push(moduleName);
        setLocalStorageItem(DISABLED_OVERRIDES_KEY, JSON.stringify(disabledOverrides));
        fireChangedEvent();
      }

      return disabledOverrides;
    },

    enableScopeOverride(scopeName: string, moduleName: string, enabled: boolean): string[] {
      const fullKey = `${scopeName}:${moduleName}`;
      return api.enableOverride(fullKey, enabled);
    },

    getDisabledOverrides(): string[] {
      return getDisabledOverrides();
    },

    hasOverride(moduleName: string): boolean {
      const key = LOCAL_STORAGE_PREFIX + moduleName;
      return localStorage.getItem(key) !== null;
    },

    hasScopeOverride(scopeName: string, moduleName: string): boolean {
      const key = `${LOCAL_STORAGE_SCOPE_PREFIX}${scopeName}:${moduleName}`;
      return localStorage.getItem(key) !== null;
    },

    getUrlFromPort(moduleName: string, port: string | number): string {
      return getUrlFromPort(moduleName, port);
    },

    // DOM MANIPULATION

    mount(): void {
      if (serverOnly) {
        // Skip client-side mounting in server-only mode
        return;
      }

      // Remove any existing override script tags
      const existingOverrideMap = document.querySelector(
        `script[${OVERRIDE_ATTRIBUTE}]`
      );
      if (existingOverrideMap) {
        existingOverrideMap.remove();
      }

      // Create and inject the import map
      const overrideMap = api.getOverrideMap();

      // Skip injection if map is empty
      if (
        Object.keys(overrideMap.imports).length === 0 &&
        (!overrideMap.scopes || Object.keys(overrideMap.scopes).length === 0)
      ) {
        return;
      }

// Create the