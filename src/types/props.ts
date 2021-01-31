export interface SightseeingList {
  [k: string]: SightseeingEntry
}

export interface SightseeingEntry {
  name: string
  description: string
  startdate: string
  enddate: string
  locations?: {
    id: string
    hint: string
    player: {
      x: number
      y: number
    }
    avatarPosition: [number, number, number]
  }[]
}
