<script setup lang="ts">
import type { DockerInfo } from '../composables/useDocker'

defineProps<{
  docker: DockerInfo
}>()
</script>

<template>
  <section
    v-if="docker.available"
    class="section"
  >
    <h2>Containers Docker</h2>
    <div class="groups">
      <div
        v-for="group in docker.groups"
        :key="group.project"
        class="card"
      >
        <div class="head">
          <p class="project">
            {{ group.project }}
          </p>
          <p class="count">
            {{ group.runningCount }} / {{ group.containers.length }} actif{{ group.containers.length > 1 ? 's' : '' }}
          </p>
        </div>
        <ul class="containers">
          <li
            v-for="container in group.containers"
            :key="container.id"
            class="container"
          >
            <span
              class="dot"
              :class="{ running: container.state === 'running' }"
            />
            <span
              class="name"
              :title="container.name"
            >{{ container.name }}</span>
            <span class="status">{{ container.status }}</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section {
  margin-bottom: 1rem;
}

h2 {
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 0.75rem;
}

.groups {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
}

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
  justify-content: space-between;
  gap: 0.6rem;
}

.project {
  font-weight: 600;
  color: var(--text-primary);
}

.count {
  font-size: 0.8rem;
  color: var(--text-muted);
  white-space: nowrap;
}

.containers {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.container {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex: none;
  align-self: center;
  background: var(--text-muted);
}

.dot.running {
  background: var(--good);
}

.name {
  font-size: 0.9rem;
  color: var(--text-primary);
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status {
  font-size: 0.78rem;
  color: var(--text-muted);
  white-space: nowrap;
  flex: none;
  margin-left: auto;
  text-align: right;
}
</style>
