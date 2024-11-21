<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  PlayCircleIcon,
  PauseCircleIcon,
  ArrowDownTrayIcon,
  TrashIcon,
} from '@heroicons/vue/24/solid'
import { fetchVocals } from '../utils'

const apiUrl = ref(import.meta.env.VITE_API_URL)

const vocalList = ref<Vocal[]>([])
const isLoading = ref(true)
const hasError = ref(false)
const currentlyPlayingId = ref<string | null>(null)
const isLoadingAudio = ref<string | null>(null)
const audioElement = ref<HTMLAudioElement | null>(null)

const props = defineProps<{
  beatId: string
}>()

const fetchvocalsAPI = async () => {
  if (vocalList.value.length > 0) return

  try {
    vocalList.value = await fetchVocals(props.beatId)
    isLoading.value = false
  } catch (error) {
    console.error('Erreur lors de la récupération des musiques:', error)
    isLoading.value = false
    hasError.value = true
  }
}

const handlePlay = async (vocalId: string) => {
  try {
    if (currentlyPlayingId.value === vocalId) {
      audioElement.value?.pause()
      currentlyPlayingId.value = null
      return
    }

    isLoadingAudio.value = vocalId
    const response = await fetch(apiUrl.value + `/vocal/download/${vocalId}`)
    const audioBlob = await response.blob()
    const audioUrl = URL.createObjectURL(audioBlob)

    if (audioElement.value) {
      audioElement.value.pause()
    }

    audioElement.value = new Audio(audioUrl)
    await audioElement.value.play()
    currentlyPlayingId.value = vocalId
    isLoadingAudio.value = null

    audioElement.value.addEventListener('ended', () => {
      currentlyPlayingId.value = null
    })
  } catch (error) {
    console.error('Erreur lors de la lecture de la musique:', error)
    isLoadingAudio.value = null
  }
}

const handleDownload = async (vocal: Vocal) => {
  const response = await fetch(apiUrl.value + `/vocal/download/${vocal.id}`)
  const audioBlob = await response.blob()
  const audioUrl = URL.createObjectURL(audioBlob)
  const a = document.createElement('a')
  a.href = audioUrl
  a.download = vocal.title
  a.click()
}

const handleDelete = async (vocalId: string) => {
  try {
    const response = await fetch(apiUrl.value + `/vocal/${vocalId}`, {
      method: 'DELETE',
    })

    if (response.ok) {
      // Mettre à jour la liste en filtrant l'élément supprimé
      vocalList.value = vocalList.value.filter((vocal) => vocal.id !== vocalId)

      // Si c'était la musique en cours de lecture, on l'arrête
      if (currentlyPlayingId.value === vocalId) {
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
  fetchvocalsAPI()
})
</script>

<template>
  <div v-if="isLoading" class="loading-container">
    <div class="loader"></div>
    <p>Chargement des vocals...</p>
  </div>

  <div v-else-if="hasError" class="error-container">
    <p>Impossible de récupérer les vocals pour l'instant. Merci de réessayer ultérieurement</p>
  </div>

  <div v-else-if="vocalList.length === 0" class="vocal-container empty-container">
    <p>Aucun vocal trouvé pour ce beat</p>
  </div>

  <div v-else class="vocal-container">
    <div v-for="vocal in vocalList" :key="vocal.id" class="vocal-card">
      <div class="vocal-title">{{ vocal.title }} - {{ vocal.artist }}</div>
      <div class="vocal-controls">
        <div v-if="isLoadingAudio === vocal.id" class="loading-circle"></div>
        <div v-else class="controls-group">
          <button @click="handlePlay(vocal.id)" class="play-button">
            <PlayCircleIcon v-if="currentlyPlayingId !== vocal.id" class="control-icon" />
            <PauseCircleIcon v-else class="control-icon" />
          </button>
          <button class="download-button" @click="handleDownload(vocal)">
            <ArrowDownTrayIcon class="control-icon download-icon" />
          </button>
          <button class="delete-button" @click="handleDelete(vocal.id)">
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

.vocal-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  overflow-y: auto;
  min-height: 20rem;
  flex: 1;
  border: 1px solid var(--color-text);
  border-radius: 8px;
}

.vocal-container::-webkit-scrollbar {
  width: 8px;
}

.vocal-container::-webkit-scrollbar-track {
  background: var(--color-background-soft);
  border-radius: 4px;
}

.vocal-container::-webkit-scrollbar-thumb {
  background: var(--color-text);
  opacity: 0.5;
  border-radius: 4px;
}

.vocal-container::-webkit-scrollbar-thumb:hover {
  background: var(--vt-c-indigo);
}

.vocal-card {
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: var(--color-background-soft);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.vocal-image {
  width: 60px;
  height: 60px;
  margin-right: 1rem;
}

.vocal-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.vocal-title {
  flex: 1;
  font-size: 1.1rem;
}

.vocal-controls {
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
