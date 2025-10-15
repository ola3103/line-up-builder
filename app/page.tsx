"use client"

import { useState } from "react"
import { DndContext, DragEndEvent, DragStartEvent } from "@dnd-kit/core"
import { restrictToParentElement } from "@dnd-kit/modifiers"
import dynamic from "next/dynamic"
import { Player, Formation } from "@/app/types/types"
import { formations } from "@/app/data/formation"
import { defaultPlayers } from "./data/players"
import "@/app/styles/home.css"

// Dynamically import Pitch with SSR disabled
const Pitch = dynamic(() => import("@/app/components/Pitch"), { ssr: false })

export default function Home() {
  const [selectedFormation, setSelectedFormation] = useState<Formation>(
    formations[0]
  )
  const [players, setPlayers] = useState<Player[]>(defaultPlayers)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleDragStart = (e: DragStartEvent) => {
    setIsDragging(true)
    console.log("Drag started:", { id: e.active.id })
  }

  const handleDragEnd = (e: DragEndEvent) => {
    setIsDragging(false)
    const playerId = e.active.id as string
    const player = players.find((p) => p.id === playerId)
    if (!player || player.x === undefined || player.y === undefined) return

    const distance = Math.sqrt(e.delta.x ** 2 + e.delta.y ** 2)
    console.log("Drag ended:", {
      id: playerId,
      x: e.delta.x,
      y: e.delta.y,
      distance,
    })

    if (distance < 5) {
      // Short drag = click
      setSelectedPlayer(player)
      setIsModalOpen(true)
    } else {
      // Long drag = position update
      const pitch = document.querySelector(".pitch")
      if (pitch) {
        const { width, height } = pitch.getBoundingClientRect()
        const newX = player.x + (e.delta.x / width) * 100
        const newY = player.y + (e.delta.y / height) * 100
        setPlayers((prev) =>
          prev.map((p) =>
            p.id === playerId
              ? {
                  ...p,
                  x: Math.max(0, Math.min(100, newX)),
                  y: Math.max(0, Math.min(100, newY)),
                }
              : p
          )
        )
      }
    }
  }

  const handleJerseyClick = (player: Player) => {
    if (!isDragging) {
      console.log("Jersey clicked:", player)
      setSelectedPlayer(player)
      setIsModalOpen(true)
    }
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
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToParentElement]}
    >
      <div className="container">
        <h1>Lineup Builder</h1>
        <div className="controls">
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
                  return pos ? { ...p, x: pos.x, y: pos.y } : p
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
        </div>
        <div className="main-content">
          <div className="pitch-container">
            <Pitch
              players={players}
              formation={selectedFormation}
              onUpdatePlayerPosition={(playerId, x, y) =>
                setPlayers((prev) =>
                  prev.map((p) => (p.id === playerId ? { ...p, x, y } : p))
                )
              }
              onJerseyClick={handleJerseyClick}
            />
          </div>
        </div>
        {isModalOpen && selectedPlayer && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Edit Player</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  handleSavePlayer({
                    ...selectedPlayer,
                    name: formData.get("name") as string,
                    number: Number(formData.get("number")),
                  })
                }}
              >
                <div className="form-group">
                  <label htmlFor="name">Name:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    defaultValue={selectedPlayer.name}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="number">Number:</label>
                  <input
                    type="number"
                    id="number"
                    name="number"
                    defaultValue={selectedPlayer.number}
                    min="1"
                    max="99"
                    required
                  />
                </div>
                <div className="modal-buttons">
                  <button type="submit">Save</button>
                  <button type="button" onClick={handleCancel}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DndContext>
  )
}
