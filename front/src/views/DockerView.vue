<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'
import LoginForm from '../components/LoginForm.vue'
import DockerContent from '../components/DockerContent.vue'

const { authenticated, check, logout } = useAuth()

onMounted(check)
</script>

<template>
  <div>
    <LoginForm v-if="authenticated === false" />

    <template v-else-if="authenticated">
      <div class="session">
        <button
          type="button"
          class="logout"
          @click="logout"
        >
          Se déconnecter
        </button>
      </div>
      <DockerContent />
    </template>

    <p v-else>
      Vérification...
    </p>
  </div>
</template>

<style scoped>
.session {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.5rem;
}

.logout {
  font: inherit;
  font-size: 0.8rem;
  color: var(--text-muted);
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
}

.logout:hover {
  color: var(--text-secondary);
}
</style>
