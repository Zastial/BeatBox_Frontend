<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AddBeat from '../components/AddBeat.vue'
import AddVocal from '../components/AddVocal.vue'
import AddMusic from '../components/AddMusic.vue'
import { fetchSongs } from '../utils'

const selectedComponent = ref<string | null>('beat')
const musicList = ref<Beat[]>([])
const isLoading = ref(true)
const hasError = ref(false)

const handleTypeChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  selectedComponent.value = target.value
}

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

onMounted(() => {
  fetchBeatsAPI()
})
</script>

<template>
  <div v-if="isLoading" class="loading-container">
    <div class="loader"></div>
    <p>Chargement...</p>
  </div>

  <div v-else-if="hasError" class="error-container">
    <p>Une erreur est survenue lors du chargement. Merci de réessayer ultérieurement.</p>
  </div>

  <div v-else class="form-container">
    <h2>Add a song</h2>

    <div class="form-group">
      <label for="type">Type</label>
      <select name="type" id="type" @change="handleTypeChange" required>
        <option value="beat" selected>Beat</option>
        <option value="vocal">Vocal</option>
        <option value="music">Music</option>
      </select>
    </div>

    <component
      v-if="selectedComponent"
      :is="
        selectedComponent === 'beat'
          ? AddBeat
          : selectedComponent === 'vocal'
            ? AddVocal
            : selectedComponent === 'music'
              ? AddMusic
              : null
      "
      :beats="musicList"
    />
  </div>
</template>

<style scoped>
.form-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: var(--color-background-soft);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--color-text);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
