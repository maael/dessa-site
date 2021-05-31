export interface User {
  _id: string
  nickname: string
  apiKey: string
  createdAt: string
  updatedAt: string
}

export interface SightseeingChallenge {
  _id: string
  name: string
  description: string
  media: string
  difficulty: number
  createdBy: User | null
  createdAt: string
  updatedAt: string
  likes: number
  likesByHashedIp: {
    [k: string]: number
  }
  items: SightseeingEntry[]
}

export interface SightseeingEntry {
  _id: string
  hint: {
    text: string
    media: string
  }
  avatar: [number, number, number]
  player: {
    x: number
    y: number
  }
  createdAt: string
  updatedAt: string
}
