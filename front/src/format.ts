export function formatBytes(bytes: number) {
  return `${(bytes / 1024 ** 3).toFixed(1)} Go`
}

export function formatUptime(seconds: number) {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  return `${days}j ${hours}h`
}

export function formatSpeed(bytesPerSec: number) {
  return `${(bytesPerSec / 1024 ** 2).toFixed(2)} Mo/s`
}
