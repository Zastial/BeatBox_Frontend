<script setup lang="ts">
import { RouterLink } from 'vue-router'
import beatboxIMG from '@/assets/beatbox.png'
</script>

<template>
  <nav class="navbar">
    <div class="logo-container">
      <RouterLink to="/">
        <img :src="beatboxIMG" alt="Beatbox logo" class="logo" />
        <span class="brand-name">BEATBOX</span>
      </RouterLink>
    </div>
    <div class="nav-links">
      <RouterLink to="/" class="nav-link">Home</RouterLink>
      <RouterLink to="/addsong" class="nav-link">Add a song</RouterLink>
      <RouterLink to="/beats" class="nav-link">Beats</RouterLink>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: var(--color-background-soft);
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo-container a {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.logo {
  width: 32px;
  height: 32px;
  margin-right: 1rem;
}

.brand-name {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.1rem;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: var(--color-text);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-link:hover {
  background-color: var(--color-background-mute);
}

.nav-link.router-link-active {
  color: hsla(160, 100%, 37%, 1);
  background-color: var(--color-background-mute);
}

@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
  }

  .nav-links {
    width: 100%;
    justify-content: center;
  }
}
</style>
