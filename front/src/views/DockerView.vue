<script setup lang="ts">
import { useDocker } from '../composables/useDocker'
import DockerGroups from '../components/DockerGroups.vue'

const { docker, error, updatedAt } = useDocker()
</script>

<template>
  <div>
    <p
      v-if="updatedAt"
      class="updated"
    >
      MAJ {{ new Date(updatedAt).toLocaleTimeString() }}
    </p>

    <p
      v-if="error"
      class="error"
    >
      Erreur : {{ error }}
    </p>

    <template v-if="docker">
      <DockerGroups
        v-if="docker.available"
        :docker="docker"
      />
      <p
        v-else
        class="muted"
      >
        Le service Docker n'est pas accessible pour le moment.
      </p>
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

.muted {
  color: var(--text-secondary);
}
</style>
