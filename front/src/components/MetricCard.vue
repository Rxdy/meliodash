<script setup lang="ts">
defineProps<{
  title: string
  value: string
  percent?: number
}>()
</script>

<template>
  <div class="card">
    <h3>{{ title }}</h3>
    <p class="value">{{ value }}</p>
    <div v-if="percent !== undefined" class="bar">
      <div class="bar-fill" :style="{ width: `${Math.min(percent, 100)}%` }" />
    </div>
  </div>
</template>

<style scoped>
.card {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 1rem 1.25rem;
}

h3 {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.value {
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--text-h);
}

.bar {
  margin-top: 0.75rem;
  height: 6px;
  border-radius: 3px;
  background: var(--bar-bg);
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: var(--accent);
  transition: width 0.3s ease;
}
</style>
