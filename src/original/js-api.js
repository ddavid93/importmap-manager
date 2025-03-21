import { escapeStringRegexp } from './string-regex'
import { includes } from './includes.js'
import { getParameterByName } from './url-parameter'

const localStoragePrefix = 'import-map-override:'
const disabledOverridesLocalStorageKey = 'import-map-overrides-disabled'
const externalOverridesLocalStorageKey = 'import-map-overrides-external-maps'
const overrideAttribute = 'data-is-importmap-override'
const domainsMeta = 'import-map-overrides-domains'
const allowListPrefix = 'allowlist:'
const denyListPrefix = 'denylist:'
export const queryParamOverridesName = 'imo'

const importMapMetaElement = document.querySelector('meta[name="importmap-type"]')

const domainsElement = document.querySelector(`meta[name="${domainsMeta}"]`)

const externalOverrideMapPromises = {}

export const importMapType = importMapMetaElement
  ? importMapMetaElement.getAttribute('content')
  : 'importmap'

export let isDisabled

if (domainsElement) {
  const content = domainsElement.getAttribute('content')
  if (!content) {
    console.warn(`Invalid ${domainsMeta} meta element - content required.`)
  }

  const matchHostname = (domain) =>
    new RegExp(escapeStringRegexp(domain).replace('\\*', '.+')).test(window.location.hostname)

  if (content.indexOf(allowListPrefix) === 0) {
    const allowedDomains = content.slice(allowListPrefix.length).split(',')
    isDisabled = !allowedDomains.some(matchHostname)
  } else if (content.indexOf(denyListPrefix) === 0) {
    const deniedDomains = content.slice(denyListPrefix.length).split(',')
    isDisabled = deniedDomains.some(matchHostname)
  } else {
    // eslint-disable-next-line no-console
    console.log(
      `Invalid ${domainsMeta} meta content attribute - must start with ${allowListPrefix} or ${denyListPrefix}`
    )
  }
} else {
  isDisabled = false
}

if (!canAccessLocalStorage()) {
  console.warn('Disabling import-map-overrides, since local storage is not readable')
  isDisabled = true
}

