export interface Player {
  id: string
  name: string
  number: number | null
  position: string | null // e.g., 'ST', 'CM', 'LB'
}

export interface Formation {
  name: string // e.g., '4-4-2'
  positions: { x: number; y: number; role: string }[] // Coordinates and role
}
