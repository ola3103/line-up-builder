"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { closestCenter, DragEndEvent } from "@dnd-kit/core"
import Pitch from "@/app/components/Pitch"
import { Player, Formation } from "@/app/types/types"
import { formations } from "@/app/data/formation"
import { defaultPlayers } from "./data/players"
import "@/app/styles/home.css"

// Dynamically import DndContext with SSR disabled
const DndContext = dynamic(
  () => import("@dnd-kit/core").then((mod) => mod.DndContext),
  { ssr: false }
)

export default function Home() {
  const [selectedFormation, setSelectedFormation] = useState<Formation>(
    formations[0]
  )
  const [players, setPlayers] = useState<Player[]>(defaultPlayers)

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
            />
          </div>
        </div>
      </div>
    </DndContext>
  )
}
