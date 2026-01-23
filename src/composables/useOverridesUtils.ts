import type { IImportMap } from "@/types/importMap.ts";

export function useOverridesUtils() {
  let defaultMapPromise: Promise<IImportMap> | null = null;

  /**
   * Inserts an override map (as a script element) into the document.
   * @param map - The import map (or a URL string) to insert.
   * @param isExternal
   * @returns The inserted script element.
   */
  function insertOverrideMap(map: IImportMap | string, isExternal = false) {
    const id = isExternal ? "importmap-manager-external" : "importmap-manager";
    document.getElementById(id)?.remove();
    if (
      (typeof map === "string" && !map) ||
      (typeof map === "object" &&
        !Object.keys((map as IImportMap)?.imports || {}).length)
    ) {
      return;
    }
    const overrideMapElement = document.createElement("script");
    overrideMapElement.type = "injector-importmap";
    overrideMapElement.id = id;
    if (typeof map === "string") {
      overrideMapElement.src = map;
    } else {
      overrideMapElement.textContent = JSON.stringify(map, null, 2);
    }
    const importMapManagerElement =
      document.getElementById("importmap-manager");
    if (isExternal && importMapManagerElement) {
      importMapManagerElement.insertAdjacentElement(
        "beforebegin",
        overrideMapElement
      );
    } else {
      const externalImportMapElement = document.getElementById(
        "importmap-manager-external"
      );
      if (externalImportMapElement) {
        externalImportMapElement.insertAdjacentElement(
          "beforebegin",
          overrideMapElement
        );
      } else {
        document.head.appendChild(overrideMapElement);
      }
    }
  }

  function getDefaultMap(): Promise<IImportMap> {
    if (!defaultMapPromise) {
      const scriptNodes = document.querySelectorAll(
        'script[type="injector-importmap"]'
      );
      defaultMapPromise = Array.from(scriptNodes).reduce(
        (promise, scriptEl) => {
          let nextPromise: Promise<IImportMap>;
          const scriptElement = scriptEl as HTMLScriptElement;
          if (scriptElement.src) {
            nextPromise = fetchExternalMap(scriptElement.src);
          } else {
            try {
              nextPromise = Promise.resolve(
                JSON.parse(scriptElement.textContent || "{}")
              );
            } catch {
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
    return defaultMapPromise ?? Promise.resolve(createEmptyImportMap());
  }

  /**
   * Fetches an external import map from the given URL.
   * If the fetch fails or the JSON is invalid, an empty map is returned.
   * @param url - The URL to fetch.
   * @returns A Promise resolving to an ImportMap.
   */
  async function fetchExternalMap(url: string): Promise<IImportMap> {
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
      let json: unknown;
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
      return expandRelativeUrlsInImportMap(json as IImportMap, url);
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
    importMap: IImportMap,
    baseUrl: string
  ): IImportMap {
    const expandedImports = expandRelativeUrlImports(
      importMap.imports || {},
      baseUrl
    );
    const expandedScopes = Object.keys(importMap.scopes || {}).reduce(
      (result, scopeKey) => {
        result[scopeKey] = expandRelativeUrlImports(
          importMap.scopes[scopeKey] ?? {},
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
  function createEmptyImportMap(): IImportMap {
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
    } catch {
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
    originalMap: IImportMap,
    newMap: IImportMap
  ): IImportMap {
    return {
      imports: { ...originalMap.imports, ...newMap.imports },
      scopes: { ...originalMap.scopes, ...newMap.scopes },
    };
  }

  return { insertOverrideMap, getDefaultMap, fetchExternalMap };
}
