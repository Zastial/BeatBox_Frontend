interface Music {
  id: string
  title: string
  artist: string
  filename: string
  img_path: string
}

interface Beat {
  id: string
  title: string
  artist: string
  filename: string
  img_path: string
}

interface Vocal {
  id: string
  title: string
  artist: string
  filename: string
  beat_id: string
}
