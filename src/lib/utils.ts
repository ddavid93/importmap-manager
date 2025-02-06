import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function escapeStringRegexp(string: string): string {
  if (typeof string !== 'string') {
    throw new TypeError('Expected a string')
  }

  return string.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d')
}

// includes.ts
export function includes<T>(obj: T[] | string, item: T | string): boolean {
  if (Array.isArray(obj)) {
    return obj.includes(item as T)
  } else if (typeof obj === 'string') {
    return obj.includes(item as string)
  } else {
    throw new Error(`Cannot call includes on ${typeof obj}`)
  }
}
