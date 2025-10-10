import { Player } from "../types/types"

export const defaultPlayers: Player[] = Array.from({ length: 11 }, (_, i) => ({
  id: `player-${i + 1}`,
  name: `Player ${i + 1}`,
  number: i + 1,
  position: null,
}))
