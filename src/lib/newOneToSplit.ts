/**
 * import-map-overrides.ts
 *
 * This module provides a robust API for managing import map overrides,
 * including support for both “imports” and “scopes.” It reads configuration
 * from meta tags and localStorage, fetches external override maps, and emits
 * custom events when changes occur.
 *
 * For more details, please see:
 * - Import maps spec: https://html.spec.whatwg.org/multipage/webappapis.html#import-maps
 * - Project docs: https://github.com/single-spa/import-map-overrides/blob/main/docs
 */

/* ============================================================================
   Type Definitions & Constants
   ========================================================================== */

/**
 * Interface representing an Import Map.
 */
export interface ImportMap {
  imports: { [moduleName: string]: string };
  scopes: { [scope: string]: { [moduleName: string]: string } };
}

// Constants used for localStorage keys, meta attributes, etc.
const localStoragePrefix = 'import-map-override:';
const localStorageScopePrefix = 'import-map-override-scope:';
const disabledOverridesLocalStorageKey = 'import-map-overrides-disabled';
const externalOverridesLocalStorageKey = 'import-map-overrides-external-maps';
const overrideAttribute = 'data-is-importmap-override';
const domainsMeta = 'import-map-overrides-domains';
const allowListPrefix = 'allowlist:';
const denyListPrefix = 'denylist:';
export const queryParamOverridesName = 'imo';

const importMapMetaElement = document.querySelector('meta[name="importmap-type"]');
const domainsElement = document.querySelector(`meta[name="${domainsMeta}"]`);

/**
 * The type of import maps. Defaults to "importmap" if no meta tag is found.
 */
export const importMapType: string = importMapMetaElement
  ? importMapMetaElement.getAttribute('content') || 'importmap'
  : 'importmap';

/* ============================================================================
   Utility Functions
   ========================================================================== */

/**
 * Escapes a string so it can be safely used within a RegExp.
 * @param str - The string to escape.
 * @returns The escaped string.
 */
function escapeStringRegexp(str: string): string {
  return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');
}

/**
 * Checks whether an array includes a given value.
 * @param array - The array to check.
 * @param value - The value to search for.
 * @returns True if found, false otherwise.
 */
function includes<T>(array: T[], value: T): boolean {
  return array.indexOf(value) >= 0;
}

/**
 * Returns the value of a query parameter from a URL.
 * @param name - The parameter name.
 * @param url - The URL string (defaults to window.location.href).
 * @returns The parameter value or null if not found.
 */
