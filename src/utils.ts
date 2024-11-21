import { ref } from 'vue'

const apiUrl = ref(import.meta.env.VITE_API_URL)

export const fetchSongs = async (type: string): Promise<Music[]> => {
  const musicList = ref<Music[]>([])
  try {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout')), 10000)
    })

    const fetchPromise = fetch(apiUrl.value + '/' + type + '/')
    const response = await Promise.race([fetchPromise, timeoutPromise])

    if (response instanceof Response) {
      musicList.value = await response.json()
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des musiques:', error)
  }
  return musicList.value
}

export const fetchSong = async (type: string, musicId: string): Promise<Music> => {
  const music = ref<Music>()
  try {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout')), 10000)
    })

    const fetchPromise = fetch(apiUrl.value + '/' + type + '/' + musicId)
    const response = await Promise.race([fetchPromise, timeoutPromise])

    if (response instanceof Response) {
      music.value = await response.json()
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des musiques:', error)
    throw error
  }
  return music.value as Music
}

export const fetchVocals = async (beatId: string): Promise<Vocal[]> => {
  const vocals = ref<Vocal[]>([])
  try {
    const response = await fetch(apiUrl.value + '/vocal/beat/' + beatId)
    if (response instanceof Response) {
      vocals.value = await response.json()
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des vocaux:', error)
  }
  return vocals.value
}
