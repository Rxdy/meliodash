<script setup lang="ts">
import { computed, ref } from 'vue'

interface Point {
  timestamp: number
  value: number
}

const props = defineProps<{
  history: Point[]
}>()

const VIEW_WIDTH = 600
const VIEW_HEIGHT = 72
const PADDING_Y = 8

const svgEl = ref<SVGSVGElement | null>(null)
const hoverIndex = ref<number | null>(null)

const bounds = computed(() => {
  const values = props.history.map((p) => p.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = Math.max(max - min, 2)
  return { min: min - span * 0.1, max: max + span * 0.1 }
})

const points = computed(() => {
  const n = props.history.length
  if (n === 0) return []
  const { min, max } = bounds.value
  const range = max - min || 1
  return props.history.map((p, i) => ({
    x: n === 1 ? VIEW_WIDTH : (i / (n - 1)) * VIEW_WIDTH,
    y: PADDING_Y + (1 - (p.value - min) / range) * (VIEW_HEIGHT - PADDING_Y * 2),
    timestamp: p.timestamp,
    value: p.value,
  }))
})

const linePath = computed(() =>
  points.value.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' '),
)

const areaPath = computed(() => {
  if (points.value.length === 0) return ''
  const first = points.value[0]
  const last = points.value[points.value.length - 1]
  return `${linePath.value} L${last.x.toFixed(1)},${VIEW_HEIGHT} L${first.x.toFixed(1)},${VIEW_HEIGHT} Z`
})

const hovered = computed(() => (hoverIndex.value !== null ? points.value[hoverIndex.value] : null))

function onMove(event: PointerEvent) {
  if (!svgEl.value || points.value.length === 0) return
  const rect = svgEl.value.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width) * VIEW_WIDTH
  let closest = 0
  let closestDist = Infinity
  points.value.forEach((p, i) => {
    const dist = Math.abs(p.x - x)
    if (dist < closestDist) {
      closestDist = dist
      closest = i
    }
  })
  hoverIndex.value = closest
}

function onLeave() {
  hoverIndex.value = null
}

function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div class="chart">
    <p
      v-if="history.length < 2"
      class="empty"
    >
      Historique en cours...
    </p>
    <svg
      v-else
      ref="svgEl"
      :viewBox="`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`"
      preserveAspectRatio="none"
      class="svg"
      @pointermove="onMove"
      @pointerleave="onLeave"
    >
      <path
        :d="areaPath"
        class="area"
      />
      <path
        :d="linePath"
        class="line"
      />
      <g v-if="hovered">
        <line
          :x1="hovered.x"
          :x2="hovered.x"
          y1="0"
          :y2="VIEW_HEIGHT"
          class="crosshair"
        />
        <circle
          :cx="hovered.x"
          :cy="hovered.y"
          r="4"
          class="dot"
        />
      </g>
    </svg>
    <div
      v-if="hovered"
      class="tooltip"
      :style="{ left: `${(hovered.x / VIEW_WIDTH) * 100}%` }"
    >
      <strong>{{ hovered.value }}°C</strong>
      <span>{{ formatTime(hovered.timestamp) }}</span>
    </div>
  </div>
</template>

<style scoped>
.chart {
  position: relative;
  width: 100%;
  height: 72px;
}

.empty {
  font-size: 0.8rem;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  height: 100%;
}

.svg {
  width: 100%;
  height: 100%;
  overflow: visible;
  cursor: crosshair;
}

.area {
  fill: var(--accent);
  opacity: 0.1;
  stroke: none;
}

.line {
  fill: none;
  stroke: var(--accent);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.crosshair {
  stroke: var(--gridline);
  stroke-width: 1;
}

.dot {
  fill: var(--accent);
  stroke: var(--card-bg);
  stroke-width: 2;
}

.tooltip {
  position: absolute;
  top: -0.25rem;
  transform: translate(-50%, -100%);
  background: var(--text-primary);
  color: var(--card-bg);
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1rem;
  pointer-events: none;
  white-space: nowrap;
}
</style>