function getParameterByName(name: string, url?: string): string | null {
  if (!url) url = window.location.href;
  name = name.replace(/[[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

/**
 * Checks if localStorage is accessible.
 * @returns True if accessible, false otherwise.
 */
function canAccessLocalStorage(): boolean {
  try {
    localStorage.getItem('test');
    return true;
  } catch {
    return false;
  }
}

/**
 * Expands a relative URL using a base URL.
 * @param url - The URL to expand.
 * @param baseUrl - The base URL.
 * @returns The absolute URL.
 */
function expandRelativeUrl(url: string, baseUrl: string): string {
  try {
    const outUrl = new URL(url, baseUrl);
    return outUrl.href;
  } catch (err) {
    return url;
  }
}

/**
 * Expands relative URLs in an imports object.
 * @param imports - An object mapping module names to URLs.
 * @param baseUrl - The base URL.
 * @returns A new object with expanded URLs.
 */
function expandRelativeUrlImports(imports: Record<string, string>, baseUrl: string): Record<string, string> {
  return Object.entries(imports).reduce((result, [key, value]) => {
    result[key] = expandRelativeUrl(value, baseUrl);
    return result;
  }, {} as Record<string, string>);
}

/**
 * Expands relative URLs in an entire import map.
 * @param importMap - The original import map.
 * @param baseUrl - The base URL.
 * @returns A new ImportMap with all URLs expanded.
 */
function expandRelativeUrlsInImportMap(importMap: ImportMap, baseUrl: string): ImportMap {
  const expandedImports = expandRelativeUrlImports(importMap.imports || {}, baseUrl);
  const expandedScopes = Object.keys(importMap.scopes || {}).reduce((result, scopeKey) => {
    result[scopeKey] = expandRelativeUrlImports(importMap.scopes[scopeKey], baseUrl);
    return result;
  }, {} as Record<string, Record<string, string>>);
  return { imports: expandedImports, scopes: expandedScopes };
}

/**
 * Merges two import maps together.
 * Later maps take precedence over earlier maps.
 * @param originalMap - The original import map.
 * @param newMap - The new import map to merge.
 * @returns The merged ImportMap.
 */
function mergeImportMaps(originalMap: ImportMap, newMap: ImportMap): ImportMap {
  return {
    imports: { ...originalMap.imports, ...newMap.imports },
    scopes: { ...originalMap.scopes, ...newMap.scopes }
  };
}

/**
 * Creates an empty ImportMap.
 * @returns An ImportMap with empty imports and scopes.
 */
function createEmptyImportMap(): ImportMap {
  return { imports: {}, scopes: {} };
}

/* ============================================================================
   External Map Fetching & Caching
   ========================================================================== */

/**
 * Caches promises for fetched external override maps.
 */
const externalOverrideMapPromises: { [url: string]: Promise<ImportMap> } = {};

/**
 * Fetches an external import map from the given URL.
 * If the fetch fails or the JSON is invalid, an empty map is returned.
 * @param url - The URL to fetch.
 * @returns A Promise resolving to an ImportMap.
 */
async function fetchExternalMap(url: string): Promise<ImportMap> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(new Error(`Unable to download external override import map from ${response.url}. Status: ${response.status}`));
      ImportMapOverrides.invalidExternalMaps.push(response.url);
      return createEmptyImportMap();
    }
    let json: any;
    try {
      json = await response.json();
    } catch (err) {
      console.warn(new Error(`Invalid JSON in external override import map from ${response.url}. ${err}`));
      ImportMapOverrides.invalidExternalMaps.push(response.url);
      return createEmptyImportMap();
    }
    return expandRelativeUrlsInImportMap(json as ImportMap, url);
  } catch (err) {
    console.warn(new Error(`Unable to download external import map at '${url}'. ${err}`));
    ImportMapOverrides.invalidExternalMaps.push(new URL(url, document.baseURI).href);
    return createEmptyImportMap();
  }
}

/* ============================================================================
   Event Manager
   ========================================================================== */

/**
 * EventManager is responsible for dispatching custom events.
 */
class EventManager {
  private static canFireCustomEvents: boolean = (() => {
    try {
      if (typeof CustomEvent === 'function') {
        new CustomEvent('test');
        return true;
      }
    } catch (e) {
      // Fallback for older browsers.
    }
    return false;
  })();

  /**
   * Fires a custom event of the given type.
   * @param type - The event type (e.g. "init", "change").
   */
  static fireEvent(type: string): void {
    setTimeout(() => {
      const eventType = `import-map-overrides:${type}`;
      let event: CustomEvent;
      if (this.canFireCustomEvents) {
        event = new CustomEvent(eventType);
      } else {
        event = document.createEvent('CustomEvent');
        event.initCustomEvent(eventType, true, true, null);
      }
      window.dispatchEvent(event);
    });
  }
}

/* ============================================================================
   Storage Manager
   ========================================================================== */

/**
 * StorageManager wraps localStorage interactions.
 */
class StorageManager {
  /**
   * Sets an item in localStorage.
   * @param key - The key.
   * @param value - The value.
   */
  static setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  /**
   * Retrieves an item from localStorage.
   * @param key - The key.
   * @returns The stored value or null.
   */
  static getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  /**
   * Removes an item from localStorage.
   * @param key - The key.
   */
  static removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * Retrieves all key/value pairs from localStorage that start with a given prefix.
   * @param prefix - The key prefix.
   * @returns An array of [key, value] tuples.
   */
  static getItemsWithPrefix(prefix: string): [string, string][] {
    const items: [string, string][] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        const value = localStorage.getItem(key);
        if (value !== null) {
          items.push([key, value]);
        }
      }
    }
    return items;
  }
}

