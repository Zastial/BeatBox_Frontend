<script setup lang="ts">
import beatboxIMG from '@/assets/beatbox.png'
import MusicList from './MusicList.vue'
</script>

<template>
  <div class="main-container">
    <div class="welcome-container">
      <h1>BEATBOX</h1>
      <div class="beatbox-img-container">
        <img class="beatbox-img" :src="beatboxIMG" alt="Beatbox" />
      </div>
    </div>

    <div class="musics-container">
      <MusicList />
    </div>
  </div>
</template>

<style scoped>
.main-container {
  display: flex;
  gap: 2rem;
  padding: 1rem;
}

.welcome-container {
  flex: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.welcome-container h1 {
  font-size: 3rem;
  font-weight: 700;
  color: var(--color-text);
  text-align: center;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.1rem;
  text-shadow: 0 0 10px var(--color-text);
  text-decoration: underline;
  text-decoration-color: var(--color-text);
  text-decoration-thickness: 2px;
  text-decoration-skip-ink: none;
}

.beatbox-img-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.beatbox-img {
  width: 100px;
  height: 100px;
}

.musics-container {
  flex: 50%;
  display: flex;
  flex-direction: column;
  height: 85vh;
  padding: 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
