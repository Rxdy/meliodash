<script setup lang="ts">
import { computed } from 'vue'
import { severityForPercent } from '../severity'

const props = withDefaults(
  defineProps<{
    percent: number
    warningAt?: number
    criticalAt?: number
  }>(),
  {
    warningAt: 70,
    criticalAt: 90,
  },
)

const clamped = computed(() => Math.min(Math.max(props.percent, 0), 100))
const severity = computed(() => severityForPercent(props.percent, props.warningAt, props.criticalAt))
</script>

<template>
  <div class="track">
    <div
      class="fill"
      :class="severity"
      :style="{ width: `${clamped}%` }"
    />
  </div>
</template>

<style scoped>
.track {
  height: 10px;
  border-radius: 5px;
  background: var(--gridline);
  overflow: hidden;
}

.fill {
  height: 100%;
  border-radius: 5px;
  background: var(--accent);
  transition: width 0.3s ease;
}

.fill.warning {
  background: var(--warning);
}

.fill.critical {
  background: var(--critical);
}
</style>
