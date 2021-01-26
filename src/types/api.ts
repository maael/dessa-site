export interface ApiMap {
  id: number
  name: string
  min_level: number
  max_level: number
  default_floor: number
  floors: number[]
  region_id: number
  region_name: string
  continent_id: number
  continent_name: string
  map_rect: [[number, number], [number, number]]
  continent_rect: [[number, number], [number, number]]
}

export interface ApiSpec {
  id: number
  name: string
  profession: string
  elite: boolean
  minor_traits: [number?, number?, number?]
  major_traits: [number?, number?, number?, number?, number?, number?, number?, number?, number?]
  icon: string
  background: string
}
