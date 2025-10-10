"use client"

import { useDroppable } from "@dnd-kit/core"
import { Player, Formation } from "@/app/types/types"
import "@/app/styles/pitch.css"

interface PitchProps {
  players: Player[]
  formation: Formation
  onDropPlayer: (playerId: string, position: string) => void
}

const Pitch: React.FC<PitchProps> = ({ players, formation, onDropPlayer }) => {
  return (
    <div className="pitch">
      {/* Pitch markings */}
      <div className="pitch-markings">
        <div className="pitch-center-circle"></div>
        <div className="pitch-halfway-line"></div>
      </div>
      {/* Player positions */}
      {formation.positions.map((pos, index) => (
        <DropZone
          key={index}
          role={pos.role}
          x={pos.x}
          y={pos.y}
          player={players.find((p) => p.position === pos.role)}
          onDrop={(playerId) => onDropPlayer(playerId, pos.role)}
        />
      ))}
    </div>
  )
}

interface DropZoneProps {
  role: string
  x: number
  y: number
  player?: Player
  onDrop: (playerId: string) => void
}

const DropZone: React.FC<DropZoneProps> = ({ role, x, y, player, onDrop }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: role, // Unique ID for the droppable (uses position role like 'GK')
  })

  // Note: Actual drop logic will be handled in DndContext's onDropEnd (see page.tsx)
  // Here, we just set up the droppable ref and hover state

  return (
    <div
      ref={setNodeRef}
      className={`drop-zone ${player ? "filled" : ""} ${
        isOver ? "is-over" : ""
      }`}
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      {player ? `${player.name} #${player.number}` : role}
    </div>
  )
}

export default Pitch
