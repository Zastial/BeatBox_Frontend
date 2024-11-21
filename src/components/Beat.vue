<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { fetchSong } from '@/utils'
import { onMounted, ref } from 'vue'
import VocalList from './VocalList.vue'
import { PlayCircleIcon, PauseCircleIcon, ArrowDownTrayIcon } from '@heroicons/vue/24/solid'

const apiUrl = ref(import.meta.env.VITE_API_URL)
const currentlyPlayingId = ref<string | null>(null)
const isLoadingAudio = ref<string | null>(null)
const audioElement = ref<HTMLAudioElement | null>(null)

const router = useRouter()

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

const handlePlay = async (musicId: string) => {
  try {
    if (currentlyPlayingId.value === musicId) {
      audioElement.value?.pause()
      currentlyPlayingId.value = null
      return
    }

    isLoadingAudio.value = musicId
    const response = await fetch(apiUrl.value + `/beat/download/${musicId}`)
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

const handleDownload = async (music: Beat) => {
  const response = await fetch(apiUrl.value + `/beat/download/${music.id}`)
  const audioBlob = await response.blob()
  const audioUrl = URL.createObjectURL(audioBlob)
  const a = document.createElement('a')
  a.href = audioUrl
  a.download = music.title
  a.click()
}

const redirectToAddVocal = () => {
  router.push({ path: '/addsong', query: { component: 'vocal', beat_id: beatId } })
}

onMounted(() => {
  fetchBeat()
})
</script>

<template>
  <div v-if="isLoading" class="loading-container">
    <div class="loader"></div>
    <p>Loading beats...</p>
  </div>

  <div v-else-if="hasError" class="error-container">
    <p>Impossible to retrieve the beats for the moment. Please try again later</p>
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
      <div class="beat-controls">
        <div v-if="isLoadingAudio === beat!.id" class="loading-circle"></div>
        <div v-else class="controls-group">
          <button @click="handlePlay(beat!.id)" class="play-button">
            <PlayCircleIcon v-if="currentlyPlayingId !== beat!.id" class="control-icon" />
            <PauseCircleIcon v-else class="control-icon" />
          </button>
          <button class="download-button" @click="handleDownload(beat!)">
            <ArrowDownTrayIcon class="control-icon download-icon" />
          </button>
        </div>
      </div>
    </div>

    <div v-if="beat && beatId" class="vocals-section">
      <div class="vocals-header">
        <h2>VOCALS</h2>
        <button class="add-vocal-button" @click="redirectToAddVocal">Add a vocal</button>
      </div>
      <VocalList :beatId="beatId" />
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

.vocals-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.vocals-section h2 {
  margin-bottom: 0;
  font-size: 1.8rem;
}

.add-vocal-button {
  background-color: var(--vt-c-indigo);
  color: white;
  padding: 1rem 2rem;
  border-radius: 6px;
  margin-left: auto;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-vocal-button:hover {
  background-color: var(--vt-c-indigo-dark, #4338ca);
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

.beat-controls {
  margin-left: auto;
  display: flex;
  align-items: center;
}

.controls-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.control-icon {
  width: 40px;
  height: 40px;
  cursor: pointer;
  transition: color 0.3s;
}

.play-button,
.download-button {
  cursor: pointer;
}

.play-button:hover .control-icon,
.download-button:hover .control-icon {
  color: var(--vt-c-indigo);
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
</style>
