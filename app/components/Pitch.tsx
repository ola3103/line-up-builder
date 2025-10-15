"use client"

import { useDraggable } from "@dnd-kit/core"
import { Player, Formation } from "@/app/types/types"
import "@/app/styles/pitch.css"

interface PitchProps {
  players: Player[]
  formation: Formation
  onUpdatePlayerPosition: (playerId: string, x: number, y: number) => void
  onJerseyClick: (player: Player) => void
}

const Pitch: React.FC<PitchProps> = ({
  players,
  formation,
  onUpdatePlayerPosition,
  onJerseyClick,
}) => {
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
      {players
        .filter(
          (player) =>
            player.position && player.x !== undefined && player.y !== undefined
        )
        .map((player) => (
          <DraggableJersey
            key={player.id}
            player={player}
            onUpdatePosition={onUpdatePlayerPosition}
            onJerseyClick={onJerseyClick}
          />
        ))}
    </div>
  )
}

interface DraggableJerseyProps {
  player: Player
  onUpdatePosition: (playerId: string, x: number, y: number) => void
  onJerseyClick: (player: Player) => void
}

const DraggableJersey: React.FC<DraggableJerseyProps> = ({
  player,
  onUpdatePosition,
  onJerseyClick,
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: player.id,
    data: { playerId: player.id },
  })

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
        left: `${player.x}%`,
        top: `${player.y}%`,
      }
    : { left: `${player.x}%`, top: `${player.y}%` }

  return (
    <div
      ref={setNodeRef}
      className="jersey-container"
      style={style}
      {...listeners}
      {...attributes}
    >
      <div className="jersey-click-area" onClick={() => onJerseyClick(player)}>
        <svg
          className="jersey"
          width="60"
          height="50"
          viewBox="0 0 556.56 642.95"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          // onClick={() => onJerseyClick(player)}
          style={{ pointerEvents: "auto" }}
        >
          {/* Sleeves - White */}
          <path
            d="M78.76,75.31c-33.59,36.03-34.97,158.08-49.93,198.21-2.43,4.85-2.32,11.9,4.65,12.95l88.41,15.45c12.21,1.98,12.65-3.08,13.13-13.17l1.48-30.46c0-118.55-57.73-182.99-57.73-182.99Z"
            fill="#ffffff"
            stroke="#fff"
            strokeWidth="4"
          />
          <path
            d="M477.99,75.31c33.59,36.03,34.97,158.08,49.93,198.21,2.43,4.85,2.32,11.9-4.65,12.95l-88.41,15.45c-12.21,1.98-12.65-3.08-13.13-13.17l-1.48-30.46c0-118.55,57.73-182.99,57.73-182.99Z"
            fill="#ffffff"
            stroke="#fff"
            strokeWidth="4"
          />
          {/* Main Body - Black */}
          <path
            d="M420.26,258.3c4.76-72.04,23.32-121.95,38.13-151.24,10.81-21.46,19.6-31.75,19.6-31.75-26.93-28.83-76.46-47.36-108.7-56.99,0,0-30.33,20.08-90.92,20.08s-90.92-20.08-90.92-20.08c-32.24,9.62-81.77,28.16-108.7,56.99,0,0,8.8,10.29,19.6,31.75,14.81,29.29,33.37,79.2,38.13,151.24,0,0,.15,1.5.15,2.25v25.64l-6.64,225.59c-.26,8.85,5.94,16.57,14.64,18.23,0,0,71.45,20.37,133.73,20.37s133.73-20.37,133.73-20.37c8.69-1.66,14.9-9.38,14.64-18.23l-6.64-225.59v-25.64c0-.75.15-2.25.15-2.25Z"
            fill="#000000"
            stroke="#fff"
            strokeWidth="4"
          />
          {/* Cuffs - Black */}
          <path
            d="M28.82,273.51c-2.43,4.85-2.32,11.9,4.65,12.95l88.41,15.45c11.74,1.91,12.59-2.71,13.07-12.03l-105.28-18.8c-.28.84-.56,1.65-.85,2.43Z"
            fill="#000000"
            stroke="#fff"
            strokeWidth="4"
          />
          <path
            d="M527.9,273.51c2.43,4.85,2.32,11.9-4.65,12.95l-88.41,15.45c-11.74,1.91-12.59-2.71-13.07-12.03l105.28-18.8c.28.84.56,1.65.85,2.43Z"
            fill="#000000"
            stroke="#fff"
            strokeWidth="4"
          />
          {/* Collar - White */}
          <path
            d="M355.29.42c-42.04,9.92-76.91,9.54-76.91,9.54,0,0-31.4.75-77.99-9.75-2.87-.73-5.73.44-6.85,3.04l-6.91,15.27s30.52,19.88,91.76,19.88,91.6-19.88,91.6-19.88l-6.72-14.84c-1.07-2.86-3.8-4.46-7.97-3.27Z"
            fill="#ffffff"
            stroke="#fff"
            strokeWidth="4"
          />
        </svg>
      </div>
      <h3 className="jersey-number">{player.number}</h3>
      <div className="jersey-name">{player.name}</div>
    </div>
  )
}

export default Pitch
