<script setup lang="ts">
import { RouterLink } from 'vue-router'
import beatboxIMG from '@/assets/beatbox.png'
import { ref } from 'vue'

const isDarkMode = ref(false)

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.classList.toggle('light-theme')
}
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
      <RouterLink to="/addbeat" class="nav-link">Add a beat</RouterLink>
    </div>
    <button @click="toggleTheme">
      {{ isDarkMode ? 'Light Mode' : 'Dark Mode' }}
    </button>
  </nav>
</template>

<style scoped>
:root {
  /* Variables pour le mode sombre (par défaut) */
  --color-background: #1a1a1a;
  --color-background-soft: #2f2f2f;
  --color-text: #ffffff;
  --vt-c-indigo: #6366f1;
}

:root.light-theme {
  /* Variables pour le mode clair */
  --color-background: #ffffff;
  --color-background-soft: #f9f9f9;
  --color-text: #213547;
  --vt-c-indigo: #4f46e5;
}

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
  color: var(--color-text);
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
  color: white;
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
