import { ref } from 'vue'

// Module-scoped on purpose: a single shared auth state for the whole app,
// not a fresh ref per component instance.
const authenticated = ref<boolean | null>(null)
const error = ref<string | null>(null)

async function check() {
  try {
    const res = await fetch('/api/auth/check')
    const data = await res.json()
    authenticated.value = !!data.authenticated
  } catch {
    authenticated.value = false
  }
}

async function login(password: string): Promise<boolean> {
  error.value = null
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (!res.ok) {
      error.value = 'Mot de passe incorrect'
      return false
    }
    authenticated.value = true
    return true
  } catch {
    error.value = 'Erreur réseau'
    return false
  }
}

async function logout() {
  await fetch('/api/auth/logout', { method: 'POST' })
  authenticated.value = false
}

export function useAuth() {
  return { authenticated, error, check, login, logout }
}
