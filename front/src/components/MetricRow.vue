<script setup lang="ts">
defineProps<{
  label: string
  value: string
}>()
</script>

<template>
  <div class="row">
    <div class="heading">
      <p class="label">
        {{ label }}
      </p>
      <p class="value">
        {{ value }}
      </p>
    </div>
    <div class="visual">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  gap: 2rem;
  width: 100%;
  background: var(--card-bg);
  border-radius: 16px;
  padding: 1.25rem 1.75rem;
}

.heading {
  flex: 0 0 auto;
  min-width: 180px;
}

.label {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 0.3rem;
}

.value {
  font-size: 2rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
}

.visual {
  flex: 1 1 auto;
  min-width: 0;
}

@media (max-width: 640px) {
  .row {
    flex-direction: column;
    align-items: stretch;
    gap: 0.85rem;
    padding: 1.1rem 1.25rem;
  }

  .heading {
    min-width: 0;
  }

  .value {
    font-size: 1.65rem;
  }
}
</style>
