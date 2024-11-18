<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const title = ref('')
const audioFile = ref<File | null>(null)
const imageFile = ref<File | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)
const success = ref(false)

const handleAudioChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    audioFile.value = target.files[0]
  }
}

const handleImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    imageFile.value = target.files[0]
  }
}

const handleSubmit = async (event: Event) => {
  event.preventDefault()
  if (!title.value || !audioFile.value || !imageFile.value) {
    error.value = 'Veuillez remplir tous les champs'
    return
  }

  isLoading.value = true
  error.value = null
  success.value = false

  try {
    // Création d'un objet avec les données
    const data = {
      title: title.value,
      audio_file: audioFile.value,
      image_file: imageFile.value,
    }

    // Création du FormData à partir de l'objet
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value, value.name)
      } else {
        formData.append(key, value)
      }
    })

    const response = await axios({
      method: 'post',
      url: import.meta.env.VITE_API_URL + '/music/',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    console.log(response)

    if (response.status === 201 || response.status === 200) {
      success.value = true
      // Reset du formulaire
      title.value = ''
      audioFile.value = null
      imageFile.value = null

      const audioInput = document.getElementById('audio-input') as HTMLInputElement
      const imageInput = document.getElementById('image-input') as HTMLInputElement
      if (audioInput) audioInput.value = ''
      if (imageInput) imageInput.value = ''

      router.back()
    }
  } catch (e) {
    error.value = "Une erreur est survenue lors de l'envoi"
    console.error(e)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="form-container">
    <h2>Ajouter un beat</h2>

    <form @submit="handleSubmit" class="beat-form">
      <div class="form-group">
        <label for="title">Titre</label>
        <input
          id="title"
          v-model="title"
          type="text"
          placeholder="Entrez le titre du beat"
          required
        />
      </div>

      <div class="form-group">
        <label for="audio-input">Fichier audio</label>
        <input id="audio-input" type="file" accept="audio/*" @change="handleAudioChange" required />
      </div>

      <div class="form-group">
        <label for="image-input">Image de couverture</label>
        <input id="image-input" type="file" accept="image/*" @change="handleImageChange" required />
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div v-if="success" class="success-message">
        Beat ajouté avec succès !
        <router-link to="/">Retour à la liste des beats</router-link>
      </div>

      <button type="submit" :disabled="isLoading">
        <span v-if="isLoading" class="loader"></span>
        <span v-else>Ajouter le beat</span>
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

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
