# Import Map Overrides

This project provides a robust API for dynamically overriding import maps in the browser, with full support for both *
*imports** and **scopes**. It allows you to modify module URLs at runtime, which is especially useful during
development, testing, or gradual rollouts of module updates.

---

## Usage

### Importing the Library

Import the default singleton instance from the package:

```typescript
import importMapOverrides from 'import-map-overrides';
```

### Adding Import Overrides

Override a module by specifying its name and the new URL:

```typescript
importMapOverrides.addOverride('react', 'https://custom-cdn.com/react.development.js');
```

### Adding Scope Overrides

Apply an override only within a specific scope:

```typescript
// In the "/my/scope/" context, override "react" with a production version.
importMapOverrides.addScopeOverride('/my/scope/', 'react', 'https://custom-cdn.com/react.production.min.js');
```

### Removing Overrides

Remove an import or scope override:

```typescript
// Remove a standard import override.
importMapOverrides.removeOverride('react');

// Remove a scope override.
importMapOverrides.removeScopeOverride('/my/scope/', 'react');

```

### Resetting All Overrides

Reset all active overrides (both import and scope):

```typescript
importMapOverrides.resetOverrides();
```

### Retrieving the Current Import Map

Retrieving the Current Import Map

```typescript
importMapOverrides.getCurrentPageMap().then((importMap) => {
  console.log('Current Import Map:', importMap);
});
```

### External Override Maps

Manage external override maps with the following methods:

```typescript
importMapOverrides.addExternalOverride('https://example.com/override-map.json');
```

Remove External Override

```typescript
importMapOverrides.removeExternalOverride('https://example.com/override-map.json');
```

Get Merged External Map

```typescript
importMapOverrides.getExternalOverrideMap().then((map) => {
  console.log('Merged External Override Map:', map);
});
```

### Meta Tag Configuration

The library uses meta tags to configure its behavior.

Import Map Type
Define the type of import map with a meta tag:

```html

<meta name="importmap-type" content="importmap">
```

Domain Allowlist/Denylist
Enable or disable overrides based on the current domain:

```html

<meta name="import-map-overrides-domains" content="allowlist:example.com,*.example.org">
```

Server Overrides

```html

<meta name="importmap-type" content="importmap" server-cookie>
```