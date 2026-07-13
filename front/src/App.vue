<script setup lang="ts"></script>

<template>
  <div class="shell">
    <header class="topbar">
      <h1>Metryx</h1>
      <nav>
        <RouterLink
          to="/"
          exact-active-class="active"
        >
          Dashboard
        </RouterLink>
        <RouterLink
          to="/docker"
          active-class="active"
        >
          Containers
        </RouterLink>
      </nav>
    </header>

    <RouterView />
  </div>
</template>

<style scoped>
.shell {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 1.25rem 3rem;
}

.topbar {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

h1 {
  font-size: 1.5rem;
}

nav {
  display: flex;
  gap: 1.5rem;
}

nav a {
  font-size: 0.9rem;
  color: var(--text-secondary);
  text-decoration: none;
}

nav a.active {
  color: var(--text-primary);
  font-weight: 600;
}
</style>
