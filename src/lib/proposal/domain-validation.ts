/**
 * Domain validation utilities for controlling where import-map-overrides can be used
 */

import { escapeStringRegexp } from './string-regex';
import { DOMAINS_META, ALLOWLIST_PREFIX, DENYLIST_PREFIX } from './constants';

interface ValidationResult {
  isValid: boolean;
  reason?: string;
}

/**
 * Validates if the current hostname is allowed to use import map overrides
 * based on meta tag configuration
 * @returns Validation result with reason if invalid
 */
export function validateHostname(): ValidationResult {
  const domainsElement = document.querySelector(`meta[name="${DOMAINS_META}"]`);

  if (!domainsElement) {
    // No restrictions defined, so it's valid
    return { isValid: true };
  }

  const content = domainsElement.getAttribute('content');
  if (!content) {
    return {
      isValid: false,
      reason: `Invalid ${DOMAINS_META} meta element - content attribute is required`
    };
  }

  // Function to match hostnames with wildcard support
  const matchHostname = (domain: string): boolean => {
    const regexPattern = escapeStringRegexp(domain).replace('\\*', '.+');
    return new RegExp(regexPattern).test(window.location.hostname);
  };

  if (content.indexOf(ALLOWLIST_PREFIX) === 0) {
    // Allowlist mode - only allow listed domains
    const allowedDomains = content.slice(ALLOWLIST_PREFIX.length).split(',');
    const isAllowed = allowedDomains.some(matchHostname);

    return {
      isValid: isAllowed,
      reason: isAllowed ? undefined : 'Current hostname is not in the allowlist'
    };
  }
  else if (content.indexOf(DENYLIST_PREFIX) === 0) {
    // Denylist mode - block listed domains
    const deniedDomains = content.slice(DENYLIST_PREFIX.length).split(',');
    const isDenied = deniedDomains.some(matchHostname);

    return {
      isValid: !isDenied,
      reason: isDenied ? 'Current hostname is in the denylist' : undefined
    };
  }
  else {
    return {
      isValid: false,
      reason: `Invalid ${DOMAINS_META} meta content attribute - must start with ${ALLOWLIST_PREFIX} or ${DENYLIST_PREFIX}`
    };
  }
}