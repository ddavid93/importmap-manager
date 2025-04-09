import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface ImportMap {
  imports: { [moduleName: string]: string };
  scopes: { [scope: string]: { [moduleName: string]: string } };
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isEqual(a: any, b: any): boolean {
  if (a === b) return true; // Handle primitives and reference equality
  if (
    typeof a !== "object" ||
    typeof b !== "object" ||
    a === null ||
    b === null
  )
    return false; // Handle non-objects and nulls

  if (Array.isArray(a) !== Array.isArray(b)) return false; // Ensure both are arrays or objects

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false; // Check key length

  return keysA.every((key) => keysB.includes(key) && isEqual(a[key], b[key])); // Recursively compare properties
}

export function extractScopeFromUrl(url: string) {
  // Case 1: Full URL (e.g., http://localhost:8821/js/app.js)
  const localhostMatch = url.match(/^https?:\/\/([^/]+)\//);
  if (localhostMatch) {
    return `http://${localhostMatch[1]}/`;
  }

  // Case 2: relative path with dynamic app folder, like /some-folder/app-name/version/js/app.js
  const relativeMatch = url.match(/^\/([^/]+\/[^/]+)\//);
  if (relativeMatch) {
    return `/${relativeMatch[1]}/`;
  }

  return null;
}
