"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { closestCenter, DragEndEvent } from "@dnd-kit/core"
import Pitch from "@/app/components/Pitch"
import { Player, Formation } from "@/app/types/types"
import { formations } from "@/app/data/formation"
import { defaultPlayers } from "./data/players"
import "@/app/styles/home.css"

const DndContext = dynamic(
  () => import("@dnd-kit/core").then((mod) => mod.DndContext),
  { ssr: false }
)

export default function Home() {
  const [selectedFormation, setSelectedFormation] = useState<Formation>(
    formations[0]
  )
  const [players, setPlayers] = useState<Player[]>(defaultPlayers)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)

  const handleUpdatePlayerPosition = (
    playerId: string,
    x: number,
    y: number
  ) => {
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === playerId
          ? {
              ...p,
              x: Math.max(0, Math.min(100, x)),
              y: Math.max(0, Math.min(100, y)),
            }
          : p
      )
    )
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event
    if (active.data.current?.playerId) {
      const playerId = active.data.current.playerId as string
      const player = players.find((p) => p.id === playerId)
      if (player && player.x !== undefined && player.y !== undefined) {
        const pitch = document.querySelector(".pitch")
        if (pitch) {
          const { width, height } = pitch.getBoundingClientRect()
          const newX = player.x + (delta.x / width) * 100
          const newY = player.y + (delta.y / height) * 100
          handleUpdatePlayerPosition(playerId, newX, newY)
        }
      }
    }
  }

  const handleJerseyClick = (player: Player) => {
    console.log("Jersey clicked:", player) // Debug log
    setSelectedPlayer(player)
    setIsModalOpen(true)
  }

  const handleSavePlayer = (updatedPlayer: Player) => {
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === updatedPlayer.id
          ? { ...p, name: updatedPlayer.name, number: updatedPlayer.number }
          : p
      )
    )
    setIsModalOpen(false)
    setSelectedPlayer(null)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setSelectedPlayer(null)
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="container">
        <h1>Lineup Builder</h1>
        <select
          className="formation-selector"
          onChange={(e) => {
            const newFormation = formations.find(
              (f) => f.name === e.target.value
            )!
            setSelectedFormation(newFormation)
            setPlayers((prev) =>
              prev.map((p) => {
                const pos = newFormation.positions.find(
                  (pos) => pos.role === p.position
                )
                return pos
                  ? { ...p, x: pos.x, y: pos.y }
                  : { ...p, position: null, x: undefined, y: undefined }
              })
            )
          }}
        >
          {formations.map((f) => (
            <option key={f.name} value={f.name}>
              {f.name}
            </option>
          ))}
        </select>
        <div className="main-content">
          <div className="pitch-container">
            <Pitch
              players={players}
              formation={selectedFormation}
              onUpdatePlayerPosition={handleUpdatePlayerPosition}
              onJerseyClick={handleJerseyClick}
            />
          </div>
        </div>
        {isModalOpen && selectedPlayer && (
          <PlayerModal
            player={selectedPlayer}
            onSave={handleSavePlayer}
            onCancel={handleCancel}
          />
        )}
      </div>
    </DndContext>
  )
}

interface PlayerModalProps {
  player: Player
  onSave: (player: Player) => void
  onCancel: () => void
}

const PlayerModal: React.FC<PlayerModalProps> = ({
  player,
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState(player.name)
  const [number, setNumber] = useState(player.number)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ ...player, name, number })
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Player</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="number">Number:</label>
            <input
              type="number"
              id="number"
              value={number}
              onChange={(e) => setNumber(Number(e.target.value))}
              min="1"
              max="99"
              required
            />
          </div>
          <div className="modal-buttons">
            <button type="submit">Save</button>
            <button type="button" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
