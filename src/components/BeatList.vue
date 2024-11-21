<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  PlayCircleIcon,
  PauseCircleIcon,
  ArrowDownTrayIcon,
  TrashIcon,
} from '@heroicons/vue/24/solid'
import { fetchSongs } from '../utils'
import { useRouter } from 'vue-router'

const apiUrl = ref(import.meta.env.VITE_API_URL)

const musicList = ref<Music[]>([])
const isLoading = ref(true)
const hasError = ref(false)
const currentlyPlayingId = ref<string | null>(null)
const isLoadingAudio = ref<string | null>(null)
const audioElement = ref<HTMLAudioElement | null>(null)

const router = useRouter()

const fetchBeatsAPI = async () => {
  try {
    musicList.value = await fetchSongs('beat')
    isLoading.value = false
  } catch (error) {
    console.error('Erreur lors de la récupération des musiques:', error)
    isLoading.value = false
    hasError.value = true
  }
}

const handlePlay = async (musicId: string) => {
  try {
    if (currentlyPlayingId.value === musicId) {
      // Pause the current playing music
      audioElement.value?.pause()
      currentlyPlayingId.value = null
      return
    }

    isLoadingAudio.value = musicId
    const response = await fetch(apiUrl.value + `/beat/${musicId}`)
    const audioBlob = await response.blob()
    const audioUrl = URL.createObjectURL(audioBlob)

    if (audioElement.value) {
      audioElement.value.pause()
    }

    audioElement.value = new Audio(audioUrl)
    await audioElement.value.play()
    currentlyPlayingId.value = musicId
    isLoadingAudio.value = null

    audioElement.value.addEventListener('ended', () => {
      currentlyPlayingId.value = null
    })
  } catch (error) {
    console.error('Erreur lors de la lecture de la musique:', error)
    isLoadingAudio.value = null
  }
}

const handleDownload = async (music: Music) => {
  const response = await fetch(apiUrl.value + `/beat/download/${music.id}`)
  const audioBlob = await response.blob()
  const audioUrl = URL.createObjectURL(audioBlob)
  const a = document.createElement('a')
  a.href = audioUrl
  a.download = music.title
  a.click()
}

const handleDelete = async (musicId: string) => {
  try {
    const response = await fetch(apiUrl.value + `/beat/${musicId}`, {
      method: 'DELETE',
    })

    if (response.ok) {
      // Mettre à jour la liste en filtrant l'élément supprimé
      musicList.value = musicList.value.filter((music) => music.id !== musicId)

      // Si c'était la musique en cours de lecture, on l'arrête
      if (currentlyPlayingId.value === musicId) {
        audioElement.value?.pause()
        currentlyPlayingId.value = null
      }
    } else {
      console.error('Erreur lors de la suppression:', response.statusText)
    }
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
  }
}

const handleClick = (beatId: string) => {
  router.push(`/beat/${beatId}`)
}

const redirectToAddBeat = () => {
  router.push({ path: '/addsong', query: { component: 'beat' } })
}

onMounted(() => {
  fetchBeatsAPI()
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

  <div v-else-if="musicList.length === 0" class="music-container empty-container">
    <p>Aucun beat trouvé</p>
    <button class="add-vocal-button" @click="redirectToAddBeat">Add a beat</button>
  </div>

  <div v-else class="music-container">
    <div v-for="music in musicList" :key="music.id" class="music-card">
      <div class="clickable-area" @click="handleClick(music.id)">
        <div class="music-image">
          <img :src="apiUrl + '/beat/image/' + music.img_path" alt="Music cover" />
        </div>
        <div class="music-title">{{ music.title }} - {{ music.artist }}</div>
      </div>
      <div class="music-controls">
        <div v-if="isLoadingAudio === music.id" class="loading-circle"></div>
        <div v-else class="controls-group">
          <button @click="handlePlay(music.id)" class="play-button">
            <PlayCircleIcon v-if="currentlyPlayingId !== music.id" class="control-icon" />
            <PauseCircleIcon v-else class="control-icon" />
          </button>
          <button class="download-button" @click="handleDownload(music)">
            <ArrowDownTrayIcon class="control-icon download-icon" />
          </button>
          <button class="delete-button" @click="handleDelete(music.id)">
            <TrashIcon class="control-icon delete-icon" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.clickable-area {
  display: flex;
  align-items: center;
  flex: 1;
  cursor: pointer;
}

.empty-container {
  text-align: center;
  padding: 2rem;
  color: hsla(160, 100%, 37%, 1);
  font-size: 1.5rem;
  font-weight: bold;
  justify-content: center;
}

.empty-container button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  width: 15%;
  margin: 0 auto;
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
  height: 100%;
  min-height: 50vh;
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
