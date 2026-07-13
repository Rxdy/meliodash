import { onMounted, onUnmounted, ref } from 'vue'

export interface ThrottleStatus {
  supported: boolean
  undervoltage: boolean
  throttled: boolean
  temperatureLimit: boolean
  undervoltageOccurred: boolean
  throttledOccurred: boolean
  temperatureLimitOccurred: boolean
}

export interface Metrics {
  timestamp: number
  uptimeSeconds: number
  throttle: ThrottleStatus
  cpu: {
    loadPercent: number
    cores: number
    temperatureCelsius: number | null
  }
  memory: {
    totalBytes: number
    usedBytes: number
    usedPercent: number
  }
  disks: Array<{
    mount: string
    sizeBytes: number
    usedBytes: number
    usedPercent: number
  }>
  network: Array<{
    iface: string
    rxSec: number
    txSec: number
  }>
  history: {
    cpu: HistoryPoint[]
    memory: HistoryPoint[]
    temperature: HistoryPoint[]
    networkRx: HistoryPoint[]
    networkTx: HistoryPoint[]
  }
}

export interface HistoryPoint {
  timestamp: number
  value: number
}

const POLL_INTERVAL_MS = 3000

export function useMetrics() {
  const metrics = ref<Metrics | null>(null)
  const error = ref<string | null>(null)
  let timer: ReturnType<typeof setInterval> | undefined

  async function fetchMetrics() {
    try {
      const res = await fetch('/api/metrics')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      metrics.value = await res.json()
      error.value = null
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'erreur inconnue'
    }
  }

  onMounted(() => {
    fetchMetrics()
    timer = setInterval(fetchMetrics, POLL_INTERVAL_MS)
  })

  onUnmounted(() => {
    if (timer) clearInterval(timer)
  })

  return { metrics, error }
}
