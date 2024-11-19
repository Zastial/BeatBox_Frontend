<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { fetchSong } from '@/utils'
import { onMounted, ref } from 'vue'
import MusicList from './MusicList.vue'

const apiUrl = ref(import.meta.env.VITE_API_URL)

const route = useRoute()
const beatId = route.params.beat_id as string
const beat = ref<Beat>()
const isLoading = ref<boolean>(true)
const hasError = ref<boolean>(false)

const fetchBeat = async () => {
  try {
    beat.value = await fetchSong('beat', beatId)
    isLoading.value = false
  } catch (error) {
    console.error('Erreur lors de la récupération des musiques:', error)
    isLoading.value = false
    hasError.value = true
  }
}

onMounted(() => {
  fetchBeat()
})
</script>

<template>
  <div v-if="isLoading" class="loading-container">
    <div class="loader"></div>
    <p>Chargement des beats...</p>
  </div>

  <div v-else-if="hasError" class="error-container">
    <p>Impossible de récupérer les beats pour l'instant. Merci de réessayer ultérieurement</p>
  </div>

  <div v-else>
    <div class="beat-header">
      <div class="music-image">
        <img :src="apiUrl + '/beat/image/' + beat!.img_path" alt="Music cover" />
      </div>
      <div class="beat-info">
        <h1>{{ beat!.title }}</h1>
        <p class="artist">{{ beat!.artist }}</p>
      </div>
    </div>

    <div class="vocals-section">
      <h2>VOCALS</h2>
      <MusicList type="vocal" />
    </div>
  </div>
</template>

<style scoped>
.beat-header {
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  padding: 2rem;
}

.music-image {
  width: 200px;
  height: 200px;
  flex-shrink: 0;
}

.music-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.beat-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.beat-info h1 {
  font-size: 2.5rem;
  margin: 0;
}

.artist {
  font-size: 1.2rem;
  color: var(--color-text);
  opacity: 0.8;
}

.vocals-section {
  padding: 2rem;
}

.vocals-section h2 {
  margin-bottom: 1rem;
  font-size: 1.8rem;
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

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
