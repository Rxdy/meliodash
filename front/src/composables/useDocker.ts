import { onMounted, onUnmounted, ref } from 'vue'

export interface DockerContainer {
  id: string
  name: string
  service: string | null
  image: string
  state: string
  status: string
}

export interface DockerGroup {
  project: string
  containers: DockerContainer[]
  runningCount: number
}

export interface DockerInfo {
  available: boolean
  groups: DockerGroup[]
}

const POLL_INTERVAL_MS = 15000

export function useDocker() {
  const docker = ref<DockerInfo | null>(null)
  const error = ref<string | null>(null)
  const updatedAt = ref<number | null>(null)
  let timer: ReturnType<typeof setInterval> | undefined

  async function fetchDocker() {
    try {
      const res = await fetch('/api/docker')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      docker.value = await res.json()
      updatedAt.value = Date.now()
      error.value = null
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'erreur inconnue'
    }
  }

  onMounted(() => {
    fetchDocker()
    timer = setInterval(fetchDocker, POLL_INTERVAL_MS)
  })

  onUnmounted(() => {
    if (timer) clearInterval(timer)
  })

  return { docker, error, updatedAt }
}