/* ============================================================================
   Main ImportMapOverrides API
   ========================================================================== */

/**
 * The ImportMapOverrides class provides methods to manage and override import maps.
 * It supports both import and scope overrides.
 */
export class ImportMapOverrides {
  /**
   * List of URLs for which external maps are invalid.
   */
  static invalidExternalMaps: string[] = [];

  public disabled: boolean = false;
  private serverOverrides: boolean = false;
  private serverOnly: boolean = false;
  private defaultMapPromise?: Promise<ImportMap>;
  private initialOverrideMap: ImportMap = createEmptyImportMap();
  private initialExternalOverrideMaps: string[] = [];
  private referenceNode: Element | null = null;

  constructor() {
    // Determine if overrides should be disabled based on domains meta tag.
    this.disabled = this.computeDisabledState();

    if (!canAccessLocalStorage()) {
      console.warn('Disabling import-map-overrides because localStorage is not accessible.');
      this.disabled = true;
    }

    if (!this.disabled) {
      this.init();
    }
  }

  /**
   * Computes whether the overrides should be disabled based on the domains meta tag.
   * @returns True if overrides are disabled.
   */
  private computeDisabledState(): boolean {
    if (domainsElement) {
      const content = domainsElement.getAttribute('content');
      if (!content) {
        console.warn(`Invalid ${domainsMeta} meta element – content is required.`);
        return false;
      }
      const matchHostname = (domain: string): boolean => {
        const escaped = escapeStringRegexp(domain).replace('\\*', '.+');
        return new RegExp(escaped).test(window.location.hostname);
      };
      if (content.startsWith(allowListPrefix)) {
        const allowedDomains = content.slice(allowListPrefix.length).split(',');
        return !allowedDomains.some(matchHostname);
      } else if (content.startsWith(denyListPrefix)) {
        const deniedDomains = content.slice(denyListPrefix.length).split(',');
        return deniedDomains.some(matchHostname);
      } else {
        console.log(`Invalid ${domainsMeta} meta content – must start with ${allowListPrefix} or ${denyListPrefix}`);
      }
    }
    return false;
  }

  /**
   * Initializes the import map override system.
   */
  private init(): void {
    this.serverOverrides = importMapMetaElement ? importMapMetaElement.hasAttribute('server-cookie') : false;
    this.serverOnly = importMapMetaElement ? importMapMetaElement.hasAttribute('server-only') : false;

    // Expose the API globally for backward compatibility.
    (window as any).importMapOverrides = this;

    // Save the initial override map and external override URLs.
    this.initialOverrideMap = this.getOverrideMap();
    this.initialExternalOverrideMaps = this.getExternalOverrides();

    // Find the overridable import map, if it exists.
    const overridableImportMap = document.querySelector('script[type="overridable-importmap"]');
    this.referenceNode = overridableImportMap ? overridableImportMap : this.getLastImportMapScript();

    if (overridableImportMap) {
      if ((overridableImportMap as HTMLScriptElement).src) {
        throw new Error(`import-map-overrides: External import maps with type="overridable-importmap" are not supported`);
      }
      let originalMap: ImportMap;
      try {
        originalMap = JSON.parse(overridableImportMap.textContent || '{}');
      } catch (e) {
        throw new Error(`Invalid <script type="overridable-importmap"> – text content must be valid JSON`);
      }
      const mergedMap = mergeImportMaps(originalMap, this.initialOverrideMap);
      this.referenceNode = this.insertOverrideMap(mergedMap, 'import-map-overrides', this.referenceNode);
      this.insertAllExternalOverrideMaps();
    } else {
      this.insertAllExternalOverrideMaps();
      if (
        Object.keys(this.initialOverrideMap.imports).length > 0 ||
        Object.keys(this.initialOverrideMap.scopes).length > 0
      ) {
        this.referenceNode = this.insertOverrideMap(this.initialOverrideMap, 'import-map-overrides', this.referenceNode);
      }
    }

    EventManager.fireEvent('init');
  }

