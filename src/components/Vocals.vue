<script setup lang="ts">
import MusicList from './MusicList.vue'
</script>

<template>
  <div class="musics-container">
    <MusicList type="vocal" />
  </div>
</template>

<style scoped>
.musics-container {
  flex: 50%;
  display: flex;
  flex-direction: column;
  height: 85vh;
  padding: 1rem;
}

.music-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  overflow-y: auto;
  min-height: 0;
  flex: 1;
  border: 1px solid var(--color-text);
  border-radius: 8px;
}

.music-container::-webkit-scrollbar {
  width: 8px;
}

.music-container::-webkit-scrollbar-track {
  background: var(--color-background-soft);
  border-radius: 4px;
}

.music-container::-webkit-scrollbar-thumb {
  background: var(--color-text);
  opacity: 0.5;
  border-radius: 4px;
}

.music-container::-webkit-scrollbar-thumb:hover {
  background: var(--vt-c-indigo);
}

.music-card {
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: var(--color-background-soft);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.music-image {
  width: 60px;
  height: 60px;
  margin-right: 1rem;
}

.music-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.music-title {
  flex: 1;
  font-size: 1.1rem;
}

.music-controls {
  margin-left: 1rem;
}

.controls-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.control-icon {
  width: 30px;
  height: 30px;
  cursor: pointer;
  transition: color 0.3s;
}

.play-button {
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: color 0.3s;
  height: 39px;
}

.delete-icon {
  color: #dc2626;
}

.delete-icon:hover {
  color: #ef4444;
}

.download-icon:hover {
  color: var(--vt-c-indigo);
}

.play-button:hover {
  color: var(--vt-c-indigo);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  gap: 1rem;
}

.loader {
  width: 48px;
  height: 48px;
  border: 5px solid var(--color-background-soft);
  border-bottom-color: var(--color-text);
  border-radius: 50%;
  animation: rotation 1s linear infinite;
}

.error-container {
  text-align: center;
  padding: 2rem;
  color: #dc2626;
}

.loading-circle {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-background-soft);
  border-top: 3px solid var(--color-text);
  border-radius: 50%;
  animation: spin 1s linear infinite;
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