if (!isDisabled) {
  /**
   * Temporal saving localStorage just to see if it works
   * TODO: remove this
   */
  ;[
    {
      key: 'import-map-override:single-spa',
      value: 'https://localhost:8080/single-spa.dev.js'
    },
    {
      key: 'import-map-override:vue',
      value: 'https://unpkg.com/vue@3.2.37/dist/vue.esm-browser.js'
    },
    {
      key: 'import-map-override:react',
      value: 'https://unpkg.com/react@18.2.0/umd/react.production.min.js'
    },
    {
      key: 'import-map-override:angular',
      value: 'https://unpkg.com/@angular/core@15.2.0/bundles/core.umd.js'
    },
    {
      key: 'import-map-override:rxjs',
      value: 'https://unpkg.com/rxjs@7.8.1/dist/bundles/rxjs.umd.js'
    },
    {
      key: 'import-map-override:lodash',
      value: 'https://unpkg.com/lodash@4.17.21/lodash.js'
    },
    {
      key: 'import-map-override:moment',
      value: 'https://unpkg.com/moment@2.29.4/min/moment.min.js'
    },
    {
      key: 'import-map-override:test-angular',
      value: 'https://unpkg.com/test-angular@1.0.0/core.umd.js'
    },
    {
      key: 'import-map-override:moment',
      value: 'https://unpkg.com/moment@2.29.4/min/moment.min.js'
    },
    {
      key: 'import-map-override:test-angular',
      value: 'https://unpkg.com/test-angular@1.0.0/core.umd.js'
    },
    {
      key: 'import-map-override:typescript',
      value: 'https://unpkg.com/typescript@5.0.0/lib/typescript.js'
    },
    {
      key: 'import-map-override:vue-router',
      value: 'https://unpkg.com/vue-router@4.1.0/dist/vue-router.esm-browser.js'
    },
    {
      key: 'import-map-override:axios',
      value: 'https://unpkg.com/axios@1.4.0/dist/axios.min.js'
    },
    {
      key: 'import-map-override:three',
      value: 'https://unpkg.com/three@0.155.0/build/three.module.js'
    },
    {
      key: 'import-map-override:d3',
      value: 'https://unpkg.com/d3@7.8.2/dist/d3.min.js'
    },
    {
      key: 'import-map-override:dayjs',
      value: 'https://unpkg.com/dayjs@1.11.9/dayjs.min.js'
    },
    {
      key: 'import-map-override:chart.js',
      value: 'https://unpkg.com/chart.js@4.1.2/dist/chart.min.js'
    },
    {
      key: 'import-map-override:lit',
      value: 'https://unpkg.com/lit@2.7.1/index.js'
    },
    {
      key: 'import-map-override:uuid',
      value: 'https://unpkg.com/uuid@9.0.0/dist/umd/uuidv4.js'
    },
    {
      key: 'import-map-override:redux',
      value: 'https://unpkg.com/redux@4.2.1/dist/redux.min.js'
    },
    {
      key: 'import-map-override:rxjs-operators',
      value: 'https://unpkg.com/rxjs@7.8.1/dist/cjs/operators/index.js'
    },
    {
      key: 'import-map-override:p5js',
      value: 'https://unpkg.com/p5@1.6.0/lib/p5.min.js'
    },
    {
      key: 'import-map-override:svelte',
      value: 'https://unpkg.com/svelte@4.2.0/index.mjs'
    },
    {
      key: 'import-map-override:popper',
      value: 'https://unpkg.com/@popperjs/core@2.11.8/dist/umd/popper.min.js'
    },
    {
      key: 'import-map-override:bootstrap',
      value: 'https://unpkg.com/bootstrap@5.3.0/dist/css/bootstrap.min.css'
    },
    {
      key: 'import-map-override:gsap',
      value: 'https://unpkg.com/gsap@3.14.0/dist/gsap.min.js'
    },
    {
      key: 'import-map-override:animejs',
      value: 'https://unpkg.com/animejs@3.3.0/lib/anime.min.js'
    },
    {
      key: 'import-map-override:pixi',
      value: 'https://unpkg.com/pixi.js@7.3.0/dist/browser/pixi.min.js'
    },
    {
      key: 'import-map-override:immer',
      value: 'https://unpkg.com/immer@10.0.0/dist/immer.min.js'
    }
  ].forEach(({ key, value }) => {
    localStorage.setItem(key, value)
  })
  init()
}

