import type { ImportMap } from "@/lib/utils.ts";

export function useOverridesUtils() {
  let defaultMapPromise: any;

  /**
   * Inserts an override map (as a script element) into the document.
   * @param map - The import map (or a URL string) to insert.
   * @param isExternal
   * @returns The inserted script element.
   */
  function insertOverrideMap(map: ImportMap | string, isExternal = false) {
    const id = isExternal
      ? "import-map-manager-external"
      : "import-map-manager";
    document.getElementById(id)?.remove();
    if (
      (typeof map === "string" && !map) ||
      (typeof map === "object" &&
        !Object.keys((map as ImportMap)?.imports || {}).length)
    ) {
      return;
    }
    const overrideMapElement = document.createElement("script");
    overrideMapElement.type = "systemjs-importmap";
    overrideMapElement.id = id;
    if (typeof map === "string") {
      overrideMapElement.src = map;
    } else {
      overrideMapElement.textContent = JSON.stringify(map, null, 2);
    }
    const importMapManagerElement =
      document.getElementById("import-map-manager");
    if (isExternal && importMapManagerElement) {
      importMapManagerElement.insertAdjacentElement(
        "beforebegin",
        overrideMapElement
      );
    } else {
      document.head.appendChild(overrideMapElement);
    }
  }

  function getDefaultMap(): Promise<ImportMap> {
    if (!defaultMapPromise) {
      const scriptNodes = document.querySelectorAll(
        'script[type="systemjs-importmap"]'
      );
      defaultMapPromise = Array.from(scriptNodes).reduce(
        (promise, scriptEl) => {
          let nextPromise: Promise<ImportMap>;
          const scriptElement = scriptEl as HTMLScriptElement;
          if (scriptElement.src) {
            nextPromise = fetchExternalMap(scriptElement.src);
          } else {
            try {
              nextPromise = Promise.resolve(
                JSON.parse(scriptElement.textContent || "{}")
              );
            } catch (_) {
              nextPromise = Promise.resolve(createEmptyImportMap());
            }
          }
          return Promise.all([promise, nextPromise]).then(
            ([originalMap, newMap]) => mergeImportMaps(originalMap, newMap)
          );
        },
        Promise.resolve(createEmptyImportMap())
      );
    }
    return defaultMapPromise;
  }

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
        console.warn(
          new Error(
            `Unable to download external override import map from ${response.url}. Status: ${response.status}`
          )
        );
        return createEmptyImportMap();
      }
      let json: any;
      try {
        json = await response.json();
      } catch (err) {
        console.warn(
          new Error(
            `Invalid JSON in external override import map from ${response.url}. ${err}`
          )
        );
        return createEmptyImportMap();
      }
      return expandRelativeUrlsInImportMap(json as ImportMap, url);
    } catch (err) {
      console.warn(
        new Error(`Unable to download external import map at '${url}'. ${err}`)
      );
      return createEmptyImportMap();
    }
  }

  /**
   * Expands relative URLs in an entire import map.
   * @param importMap - The original import map.
   * @param baseUrl - The base URL.
   * @returns A new ImportMap with all URLs expanded.
   */
  function expandRelativeUrlsInImportMap(
    importMap: ImportMap,
    baseUrl: string
  ): ImportMap {
    const expandedImports = expandRelativeUrlImports(
      importMap.imports || {},
      baseUrl
    );
    const expandedScopes = Object.keys(importMap.scopes || {}).reduce(
      (result, scopeKey) => {
        result[scopeKey] = expandRelativeUrlImports(
          importMap.scopes[scopeKey],
          baseUrl
        );
        return result;
      },
      {} as Record<string, Record<string, string>>
    );
    return { imports: expandedImports, scopes: expandedScopes };
  }

  /**
   * Creates an empty ImportMap.
   * @returns An ImportMap with empty imports and scopes.
   */
  function createEmptyImportMap(): ImportMap {
    return { imports: {}, scopes: {} };
  }

  /**
   * Expands relative URLs in an imports object.
   * @param imports - An object mapping module names to URLs.
   * @param baseUrl - The base URL.
   * @returns A new object with expanded URLs.
   */
  function expandRelativeUrlImports(
    imports: Record<string, string>,
    baseUrl: string
  ): Record<string, string> {
    return Object.entries(imports).reduce(
      (result, [key, value]) => {
        result[key] = expandRelativeUrl(value, baseUrl);
        return result;
      },
      {} as Record<string, string>
    );
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
    } catch (_) {
      return url;
    }
  }

  /**
   * Merges two import maps together.
   * Later maps take precedence over earlier maps.
   * @param originalMap - The original import map.
   * @param newMap - The new import map to merge.
   * @returns The merged ImportMap.
   */
  function mergeImportMaps(
    originalMap: ImportMap,
    newMap: ImportMap
  ): ImportMap {
    return {
      imports: { ...originalMap.imports, ...newMap.imports },
      scopes: { ...originalMap.scopes, ...newMap.scopes },
    };
  }

  return { insertOverrideMap, getDefaultMap, fetchExternalMap };
}
