import { describe, expect, it } from 'vitest'
import { formatBytes, formatSpeed, formatUptime } from './format'

describe('formatBytes', () => {
  it('converts bytes to gigabytes with one decimal', () => {
    expect(formatBytes(1024 ** 3 * 2.5)).toBe('2.5 Go')
  })
})

describe('formatUptime', () => {
  it('splits seconds into days and hours', () => {
    expect(formatUptime(90000)).toBe('1j 1h')
  })

  it('handles less than a day', () => {
    expect(formatUptime(3600)).toBe('0j 1h')
  })
})

describe('formatSpeed', () => {
  it('converts bytes per second to megabytes per second', () => {
    expect(formatSpeed(1024 ** 2 * 1.5)).toBe('1.50 Mo/s')
  })
})
