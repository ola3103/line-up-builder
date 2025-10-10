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
      <div className="pitch-markings">
        <div className="pitch-center-circle"></div>
        <div className="pitch-halfway-line"></div>
        <div className="penalty-box main-team">
          <div className="goal-area"></div>
          <div className="penalty-spot"></div>
          <div className="penalty-arc"></div>
        </div>
        <div className="penalty-box opposition">
          <div className="goal-area"></div>
          <div className="penalty-spot"></div>
          <div className="penalty-arc"></div>
        </div>
        <div className="corner-arc top-left"></div>
        <div className="corner-arc top-right"></div>
        <div className="corner-arc bottom-left"></div>
        <div className="corner-arc bottom-right"></div>
      </div>
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
    id: role,
  })

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