  /**
   * Retrieves the last script element that is an import map.
   * @returns The last import map script element or null.
   */
  private getLastImportMapScript(): Element | null {
    const importMaps = document.querySelectorAll(`script[type="${importMapType}"]`);
    return importMaps.length > 0 ? importMaps[importMaps.length - 1] : null;
  }

  /**
   * Inserts an override map (as a script element) into the document.
   * @param map - The import map (or a URL string) to insert.
   * @param id - The element ID.
   * @param referenceNode - The node after which to insert the new element.
   * @returns The inserted script element.
   */
  private insertOverrideMap(map: ImportMap | string, id: string, referenceNode: Element | null): Element {
    const overrideMapElement = document.createElement('script');
    overrideMapElement.type = importMapType;
    overrideMapElement.id = id;
    overrideMapElement.setAttribute(overrideAttribute, '');
    if (typeof map === 'string') {
      (overrideMapElement as HTMLScriptElement).src = map;
    } else {
      overrideMapElement.textContent = JSON.stringify(map, null, 2);
    }
    if (referenceNode) {
      referenceNode.insertAdjacentElement('afterend', overrideMapElement);
    } else {
      document.head.appendChild(overrideMapElement);
    }
    return overrideMapElement;
  }

  /**
   * Inserts all external override maps into the document.
   */
  private insertAllExternalOverrideMaps(): void {
    if (this.initialExternalOverrideMaps.length > 0) {
      this.initialExternalOverrideMaps.forEach((mapUrl, index) => {
        this.referenceNode = this.insertOverrideMap(mapUrl, `import-map-overrides-external-${index}`, this.referenceNode);
      });
    }
  }

  /**
   * Retrieves the current override map by merging localStorage and URL query parameter overrides.
   * Both import and scope overrides are supported.
   * @param includeDisabled - Whether to include overrides marked as disabled.
   * @returns The combined ImportMap.
   */
  public getOverrideMap(includeDisabled: boolean = false): ImportMap {
    const overrides: ImportMap = createEmptyImportMap();
    const disabledOverrides = this.getDisabledOverrides();

    /**
     * Helper to set an override in the appropriate section.
     * @param moduleName - The module name.
     * @param path - The override URL.
     * @param isScope - True if this is a scope override.
     * @param scope - The scope key (if applicable).
     */
    const setOverride = (
      moduleName: string,
      path: string,
      isScope: boolean = false,
      scope?: string
    ): void => {
      if (includeDisabled || !includes(disabledOverrides, moduleName)) {
        if (isScope && scope) {
          if (!overrides.scopes[scope]) {
            overrides.scopes[scope] = {};
          }
          overrides.scopes[scope][moduleName] = path;
        } else {
          overrides.imports[moduleName] = path;
        }
      }
    };

    // Process import overrides from localStorage.
    StorageManager.getItemsWithPrefix(localStoragePrefix).forEach(([key, value]) => {
      const moduleName = key.slice(localStoragePrefix.length);
      setOverride(moduleName, value);
    });

    // Process scope overrides from localStorage.
    StorageManager.getItemsWithPrefix(localStorageScopePrefix).forEach(([key, value]) => {
      const remainder = key.slice(localStorageScopePrefix.length);
      const parts = remainder.split('|');
      if (parts.length === 2) {
        const [scope, moduleName] = parts;
        setOverride(moduleName, value, true, scope);
      }
    });

    // Process URL query parameter overrides (if provided).
    const queryParam = getParameterByName(
      queryParamOverridesName,
      window.location !== window.parent.location ? document.referrer : window.location.href
    );
    if (queryParam) {
      let queryParamImportMap: ImportMap;
      try {
        queryParamImportMap = JSON.parse(queryParam);
      } catch (e) {
        throw new Error(`Invalid importMap query parameter – content must be valid JSON`);
      }
      if (queryParamImportMap.imports) {
        Object.keys(queryParamImportMap.imports).forEach((moduleName) => {
          setOverride(moduleName, queryParamImportMap.imports[moduleName]);
        });
      }
      if (queryParamImportMap.scopes) {
        Object.keys(queryParamImportMap.scopes).forEach((scope) => {
          Object.keys(queryParamImportMap.scopes[scope]).forEach((moduleName) => {
            setOverride(moduleName, queryParamImportMap.scopes[scope][moduleName], true, scope);
          });
        });
      }
    }
    return overrides;
  }

