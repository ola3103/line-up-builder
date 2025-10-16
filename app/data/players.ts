import { Player } from "../types/types"
import { formations } from "./formation"

export const defaultPlayers: Player[] = formations[0].positions.map(
  (pos, index) => ({
    id: `player-${index + 1}`,
    name: `Player ${index + 1}`,
    number: index + 1,
    position: pos.role,
    x: pos.x,
    y: pos.y,
  })
)
