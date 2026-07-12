<script setup lang="ts">
import { useMetrics } from './composables/useMetrics'
import MetricCard from './components/MetricCard.vue'

const { metrics, error } = useMetrics()

function formatBytes(bytes: number) {
  return `${(bytes / 1024 ** 3).toFixed(1)} Go`
}

function formatUptime(seconds: number) {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  return `${days}j ${hours}h`
}

function formatSpeed(bytesPerSec: number) {
  return `${(bytesPerSec / 1024 ** 2).toFixed(2)} Mo/s`
}
</script>

<template>
  <main>
    <header>
      <h1>meliodash</h1>
      <p v-if="metrics" class="updated">
        MAJ {{ new Date(metrics.timestamp).toLocaleTimeString() }}
      </p>
    </header>

    <p v-if="error" class="error">Erreur : {{ error }}</p>

    <section v-if="metrics" class="grid">
      <MetricCard title="CPU" :value="`${metrics.cpu.loadPercent}%`" :percent="metrics.cpu.loadPercent" />
      <MetricCard
        title="Température"
        :value="metrics.cpu.temperatureCelsius !== null ? `${metrics.cpu.temperatureCelsius}°C` : 'N/A'"
      />
      <MetricCard
        title="RAM"
        :value="`${formatBytes(metrics.memory.usedBytes)} / ${formatBytes(metrics.memory.totalBytes)}`"
        :percent="metrics.memory.usedPercent"
      />
      <MetricCard title="Uptime" :value="formatUptime(metrics.uptimeSeconds)" />

      <MetricCard
        v-for="disk in metrics.disks"
        :key="disk.mount"
        :title="`Disque ${disk.mount}`"
        :value="`${formatBytes(disk.usedBytes)} / ${formatBytes(disk.sizeBytes)}`"
        :percent="disk.usedPercent"
      />

      <MetricCard
        v-for="net in metrics.network"
        :key="net.iface"
        :title="`Réseau ${net.iface}`"
        :value="`↓ ${formatSpeed(net.rxSec)} · ↑ ${formatSpeed(net.txSec)}`"
      />
    </section>

    <p v-else-if="!error">Chargement...</p>
  </main>
</template>

<style scoped>
main {
  max-width: 960px;
  margin: 0 auto;
  padding: 1.5rem 1rem 3rem;
}

header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

h1 {
  font-size: 1.5rem;
}

.updated {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.error {
  color: var(--danger);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}
</style>
