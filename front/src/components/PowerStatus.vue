<script setup lang="ts">
import { computed } from 'vue'
import type { ThrottleStatus } from '../composables/useMetrics'

const props = defineProps<{
  throttle: ThrottleStatus
}>()

const severity = computed(() => {
  const t = props.throttle
  if (t.undervoltage || t.throttled || t.temperatureLimit) return 'critical'
  if (t.undervoltageOccurred || t.throttledOccurred || t.temperatureLimitOccurred) return 'warning'
  return 'good'
})

const message = computed(() => {
  const t = props.throttle
  if (t.undervoltage) return 'Sous-tension détectée en ce moment'
  if (t.throttled) return 'Throttling actif en ce moment'
  if (t.temperatureLimit) return 'Limite de température atteinte en ce moment'
  if (t.undervoltageOccurred) return 'Sous-tension survenue depuis le démarrage'
  if (t.throttledOccurred) return 'Throttling survenu depuis le démarrage'
  if (t.temperatureLimitOccurred) return 'Limite de température atteinte depuis le démarrage'
  return 'Alimentation stable, aucun throttling'
})
</script>

<template>
  <div
    v-if="throttle.supported"
    class="banner"
    :class="severity"
  >
    <span class="dot" />
    <p class="label">
      Alimentation
    </p>
    <p class="message">
      {{ message }}
    </p>
  </div>
</template>

<style scoped>
.banner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: var(--card-bg);
  border-radius: 16px;
  padding: 1rem 1.5rem;
  margin-bottom: 1rem;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex: none;
}

.banner.good .dot {
  background: var(--good);
}

.banner.warning .dot {
  background: var(--warning);
}

.banner.critical .dot {
  background: var(--critical);
}

.label {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.message {
  font-weight: 600;
  color: var(--text-primary);
}

.banner.warning .message {
  color: var(--warning);
}

.banner.critical .message {
  color: var(--critical);
}
</style>
