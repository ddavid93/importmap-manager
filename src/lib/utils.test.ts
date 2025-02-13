import { describe, expect, it } from 'vitest'
import { cn }                   from './utils'

describe('cn', () => {
  it('should return a single class when one class is provided', () => {
    expect(cn('btn')).toBe('btn')
  })

  it('should combine multiple classes into a single string', () => {
    expect(cn('btn', 'btn-primary')).toBe('btn btn-primary')
  })

  it('should handle conditional class merging', () => {
    expect(cn('btn', false)).toBe('btn')
  })

  it('should filter out falsy values', () => {
    expect(cn('btn', null, undefined, false, 0, '')).toBe('btn')
  })

  it('should merge Tailwind classes correctly', () => {
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500')
  })

  it('should handle arrays of classes', () => {
    expect(cn(['btn', 'btn-primary'], 'active')).toBe('btn btn-primary active')
  })

  it('should handle no arguments gracefully', () => {
    expect(cn()).toBe('')
  })
})