function init() {
  const serverOverrides = importMapMetaElement
    ? importMapMetaElement.hasAttribute('server-cookie')
    : false
  const serverOnly = importMapMetaElement ? importMapMetaElement.hasAttribute('server-only') : false

  let defaultMapPromise

  window.importMapOverrides = {
    addOverride(moduleName, url) {
      const portRegex = /^\d+$/g
      if (portRegex.test(url)) {
        url = imo.getUrlFromPort(moduleName, url)
      }
      const key = localStoragePrefix + moduleName
      localStorage.setItem(key, url)
      if (serverOverrides) {
        document.cookie = `${key}=${url}`
      }
      fireChangedEvent()
      return imo.getOverrideMap()
    },
    getOverrideMap(includeDisabled = false) {
      const overrides = createEmptyImportMap()
      const disabledOverrides = imo.getDisabledOverrides()

      const setOverride = (moduleName, path) => {
        if (includeDisabled || !(disabledOverrides.indexOf(moduleName) >= 0)) {
          overrides.imports[moduleName] = path
        }
      }

      // get from localstorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key.indexOf(localStoragePrefix) === 0) {
          setOverride(key.slice(localStoragePrefix.length), localStorage.getItem(key))
        }
      }

      // get from url if query param exist
      const queryParam = getParameterByName(
        queryParamOverridesName,
        window.location !== window.parent.location ? document.referrer : window.location.href
      )

      if (queryParam) {
        let queryParamImportMap
        try {
          queryParamImportMap = JSON.parse(queryParam)
        } catch (e) {
          throw Error(`Invalid importMap query param - text content must be json`)
        }
        Object.keys(queryParamImportMap.imports).forEach((moduleName) => {
          setOverride(moduleName, queryParamImportMap.imports[moduleName])
        })
      }

      return overrides
    },
    removeOverride(moduleName) {
      const key = localStoragePrefix + moduleName
      const hasItem = localStorage.getItem(key) !== null
      localStorage.removeItem(key)
      if (serverOverrides) {
        document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`
      }
      imo.enableOverride(moduleName)
      fireChangedEvent()
      return hasItem
    },
    resetOverrides() {
      Object.keys(imo.getOverrideMap(true).imports).forEach((moduleName) => {
        imo.removeOverride(moduleName)
      })
      localStorage.removeItem(disabledOverridesLocalStorageKey)
      localStorage.removeItem(externalOverridesLocalStorageKey)
      fireChangedEvent()
      return imo.getOverrideMap()
    },
    hasOverrides() {
      return Object.keys(imo.getOverrideMap().imports).length > 0
    },
    getUrlFromPort(moduleName, port) {
      const fileName = moduleName.replace(/@/g, '').replace(/\//g, '-')
      return `//localhost:${port}/${fileName}.js`
    },
    enableUI() {
      const customElementName = 'import-map-overrides-full'
      const showWhenLocalStorage = 'show-when-local-storage'
      let customElement = document.querySelector(customElementName)

      if (!customElement) {
        customElement = document.createElement(customElementName)
        customElement.setAttribute(showWhenLocalStorage, 'true')
        document.body.appendChild(customElement)
      }

      const localStorageKey = customElement.getAttribute(showWhenLocalStorage)
      if (localStorageKey) {
        localStorage.setItem(localStorageKey, true)
        customElement.renderWithPreact()
      }
    },
    mergeImportMap(originalMap, newMap) {
      const outMap = createEmptyImportMap()
      for (let i in originalMap.imports) {
        outMap.imports[i] = originalMap.imports[i]
      }
      for (let i in newMap.imports) {
        outMap.imports[i] = newMap.imports[i]
      }
      for (let i in originalMap.scopes) {
        outMap.scopes[i] = originalMap.scopes[i]
      }
      for (let i in newMap.scopes) {
        outMap.scopes[i] = newMap.scopes[i]
      }
      return outMap
    },
    getDefaultMap() {
      return (
        defaultMapPromise ||
        (defaultMapPromise = Array.prototype.reduce.call(
          document.querySelectorAll(
            `script[type="${importMapType}"], script[type="overridable-importmap"]`
          ),
          (promise, scriptEl) => {
            if (scriptEl.hasAttribute(overrideAttribute)) {
              return promise
            } else {
              let nextPromise
              if (scriptEl.src) {
                nextPromise = fetchExternalMap(scriptEl.src)
              } else {
                nextPromise = Promise.resolve(JSON.parse(scriptEl.textContent))
              }

              return Promise.all([promise, nextPromise]).then(([originalMap, newMap]) =>
                imo.mergeImportMap(originalMap, newMap)
              )
            }
          },
          Promise.resolve(createEmptyImportMap())
        ))
      )
    },
    getCurrentPageMap() {
      return Promise.all([
        imo.getDefaultMap(),
        imo.getExternalOverrideMap(imo.getCurrentPageExternalOverrides())
      ]).then(([defaultMap, externalOverridesMap]) => {
        return imo.mergeImportMap(
          imo.mergeImportMap(defaultMap, externalOverridesMap),
          initialOverrideMap
        )
      })
    },
    getCurrentPageExternalOverrides() {
      const currentPageExternalOverrides = []
      document
        .querySelectorAll(`[${overrideAttribute}]:not([id="import-map-overrides"])`)
        .forEach((externalOverrideEl) => {
          currentPageExternalOverrides.push(externalOverrideEl.src)
        })
      return currentPageExternalOverrides
    },
    getNextPageMap() {
      return Promise.all([imo.getDefaultMap(), imo.getExternalOverrideMap()]).then(
        ([defaultMap, externalOverridesMap]) => {
          return imo.mergeImportMap(
            imo.mergeImportMap(defaultMap, externalOverridesMap),
            imo.getOverrideMap()
          )
        }
      )
    },
    disableOverride(moduleName) {
      const disabledOverrides = imo.getDisabledOverrides()
      if (!includes(disabledOverrides, moduleName)) {
        localStorage.setItem(
          disabledOverridesLocalStorageKey,
          JSON.stringify(disabledOverrides.concat(moduleName))
        )
        fireChangedEvent()
        return true
      } else {
        return false
      }
    },
    enableOverride(moduleName) {
      const disabledOverrides = imo.getDisabledOverrides()
      const index = disabledOverrides.indexOf(moduleName)
      if (index >= 0) {
        disabledOverrides.splice(index, 1)
        localStorage.setItem(disabledOverridesLocalStorageKey, JSON.stringify(disabledOverrides))
        fireChangedEvent()
        return true
      } else {
        return false
      }
    },
    getDisabledOverrides() {
      const disabledOverrides = localStorage.getItem(disabledOverridesLocalStorageKey)
      return disabledOverrides ? JSON.parse(disabledOverrides) : []
    },
    isDisabled(moduleName) {
      return includes(imo.getDisabledOverrides(), moduleName)
    },
    getExternalOverrides() {
      let localStorageValue = localStorage.getItem(externalOverridesLocalStorageKey)
      return localStorageValue ? JSON.parse(localStorageValue).sort() : []
    },
    addExternalOverride(url) {
      url = new URL(url, document.baseURI).href
      const overrides = imo.getExternalOverrides()
      if (includes(overrides, url)) {
        return false
      } else {
        localStorage.setItem(
          externalOverridesLocalStorageKey,
          JSON.stringify(overrides.concat(url))
        )
        fireChangedEvent()
        return true
      }
    },
    removeExternalOverride(url) {
      const overrides = imo.getExternalOverrides()
      if (includes(overrides, url)) {
        localStorage.setItem(
          externalOverridesLocalStorageKey,
          JSON.stringify(overrides.filter((override) => override !== url))
        )
        fireChangedEvent()
        return true
      } else {
        return false
      }
    },
    getExternalOverrideMap(externalOverrides = imo.getExternalOverrides()) {
      return externalOverrides.reduce((result, externalOverride) => {
        const fetchPromise =
          externalOverrideMapPromises[externalOverride] ||
          (externalOverrideMapPromises[externalOverride] = fetchExternalMap(externalOverride))
        return Promise.all([result, fetchPromise]).then(([firstMap, secondMap]) => {
          return imo.mergeImportMap(firstMap, secondMap)
        })
      }, Promise.resolve(createEmptyImportMap()))
    },
    isExternalMapValid(importMapUrl) {
      const promise =
        externalOverrideMapPromises[importMapUrl] ||
        (externalOverrideMapPromises[importMapUrl] = fetchExternalMap(importMapUrl))
      return promise.then(() => !includes(imo.invalidExternalMaps, importMapUrl))
    },
    invalidExternalMaps: []
  }

  const imo = window.importMapOverrides

  let canFireCustomEvents = true
  try {
    if (CustomEvent) {
      new CustomEvent('a')
    } else {
      canFireCustomEvents = false
    }
  } catch (err) {
    canFireCustomEvents = false
  }

  function fireChangedEvent() {
    fireEvent('change')
  }

  function fireEvent(type) {
    // Set timeout so that event fires after the change has totally finished
    setTimeout(() => {
      const eventType = `import-map-overrides:${type}`
      const event = canFireCustomEvents
        ? new CustomEvent(eventType)
        : document.createEvent('CustomEvent')
      if (!canFireCustomEvents) {
        event.initCustomEvent(eventType, true, true, null)
      }
      window.dispatchEvent(event)
    })
  }

  const initialOverrideMap = imo.getOverrideMap()
  const initialExternalOverrideMaps = imo.getExternalOverrides()

  let referenceNode

  if (!serverOnly) {
    const overridableImportMap = document.querySelector('script[type="overridable-importmap"]')

    referenceNode = overridableImportMap

    if (!referenceNode) {
      const importMaps = document.querySelectorAll(`script[type="${importMapType}"]`)
      referenceNode = importMaps ? importMaps[importMaps.length - 1] : null
    }

    if (overridableImportMap) {
      if (overridableImportMap.src) {
        throw Error(
          `import-map-overrides: external import maps with type="overridable-importmap" are not supported`
        )
      }
      let originalMap
      try {
        originalMap = JSON.parse(overridableImportMap.textContent)
      } catch (e) {
        throw Error(`Invalid <script type="overridable-importmap"> - text content must be json`)
      }

      referenceNode = insertOverrideMap(
        imo.mergeImportMap(originalMap, initialOverrideMap),
        `import-map-overrides`,
        referenceNode
      )
      insertAllExternalOverrideMaps()
    } else {
      insertAllExternalOverrideMaps()
      if (Object.keys(initialOverrideMap.imports).length > 0) {
        referenceNode = insertOverrideMap(initialOverrideMap, `import-map-overrides`, referenceNode)
      }
    }
  }

  fireEvent('init')

  function insertOverrideMap(map, id, referenceNode) {
    const overrideMapElement = document.createElement('script')
    overrideMapElement.type = importMapType
    overrideMapElement.id = id // for debugging and for UI to identify this import map as special
    overrideMapElement.setAttribute(overrideAttribute, '')
    if (typeof map === 'string') {
      overrideMapElement.src = map
    } else {
      overrideMapElement.textContent = JSON.stringify(map, null, 2)
    }

    if (referenceNode) {
      referenceNode.insertAdjacentElement('afterend', overrideMapElement)
    } else {
      document.head.appendChild(overrideMapElement)
    }

    return overrideMapElement
  }

  function fetchExternalMap(url) {
    return fetch(url)
      .then(
        (r) => {
          if (r.ok) {
            return r.json().catch((err) => {
              console.warn(
                Error(
                  `External override import map contained invalid json, at url ${r.url}. ${err}`
                )
              )
              imo.invalidExternalMaps.push(r.url)
              return createEmptyImportMap()
            })
          } else {
            console.warn(
              Error(
                `Unable to download external override import map from url ${r.url}. Server responded with status ${r.status}`
              )
            )
            imo.invalidExternalMaps.push(r.url)
            return createEmptyImportMap()
          }
        },
        () => {
          console.warn(Error(`Unable to download external import map at url '${url}'`))
          imo.invalidExternalMaps.push(new URL(url, document.baseURI).href)
          return createEmptyImportMap()
        }
      )
      .then((importMap) => expandRelativeUrlsInImportMap(importMap, url))
  }

  function createEmptyImportMap() {
    return { imports: {}, scopes: {} }
  }

  function insertAllExternalOverrideMaps() {
    if (initialExternalOverrideMaps.length > 0) {
      initialExternalOverrideMaps.forEach((mapUrl, index) => {
        referenceNode = insertOverrideMap(mapUrl, `import-map-overrides-external-${index}`)
      })
    }
  }
}

function expandRelativeUrl(url, baseUrl) {
  try {
    const outUrl = new URL(url, baseUrl)
    return outUrl.href
  } catch (err) {
    return url
  }
}

function expandRelativeUrlImports(imports, baseUrl) {
  return Object.entries(imports).reduce((result, [key, value]) => {
    result[key] = expandRelativeUrl(value, baseUrl)
    return result
  }, {})
}

function expandRelativeUrlsInImportMap(importMap, baseUrl) {
  return {
    imports: expandRelativeUrlImports(importMap.imports || {}, baseUrl),
    scopes: Object.keys(importMap.scopes || {}).reduce((result, scopeKey) => {
      result[scopeKey] = expandRelativeUrlImports(importMap.scopes[scopeKey], baseUrl)
      return result
    }, {})
  }
}

function canAccessLocalStorage() {
  try {
    localStorage.getItem('test')
    return true
  } catch {
    return false
  }
}