  /**
   * Adds an import override.
   * If the URL is a port number, it converts it into a localhost URL.
   * @param moduleName - The module name.
   * @param url - The override URL or port.
   * @returns The updated override map.
   */
  public addOverride(moduleName: string, url: string): ImportMap {
    const portRegex = /^\d+$/;
    if (portRegex.test(url)) {
      url = this.getUrlFromPort(moduleName, url);
    }
    const key = localStoragePrefix + moduleName;
    StorageManager.setItem(key, url);
    if (this.serverOverrides) {
      document.cookie = `${key}=${url}`;
    }
    EventManager.fireEvent('change');
    return this.getOverrideMap();
  }

  /**
   * Adds a scope override.
   * @param scope - The scope in which the override applies.
   * @param moduleName - The module name.
   * @param url - The override URL.
   * @returns The updated override map.
   */
  public addScopeOverride(scope: string, moduleName: string, url: string): ImportMap {
    const key = `${localStorageScopePrefix}${scope}|${moduleName}`;
    StorageManager.setItem(key, url);
    EventManager.fireEvent('change');
    return this.getOverrideMap();
  }

  /**
   * Removes an import override.
   * @param moduleName - The module name.
   * @returns True if an override existed and was removed.
   */
  public removeOverride(moduleName: string): boolean {
    const key = localStoragePrefix + moduleName;
    const hasItem = StorageManager.getItem(key) !== null;
    StorageManager.removeItem(key);
    if (this.serverOverrides) {
      document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
    }
    this.enableOverride(moduleName);
    EventManager.fireEvent('change');
    return hasItem;
  }

  /**
   * Removes a scope override.
   * @param scope - The scope.
   * @param moduleName - The module name.
   * @returns True if an override existed and was removed.
   */
  public removeScopeOverride(scope: string, moduleName: string): boolean {
    const key = `${localStorageScopePrefix}${scope}|${moduleName}`;
    const exists = StorageManager.getItem(key) !== null;
    StorageManager.removeItem(key);
    EventManager.fireEvent('change');
    return exists;
  }

  /**
   * Resets all overrides (both import and scope) as well as external override maps.
   * @returns The cleared override map.
   */
  public resetOverrides(): ImportMap {
    const currentOverrides = this.getOverrideMap(true);
    Object.keys(currentOverrides.imports).forEach((moduleName) => {
      this.removeOverride(moduleName);
    });
    Object.keys(currentOverrides.scopes).forEach((scope) => {
      Object.keys(currentOverrides.scopes[scope]).forEach((moduleName) => {
        this.removeScopeOverride(scope, moduleName);
      });
    });
    StorageManager.removeItem(disabledOverridesLocalStorageKey);
    StorageManager.removeItem(externalOverridesLocalStorageKey);
    EventManager.fireEvent('change');
    return this.getOverrideMap();
  }

  /**
   * Checks if any overrides are set.
   * @returns True if at least one override exists.
   */
  public hasOverrides(): boolean {
    const map = this.getOverrideMap();
    return Object.keys(map.imports).length > 0 || Object.keys(map.scopes).length > 0;
  }

