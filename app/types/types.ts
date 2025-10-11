export interface Player {
  id: string
  name: string
  number: number
  position: string | null
  x?: number // Percentage (0-100)
  y?: number // Percentage (0-100)
}

export interface Formation {
  name: string
  positions: { x: number; y: number; role: string }[]
}
