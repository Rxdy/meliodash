import { describe, expect, it } from 'vitest'
import { severityForPercent } from './severity'

describe('severityForPercent', () => {
  it('is normal below the warning threshold', () => {
    expect(severityForPercent(50)).toBe('normal')
  })

  it('is warning at or above the warning threshold', () => {
    expect(severityForPercent(70)).toBe('warning')
    expect(severityForPercent(89)).toBe('warning')
  })

  it('is critical at or above the critical threshold', () => {
    expect(severityForPercent(90)).toBe('critical')
    expect(severityForPercent(100)).toBe('critical')
  })

  it('honors custom thresholds', () => {
    expect(severityForPercent(60, 50, 80)).toBe('warning')
    expect(severityForPercent(85, 50, 80)).toBe('critical')
  })
})
