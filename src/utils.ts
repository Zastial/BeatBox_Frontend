import { ref } from 'vue'

const apiUrl = ref(import.meta.env.VITE_API_URL)

export const fetchMusic = async (): Promise<Music[]> => {
  const musicList = ref<Music[]>([])
  try {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout')), 10000)
    })

    const fetchPromise = fetch(apiUrl.value + '/music/')
    const response = await Promise.race([fetchPromise, timeoutPromise])

    if (response instanceof Response) {
      musicList.value = await response.json()
    }

  } catch (error) {
    console.error('Erreur lors de la récupération des musiques:', error)
  }
  return musicList.value
}