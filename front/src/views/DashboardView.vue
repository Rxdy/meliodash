<script setup lang="ts">
import { computed } from 'vue'
import { useMetrics } from '../composables/useMetrics'
import MetricRow from '../components/MetricRow.vue'
import MetricMeter from '../components/MetricMeter.vue'
import MetricChartCard from '../components/MetricChartCard.vue'
import LiveLineChart from '../components/LiveLineChart.vue'
import PowerStatus from '../components/PowerStatus.vue'
import { formatBytes, formatSpeed, formatUptime } from '../format'
import { seriesColor } from '../palette'

const { metrics, error } = useMetrics()

const networkKbSeries = computed(() => {
  if (!metrics.value) return { rx: [], tx: [] }
  return {
    rx: metrics.value.history.networkRx.map((p) => ({ ...p, value: p.value / 1024 })),
    tx: metrics.value.history.networkTx.map((p) => ({ ...p, value: p.value / 1024 })),
  }
})
</script>

<template>
  <div>
    <p
      v-if="metrics"
      class="updated"
    >
      MAJ {{ new Date(metrics.timestamp).toLocaleTimeString() }}
    </p>

    <p
      v-if="error"
      class="error"
    >
      Erreur : {{ error }}
    </p>

    <template v-if="metrics">
      <PowerStatus :throttle="metrics.throttle" />

      <section class="charts">
        <MetricChartCard
          label="CPU"
          :value="`${metrics.cpu.loadPercent}%`"
          :color="seriesColor('cpu')"
        >
          <LiveLineChart
            :series="[{ label: 'CPU', color: seriesColor('cpu'), data: metrics.history.cpu }]"
            unit="%"
            :y-max="100"
          />
        </MetricChartCard>

        <MetricChartCard
          label="RAM"
          :value="`${formatBytes(metrics.memory.usedBytes)} / ${formatBytes(metrics.memory.totalBytes)}`"
          :color="seriesColor('memory')"
        >
          <LiveLineChart
            :series="[{ label: 'RAM', color: seriesColor('memory'), data: metrics.history.memory }]"
            unit="%"
            :y-max="100"
          />
        </MetricChartCard>

        <MetricChartCard
          label="Température"
          :value="metrics.cpu.temperatureCelsius !== null ? `${metrics.cpu.temperatureCelsius}°C` : 'N/A'"
          :color="seriesColor('temperature')"
        >
          <LiveLineChart
            :series="[{ label: 'Température', color: seriesColor('temperature'), data: metrics.history.temperature }]"
            unit="°C"
          />
        </MetricChartCard>

        <MetricChartCard
          v-if="metrics.network[0]"
          :label="`Réseau ${metrics.network[0].iface}`"
          :value="`↓ ${formatSpeed(metrics.network[0].rxSec)} · ↑ ${formatSpeed(metrics.network[0].txSec)}`"
          :color="seriesColor('networkDown')"
        >
          <LiveLineChart
            :series="[
              { label: 'Download', color: seriesColor('networkDown'), data: networkKbSeries.rx },
              { label: 'Upload', color: seriesColor('networkUp'), data: networkKbSeries.tx },
            ]"
            unit=" Ko/s"
          />
        </MetricChartCard>
      </section>

      <section class="rows">
        <MetricRow
          v-for="disk in metrics.disks"
          :key="disk.mount"
          :label="`Disque ${disk.mount}`"
          :value="`${formatBytes(disk.usedBytes)} / ${formatBytes(disk.sizeBytes)}`"
        >
          <MetricMeter :percent="disk.usedPercent" />
        </MetricRow>

        <MetricRow
          label="Uptime"
          :value="formatUptime(metrics.uptimeSeconds)"
        />
      </section>
    </template>

    <p v-else-if="!error">
      Chargement...
    </p>
  </div>
</template>

<style scoped>
.updated {
  font-size: 0.8rem;
  color: var(--text-muted);
  text-align: right;
  margin-bottom: 1rem;
}

.error {
  color: var(--critical);
}

.charts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.rows {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
