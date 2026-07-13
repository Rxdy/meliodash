<script setup lang="ts">
defineProps<{
  label: string
  value: string
  color: string
}>()
</script>

<template>
  <div class="card">
    <div class="head">
      <span
        class="dot"
        :style="{ background: color }"
      />
      <p class="label">
        {{ label }}
      </p>
      <p class="value">
        {{ value }}
      </p>
    </div>
    <slot />
  </div>
</template>

<style scoped>
.card {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.head {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex: none;
  align-self: center;
}

.label {
  font-size: 0.85rem;
  color: var(--text-secondary);
  flex: 1;
}

.value {
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
}
</style>
