<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'

const { login, error } = useAuth()
const password = ref('')
const loading = ref(false)

async function onSubmit() {
  if (!password.value || loading.value) return
  loading.value = true
  const ok = await login(password.value)
  loading.value = false
  if (!ok) password.value = ''
}
</script>

<template>
  <form
    class="login"
    @submit.prevent="onSubmit"
  >
    <p class="label">
      Accès protégé
    </p>
    <p class="hint">
      Cette page liste les projets hébergés sur la machine — connecte-toi pour y accéder.
    </p>

    <input
      v-model="password"
      type="password"
      placeholder="Mot de passe"
      autocomplete="current-password"
      autofocus
    >

    <button
      type="submit"
      :disabled="loading || !password"
    >
      {{ loading ? 'Connexion...' : 'Se connecter' }}
    </button>

    <p
      v-if="error"
      class="error"
    >
      {{ error }}
    </p>
  </form>
</template>

<style scoped>
.login {
  max-width: 360px;
  margin: 3rem auto 0;
  background: var(--card-bg);
  border-radius: 16px;
  padding: 1.75rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  text-align: center;
}

.label {
  font-weight: 600;
  color: var(--text-primary);
}

.hint {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

input {
  font: inherit;
  padding: 0.65rem 0.85rem;
  border-radius: 10px;
  border: 1px solid var(--gridline);
  background: var(--page-bg);
  color: var(--text-primary);
}

input:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 1px;
}

button {
  font: inherit;
  font-weight: 600;
  padding: 0.65rem 0.85rem;
  border-radius: 10px;
  border: none;
  background: var(--accent);
  color: #fff;
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
  cursor: default;
}

.error {
  font-size: 0.85rem;
  color: var(--critical);
}
</style>
