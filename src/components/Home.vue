<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  PlayCircleIcon,
  PauseCircleIcon,
  ArrowDownTrayIcon,
  TrashIcon,
} from '@heroicons/vue/24/solid'
import beatboxIMG from '@/assets/beatbox.png'

const apiUrl = ref(import.meta.env.VITE_API_URL)

interface Music {
  id: string
  title: string
  filename: string
  img_path: string
}

const musicList = ref<Music[]>([])
const isLoading = ref(true)
const hasError = ref(false)
const currentlyPlayingId = ref<string | null>(null)
const isLoadingAudio = ref<string | null>(null)
const audioElement = ref<HTMLAudioElement | null>(null)

const fetchMusic = async () => {
  try {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout')), 10000)
    })

    const fetchPromise = fetch(import.meta.env.VITE_API_URL + '/music/')
    const response = await Promise.race([fetchPromise, timeoutPromise])

    if (response instanceof Response) {
      musicList.value = await response.json()
    }

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
    const response = await fetch(apiUrl.value + `/music/${musicId}`)
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
  const response = await fetch(apiUrl.value + `/music/${music.id}`)
  const audioBlob = await response.blob()
  const audioUrl = URL.createObjectURL(audioBlob)
  const a = document.createElement('a')
  a.href = audioUrl
  a.download = music.title
  a.click()
}

const handleDelete = async (musicId: string) => {
  try {
    const response = await fetch(apiUrl.value + `/music/${musicId}`, {
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

onMounted(() => {
  fetchMusic()
})
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
      <div v-if="isLoading" class="loading-container">
        <div class="loader"></div>
        <p>Chargement des beats...</p>
      </div>

      <div v-else-if="hasError" class="error-container">
        <p>Impossible de récupérer les beats pour l'instant. Merci de réessayer ultérieurement</p>
      </div>

      <div v-else class="music-container">
        <div v-for="music in musicList" :key="music.id" class="music-card">
          <div class="music-image">
            <img :src="apiUrl + '/music/image/' + music.img_path" alt="Music cover" />
          </div>
          <div class="music-title">
            {{ music.title }}
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
