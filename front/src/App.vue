<script setup lang="ts">
import { useMetrics } from './composables/useMetrics'
import MetricRow from './components/MetricRow.vue'
import MetricMeter from './components/MetricMeter.vue'
import TemperatureChart from './components/TemperatureChart.vue'
import { formatBytes, formatSpeed, formatUptime } from './format'

const { metrics, error } = useMetrics()
</script>

<template>
  <main>
    <header>
      <h1>meliodash</h1>
      <p
        v-if="metrics"
        class="updated"
      >
        MAJ {{ new Date(metrics.timestamp).toLocaleTimeString() }}
      </p>
    </header>

    <p
      v-if="error"
      class="error"
    >
      Erreur : {{ error }}
    </p>

    <section
      v-if="metrics"
      class="rows"
    >
      <MetricRow
        label="CPU"
        :value="`${metrics.cpu.loadPercent}%`"
      >
        <MetricMeter :percent="metrics.cpu.loadPercent" />
      </MetricRow>

      <MetricRow
        label="Température"
        :value="metrics.cpu.temperatureCelsius !== null ? `${metrics.cpu.temperatureCelsius}°C` : 'N/A'"
      >
        <TemperatureChart :history="metrics.cpu.temperatureHistory" />
      </MetricRow>

      <MetricRow
        label="RAM"
        :value="`${formatBytes(metrics.memory.usedBytes)} / ${formatBytes(metrics.memory.totalBytes)}`"
      >
        <MetricMeter :percent="metrics.memory.usedPercent" />
      </MetricRow>

      <MetricRow
        v-for="disk in metrics.disks"
        :key="disk.mount"
        :label="`Disque ${disk.mount}`"
        :value="`${formatBytes(disk.usedBytes)} / ${formatBytes(disk.sizeBytes)}`"
      >
        <MetricMeter :percent="disk.usedPercent" />
      </MetricRow>

      <MetricRow
        v-for="net in metrics.network"
        :key="net.iface"
        :label="`Réseau ${net.iface}`"
        :value="`↓ ${formatSpeed(net.rxSec)} · ↑ ${formatSpeed(net.txSec)}`"
      />

      <MetricRow
        label="Uptime"
        :value="formatUptime(metrics.uptimeSeconds)"
      />
    </section>

    <p v-else-if="!error">
      Chargement...
    </p>
  </main>
</template>

<style scoped>
main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 1.25rem 3rem;
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
  color: var(--critical);
}

.rows {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
