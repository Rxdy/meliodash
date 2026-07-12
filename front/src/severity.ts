export type Severity = 'normal' | 'warning' | 'critical'

export function severityForPercent(percent: number, warningAt = 70, criticalAt = 90): Severity {
  if (percent >= criticalAt) return 'critical'
  if (percent >= warningAt) return 'warning'
  return 'normal'
}
