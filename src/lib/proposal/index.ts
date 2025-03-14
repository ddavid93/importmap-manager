/**
 * @file Entry point for import-map-overrides
 */

import { canAccessLocalStorage } from './storage-utils'
import { validateHostname } from './domain-validation'
import { initializeImportMapOverridesApi } from './api'

/**
 * Global disabled flag
 */
export let isDisabled = false

// Check if the library should be disabled
const hostnameValidation = validateHostname()
if (!hostnameValidation.isValid) {
  console.warn(`Import map overrides disabled: ${hostnameValidation.reason}`)
  isDisabled = true
}

if (!canAccessLocalStorage()) {
  console.warn('Disabling import-map-overrides, since local storage is not readable')
  isDisabled = true
}

// Expose to window for debugging
window.importMapOverridesDisabled = isDisabled

// Initialize if not disabled
if (!isDisabled) {
  // Initialize the API
  window.importMapOverrides = initializeImportMapOverridesApi()

  // Mount the import map
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', () => {
      window.importMapOverrides.mount()
    })
  } else {
    window.importMapOverrides.mount()
  }

  // Listen for changes and re-mount
  window.addEventListener('import-map-overrides:change', () => {
    window.importMapOverrides.mount()
  })
}

// Export public API
export { getParameterByName } from './url-parameter'
export { importMapType } from './constants'
export { getImportMapType, getUrlFromPort } from './api'
export type { ImportMap, ImportMapOverridesApi, ExternalOverrideMap } from './types'
