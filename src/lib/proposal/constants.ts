/**
 * Constants used throughout the import-map-overrides library
 */

/** Prefix for all localStorage keys */
export const LOCAL_STORAGE_PREFIX = 'import-map-override:';

/** Separate prefix for scope overrides in localStorage */
export const LOCAL_STORAGE_SCOPE_PREFIX = 'import-map-override-scope:';

/** Key for storing disabled overrides in localStorage */
export const DISABLED_OVERRIDES_KEY = 'import-map-overrides-disabled';

/** Key for storing external maps in localStorage */
export const EXTERNAL_MAPS_KEY = 'import-map-overrides-external-maps';

/** Attribute added to generated script tags */
export const OVERRIDE_ATTRIBUTE = 'data-is-importmap-override';

/** Meta tag name for domain restrictions */
export const DOMAINS_META = 'import-map-overrides-domains';

/** Prefix for allowlist domain configurations */
export const ALLOWLIST_PREFIX = 'allowlist:';

/** Prefix for denylist domain configurations */
export const DENYLIST_PREFIX = 'denylist:';

/** Query parameter name for URL-based overrides */
export const QUERY_PARAM_NAME = 'imo';

/** Default port that will be used if only a module name is provided */
export const DEFAULT_PORT = '8080';

/** Protocol to use when creating URLs from port numbers */
export const PORT_PROTOCOL = 'http';

/** Default path to use when creating URLs from port numbers */
export const DEFAULT_PORT_PATH = '//localhost:PORT/MODULENAME';

/** Event name dispatched when overrides change */
export const CHANGE_EVENT_NAME = 'import-map-overrides:change';

/** Meta element that specifies import map type */
export const importMapMetaElement = document.querySelector('meta[name="importmap-type"]');

/** Current import map type (importmap or systemjs-importmap) */
export const importMapType = importMapMetaElement
  ? importMapMetaElement.getAttribute('content')
  : 'importmap';