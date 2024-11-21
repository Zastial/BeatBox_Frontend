<script setup lang="ts">
import { ref, computed } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const props = defineProps<{
  beats: Beat[]
  beat_id: string | null
}>()

const router = useRouter()

const title = ref('')
const artist = ref('')
const selectedBeat = ref(props.beat_id || '')
const searchQuery = ref('')
const audioFile = ref<File | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)
const success = ref(false)
const isDropdownOpen = ref(false)

const filteredBeats = computed(() => {
  return props.beats.filter(
    (beat) =>
      beat.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      beat.artist.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

const selectBeat = (beat: Beat) => {
  selectedBeat.value = beat.id
  isDropdownOpen.value = false
}

const handleAudioChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    audioFile.value = target.files[0]
  }
}

const handleSubmit = async (event: Event) => {
  event.preventDefault()
  if (!title.value || !audioFile.value || !selectedBeat.value) {
    error.value = 'Please fill in all fields'
    return
  }

  isLoading.value = true
  error.value = null
  success.value = false

  try {
    const formData = new FormData()
    formData.append('title', title.value)
    formData.append('artist', artist.value)
    formData.append('beat_id', selectedBeat.value)
    formData.append('audio_file', audioFile.value)

    const response = await axios({
      method: 'post',
      url: `${import.meta.env.VITE_API_URL}/vocal/`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    if (response.status === 201 || response.status === 200) {
      const beat_id = selectedBeat.value

      success.value = true
      title.value = ''
      artist.value = ''
      selectedBeat.value = ''
      audioFile.value = null
      searchQuery.value = ''

      const audioInput = document.getElementById('audio-input') as HTMLInputElement
      if (audioInput) audioInput.value = ''

      router.push('/beat/' + beat_id)
    }
  } catch (e) {
    error.value = 'An error occured while sending the vocal'
    console.error(e)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="form-container">
    <form @submit="handleSubmit" class="beat-form">
      <div class="form-group">
        <label for="title">Title</label>
        <input
          id="title"
          v-model="title"
          type="text"
          placeholder="Enter the vocal title"
          required
        />

        <label for="artist">Artist</label>
        <input
          id="artist"
          v-model="artist"
          type="text"
          placeholder="Enter the artist name"
          required
        />

        <label for="beat-select">Beat</label>
        <div class="dropdown">
          <button type="button" class="dropbtn" @click="isDropdownOpen = !isDropdownOpen">
            {{
              selectedBeat
                ? beats.find((b) => b.id === selectedBeat)?.title || 'Select a beat'
                : 'Select a beat'
            }}
          </button>
          <div class="dropdown-content" :class="{ show: isDropdownOpen }">
            <input type="text" v-model="searchQuery" placeholder="Search a beat..." @click.stop />
            <div
              v-for="beat in filteredBeats"
              :key="beat.id"
              class="dropdown-item"
              @click="selectBeat(beat)"
            >
              {{ beat.title }} - {{ beat.artist }}
            </div>
            <div v-if="filteredBeats.length === 0" class="no-results">No results</div>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label for="audio-input">Audio File</label>
        <input id="audio-input" type="file" accept="audio/*" @change="handleAudioChange" required />
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div v-if="success" class="success-message">Vocal saved with success!</div>

      <button type="submit" :disabled="isLoading">
        <span v-if="isLoading" class="loader"></span>
        <span v-else>Add Vocal</span>
      </button>
    </form>
  </div>
</template>

<style scoped>
.form-container {
  max-width: 500px;
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

.beat-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: 500;
  color: var(--color-text);
}

input[type='text'] {
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background-color: var(--color-background);
  color: var(--color-text);
}

input[type='file'] {
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background-color: var(--color-background);
  color: var(--color-text);
}

button {
  padding: 0.75rem 1.5rem;
  background-color: var(--vt-c-indigo);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 2.5rem;
}

button:hover:not(:disabled) {
  opacity: 0.9;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  color: #dc2626;
  text-align: center;
  padding: 0.5rem;
}

.success-message {
  color: #16a34a;
  text-align: center;
  padding: 0.5rem;
}

.loader {
  width: 20px;
  height: 20px;
  border: 3px solid #ffffff;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  animation: rotation 1s linear infinite;
}

.dropdown {
  position: relative;
  display: inline-block;
  width: 100%;
}

.dropbtn {
  width: 100%;
  padding: 0.75rem 1rem;
  text-align: left;
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  cursor: pointer;
  color: var(--color-text);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;
  font-size: 0.95rem;
}

.dropbtn:hover {
  border-color: var(--vt-c-indigo);
  background-color: var(--color-background-soft);
}

.dropbtn::after {
  content: '▼';
  font-size: 0.8em;
  margin-left: 8px;
  transition: transform 0.2s ease;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: var(--color-background);
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 10;
  margin-top: 4px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.dropdown-content.show {
  display: block;
  animation: dropdownFadeIn 0.2s ease;
}

.dropdown-content input {
  width: calc(100% - 1rem);
  margin: 0.5rem;
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 0.9rem;
  background-color: var(--color-background-soft);
  color: var(--color-text);
  transition: border-color 0.2s ease;
}

.dropdown-content input:focus {
  outline: none;
  border-color: var(--vt-c-indigo);
}

.dropdown-item {
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  border-left: 2px solid transparent;
}

.dropdown-item:hover {
  background-color: var(--color-background-soft);
  border-left: 2px solid var(--vt-c-indigo);
}

.dropdown-content::-webkit-scrollbar {
  width: 8px;
}

.dropdown-content::-webkit-scrollbar-track {
  background: var(--color-background-soft);
  border-radius: 4px;
}

.dropdown-content::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 4px;
}

.dropdown-content::-webkit-scrollbar-thumb:hover {
  background: var(--vt-c-indigo);
}

.no-results {
  padding: 1rem;
  text-align: center;
  color: var(--color-text-light);
  font-style: italic;
}

@keyframes dropdownFadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
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
