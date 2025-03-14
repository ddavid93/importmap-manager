/**
 * Basic structure of an import map according to the spec
 * @see https://html.spec.whatwg.org/multipage/webappapis.html#import-maps
 */
export interface ImportMap {
  imports: Record<string, string>;
  scopes?: Record<string, Record<string, string>>;
}

/**
 * Configuration for an external import map
 */
export interface ExternalOverrideMap {
  url: string;
  overrideEnabled: boolean;
}

/**
 * Response from a remote import map fetch operation
 */
export interface ExternalMapResponse {
  success: boolean;
  importMap?: ImportMap;
  error?: Error;
  url: string;
}

/**
 * Public API for import-map-overrides
 */
export interface ImportMapOverridesApi {
  /**
   * Add a module override
   * @param moduleName - The import specifier to override
   * @param url - URL or port number for the override
   * @returns Current override map
   */
  addOverride(moduleName: string, url: string): ImportMap;

  /**
   * Add a scope override
   * @param scopeName - The scope URL prefix
   * @param moduleName - The import specifier within this scope
   * @param url - URL or port number for the override
   * @returns Current override map
   */
  addScopeOverride(scopeName: string, moduleName: string, url: string): ImportMap;

  /**
   * Get the current override map
   * @param includeDisabled - Whether to include disabled overrides
   * @returns Import map with all active overrides
   */
  getOverrideMap(includeDisabled?: boolean): ImportMap;

  /**
   * Remove a module override
   * @param moduleName - The import specifier to remove
   * @returns Current override map
   */
  removeOverride(moduleName: string): ImportMap;

  /**
   * Remove a scope override
   * @param scopeName - The scope URL prefix
   * @param moduleName - The import specifier within this scope to remove
   * @returns Current override map
   */
  removeScopeOverride(scopeName: string, moduleName: string): ImportMap;

  /**
   * Reset all overrides by deleting them
   */
  resetOverrides(): void;

  /**
   * Get a list of all overridden modules
   * @returns Array of module names
   */
  getOverriddenModules(): string[];

  /**
   * Get a list of all scope overrides
   * @returns Map of scopes and their overridden modules
   */
  getOverriddenScopes(): Record<string, string[]>;

  /**
   * Enable or disable a specific override
   * @param moduleName - The import specifier to enable/disable
   * @param enabled - Whether the override should be enabled
   * @returns List of disabled overrides
   */
  enableOverride(moduleName: string, enabled: boolean): string[];

  /**
   * Enable or disable a scope override
   * @param scopeName - The scope URL prefix
   * @param moduleName - The import specifier within this scope
   * @param enabled - Whether the override should be enabled
   * @returns List of disabled overrides
   */
  enableScopeOverride(scopeName: string, moduleName: string, enabled: boolean): string[];

  /**
   * Get list of disabled overrides
   * @returns Array of disabled module names
   */
  getDisabledOverrides(): string[];

  /**
   * Check if a specific module is overridden
   * @param moduleName - Module to check
   * @returns True if the module is overridden
   */
  hasOverride(moduleName: string): boolean;

  /**
   * Check if a specific scope override exists
   * @param scopeName - The scope URL prefix
   * @param moduleName - The import specifier within this scope
   * @returns True if the scope override exists
   */
  hasScopeOverride(scopeName: string, moduleName: string): boolean;

  /**
   * Get the override URL for a specific module
   * @param moduleName - The import specifier to get the URL for
   * @returns Override URL or null if no override exists
   */
  getUrlFromPort(moduleName: string, port: string | number): string;

  /**
   * Mount the import map into the DOM
   */
  mount(): void;

  /**
   * Add an external import map
   * @param url - URL to the external import map
   * @param enable - Whether to enable the external map immediately
   * @returns Promise that resolves when the map is added
   */
  addExternalOverride(url: string, enable?: boolean): Promise<void>;

  /**
   * Remove an external import map
   * @param url - URL of the external import map to remove
   */
  removeExternalOverride(url: string): void;

  /**
   * Get all external import maps
   * @returns Record of external override maps by URL
   */
  getExternalOverrides(): Record<string, ExternalOverrideMap>;

  /**
   * Enable or disable an external import map
   * @param url - URL of the external import map
   * @param enable - Whether to enable the map
   */
  enableExternalOverride(url: string, enable: boolean): void;

  /**
   * Load an external import map
   * @param url - URL of the external import map to load
   * @returns Promise resolving to the import map response
   */
  loadExternalOverride(url: string): Promise<ExternalMapResponse>;

  /**
   * Current import map type (importmap or systemjs-importmap)
   */
  importMapType: string;
}

// Extend Window interface to include importMapOverrides
declare global {
  interface Window {
    importMapOverrides: ImportMapOverridesApi;
    importMapOverridesDisabled?: boolean;
  }
}