  /**
   * Constructs a URL from a given port number for a module.
   * @param moduleName - The module name.
   * @param port - The port number (as a string).
   * @returns A localhost URL using the specified port.
   */
  public getUrlFromPort(moduleName: string, port: string): string {
    const fileName = moduleName.replace(/@/g, '').replace(/\//g, '-');
    return `//localhost:${port}/${fileName}.js`;
  }

  /**
   * Enables the UI component for managing import map overrides.
   * It creates a custom element if not already present.
   */
  public enableUI(): void {
    const customElementName = 'import-map-overrides-full';
    const showWhenLocalStorage = 'show-when-local-storage';
    let customElement = document.querySelector(customElementName) as HTMLElement | null;

    if (!customElement) {
      customElement = document.createElement(customElementName);
      customElement.setAttribute(showWhenLocalStorage, 'true');
      document.body.appendChild(customElement);
    }

    const localStorageKey = customElement.getAttribute(showWhenLocalStorage);
    if (localStorageKey) {
      StorageManager.setItem(localStorageKey, 'true');
      // If the custom element provides a render method (e.g. using Preact), call it.
      if (typeof (customElement as any).renderWithPreact === 'function') {
        (customElement as any).renderWithPreact();
      }
    }
  }

  /**
   * Merges two import maps.
   * @param originalMap - The original map.
   * @param newMap - The new map to merge.
   * @returns The merged ImportMap.
   */
  public mergeImportMap(originalMap: ImportMap, newMap: ImportMap): ImportMap {
    return mergeImportMaps(originalMap, newMap);
  }

  /**
   * Retrieves the default import map by merging all script tags of the proper types.
   * @returns A Promise that resolves to the default ImportMap.
   */
  public getDefaultMap(): Promise<ImportMap> {
    if (!this.defaultMapPromise) {
      const scriptNodes = document.querySelectorAll(
        `script[type="${importMapType}"], script[type="overridable-importmap"]`
      );
      this.defaultMapPromise = Array.from(scriptNodes).reduce((promise, scriptEl) => {
        if (scriptEl.hasAttribute(overrideAttribute)) {
          return promise;
        } else {
          let nextPromise: Promise<ImportMap>;
          const scriptElement = scriptEl as HTMLScriptElement;
          if (scriptElement.src) {
            nextPromise = fetchExternalMap(scriptElement.src);
          } else {
            try {
              nextPromise = Promise.resolve(JSON.parse(scriptElement.textContent || '{}'));
            } catch (err) {
              nextPromise = Promise.resolve(createEmptyImportMap());
            }
          }
          return Promise.all([promise, nextPromise]).then(([originalMap, newMap]) =>
            this.mergeImportMap(originalMap, newMap)
          );
        }
      }, Promise.resolve(createEmptyImportMap()));
    }
    return this.defaultMapPromise;
  }

  /**
   * Retrieves the current page's import map by merging default, external, and initial overrides.
   * @returns A Promise resolving to the current page ImportMap.
   */
  public async getCurrentPageMap(): Promise<ImportMap> {
    const [defaultMap, externalOverridesMap] = await Promise.all([
      this.getDefaultMap(),
      this.getExternalOverrideMap(this.getCurrentPageExternalOverrides())
    ]);
    return this.mergeImportMap(
      this.mergeImportMap(defaultMap, externalOverridesMap),
      this.initialOverrideMap
    );
  }

  /**
   * Retrieves external override URLs present in the current page.
   * @returns An array of external override URL strings.
   */
  public getCurrentPageExternalOverrides(): string[] {
    const currentPageExternalOverrides: string[] = [];
    document
      .querySelectorAll(`[${overrideAttribute}]:not([id="import-map-overrides"])`)
      .forEach((externalOverrideEl) => {
        const scriptEl = externalOverrideEl as HTMLScriptElement;
        if (scriptEl.src) {
          currentPageExternalOverrides.push(scriptEl.src);
        }
      });
    return currentPageExternalOverrides;
  }

  /**
   * Retrieves the next page's import map by merging default, external, and local overrides.
   * @returns A Promise resolving to the next page ImportMap.
   */
  public async getNextPageMap(): Promise<ImportMap> {
    const [defaultMap, externalOverridesMap] = await Promise.all([
      this.getDefaultMap(),
      this.getExternalOverrideMap()
    ]);
    return this.mergeImportMap(
      this.mergeImportMap(defaultMap, externalOverridesMap),
      this.getOverrideMap()
    );
  }

  /**
   * Disables an override for a given module.
   * @param moduleName - The module name.
   * @returns True if the module override was successfully disabled.
   */
  public disableOverride(moduleName: string): boolean {
    const disabledOverrides = this.getDisabledOverrides();
    if (!includes(disabledOverrides, moduleName)) {
      StorageManager.setItem(
        disabledOverridesLocalStorageKey,
        JSON.stringify(disabledOverrides.concat(moduleName))
      );
      EventManager.fireEvent('change');
      return true;
    } else {
      return false;
    }
  }

  /**
   * Enables an override for a given module.
   * @param moduleName - The module name.
   * @returns True if the module override was successfully enabled.
   */
  public enableOverride(moduleName: string): boolean {
    const disabledOverrides = this.getDisabledOverrides();
    const index = disabledOverrides.indexOf(moduleName);
    if (index >= 0) {
      disabledOverrides.splice(index, 1);
      StorageManager.setItem(disabledOverridesLocalStorageKey, JSON.stringify(disabledOverrides));
      EventManager.fireEvent('change');
      return true;
    } else {
      return false;
    }
  }

  /**
   * Retrieves the list of modules whose overrides are disabled.
   * @returns An array of module names.
   */
  public getDisabledOverrides(): string[] {
    const disabled = StorageManager.getItem(disabledOverridesLocalStorageKey);
    return disabled ? JSON.parse(disabled) : [];
  }

  /**
   * Checks whether a module's override is disabled.
   * @param moduleName - The module name.
   * @returns True if disabled, false otherwise.
   */
  public isDisabled(moduleName: string): boolean {
    return includes(this.getDisabledOverrides(), moduleName);
  }

  /**
   * Retrieves the list of external override URLs from localStorage.
   * @returns An array of URL strings.
   */
  public getExternalOverrides(): string[] {
    const localStorageValue = StorageManager.getItem(externalOverridesLocalStorageKey);
    return localStorageValue ? JSON.parse(localStorageValue).sort() : [];
  }

  /**
   * Adds an external override URL.
   * @param url - The external URL.
   * @returns True if the URL was added, false if it already existed.
   */
  public addExternalOverride(url: string): boolean {
    // Normalize the URL.
    url = new URL(url, document.baseURI).href;
    const overrides = this.getExternalOverrides();
    if (includes(overrides, url)) {
      return false;
    } else {
      StorageManager.setItem(externalOverridesLocalStorageKey, JSON.stringify(overrides.concat(url)));
      EventManager.fireEvent('change');
      return true;
    }
  }

  /**
   * Removes an external override URL.
   * @param url - The external URL.
   * @returns True if the URL was removed, false otherwise.
   */
  public removeExternalOverride(url: string): boolean {
    const overrides = this.getExternalOverrides();
    if (includes(overrides, url)) {
      StorageManager.setItem(
        externalOverridesLocalStorageKey,
        JSON.stringify(overrides.filter((override) => override !== url))
      );
      EventManager.fireEvent('change');
      return true;
    } else {
      return false;
    }
  }

  /**
   * Retrieves a merged external override map.
   * @param externalOverrides - Optional array of external override URLs; if omitted, uses stored external overrides.
   * @returns A Promise that resolves to a merged ImportMap.
   */
  public getExternalOverrideMap(externalOverrides: string[] = this.getExternalOverrides()): Promise<ImportMap> {
    return externalOverrides.reduce((resultPromise, externalOverride) => {
      const fetchPromise =
        externalOverrideMapPromises[externalOverride] ||
        (externalOverrideMapPromises[externalOverride] = fetchExternalMap(externalOverride));
      return Promise.all([resultPromise, fetchPromise]).then(([firstMap, secondMap]) =>
        this.mergeImportMap(firstMap, secondMap)
      );
    }, Promise.resolve(createEmptyImportMap()));
  }

  /**
   * Checks whether an external map is valid.
   * @param importMapUrl - The URL of the external import map.
   * @returns A Promise that resolves to true if valid.
   */
  public isExternalMapValid(importMapUrl: string): Promise<boolean> {
    const promise =
      externalOverrideMapPromises[importMapUrl] ||
      (externalOverrideMapPromises[importMapUrl] = fetchExternalMap(importMapUrl));
    return promise.then(() => !includes(ImportMapOverrides.invalidExternalMaps, importMapUrl));
  }
}

// Export a singleton instance of ImportMapOverrides for global use.
const importMapOverridesInstance = new ImportMapOverrides();
export default importMapOverridesInstance;


// Help DOC


