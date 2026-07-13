function isDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function chromeColors() {
  return isDark()
    ? { gridline: '#2c2c2a', textMuted: '#898781', textSecondary: '#c3c2b7' }
    : { gridline: '#e1e0d9', textMuted: '#898781', textSecondary: '#52514e' }
}

const seriesColors = {
  cpu: { light: '#2a78d6', dark: '#3987e5' }, // blue
  memory: { light: '#1baf7a', dark: '#199e70' }, // aqua
  temperature: { light: '#e34948', dark: '#e66767' }, // red
  networkDown: { light: '#4a3aa7', dark: '#9085e9' }, // violet
  networkUp: { light: '#eb6834', dark: '#d95926' }, // orange
  disk: { light: '#eda100', dark: '#c98500' }, // yellow
} as const

export type SeriesKey = keyof typeof seriesColors

export function seriesColor(key: SeriesKey): string {
  return isDark() ? seriesColors[key].dark : seriesColors[key].light
}
