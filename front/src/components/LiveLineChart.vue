<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  CategoryScale,
  Chart,
  Filler,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js'
import { chromeColors } from '../palette'

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler)

interface Series {
  label: string
  color: string
  data: Array<{ timestamp: number; value: number }>
}

const props = defineProps<{
  series: Series[]
  unit?: string
  yMax?: number
}>()

const canvasEl = ref<HTMLCanvasElement | null>(null)
let chart: Chart<'line'> | null = null

function labels() {
  return (props.series[0]?.data ?? []).map((p) =>
    new Date(p.timestamp).toLocaleTimeString([], { minute: '2-digit', second: '2-digit' }),
  )
}

function datasets() {
  return props.series.map((s) => ({
    label: s.label,
    data: s.data.map((p) => p.value),
    borderColor: s.color,
    backgroundColor: `${s.color}1a`,
    borderWidth: 2,
    pointRadius: 0,
    pointHoverRadius: 4,
    pointHitRadius: 12,
    tension: 0.25,
    fill: props.series.length === 1,
  }))
}

onMounted(() => {
  if (!canvasEl.value) return
  const { gridline, textMuted, textSecondary } = chromeColors()

  chart = new Chart(canvasEl.value, {
    type: 'line',
    data: { labels: labels(), datasets: datasets() },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: 'index', intersect: false },
      scales: {
        x: { display: false },
        y: {
          beginAtZero: true,
          max: props.yMax,
          grid: { color: gridline },
          border: { display: false },
          ticks: { color: textMuted, maxTicksLimit: 4 },
        },
      },
      plugins: {
        legend: {
          display: props.series.length > 1,
          position: 'top',
          align: 'end',
          labels: { color: textSecondary, boxWidth: 12, usePointStyle: true, pointStyle: 'line' },
        },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${ctx.formattedValue}${props.unit ?? ''}`,
          },
        },
      },
    },
  })
})

watch(
  () => props.series,
  () => {
    if (!chart) return
    chart.data.labels = labels()
    chart.data.datasets = datasets()
    chart.update('none')
  },
  { deep: true },
)

onBeforeUnmount(() => {
  chart?.destroy()
})
</script>

<template>
  <div class="chart-wrap">
    <canvas ref="canvasEl" />
  </div>
</template>

<style scoped>
.chart-wrap {
  position: relative;
  width: 100%;
  height: 140px;
}
</style>
