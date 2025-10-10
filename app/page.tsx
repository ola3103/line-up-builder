"use client"

import { useState } from "react"
import { DndContext } from "@dnd-kit/core"
import Pitch from "@/app/components/Pitch"
import { Player, Formation } from "@/app/types/types"
import { formations } from "@/app/data/formation"
import { defaultPlayers } from "./data/players"
import "@/app/styles/home.css"

export default function Home() {
  const [selectedFormation, setSelectedFormation] = useState<Formation>(
    formations[0]
  )
  const [players, setPlayers] = useState<Player[]>(defaultPlayers)

  const handleDropPlayer = (playerId: string, position: string) => {
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === playerId
          ? { ...p, position }
          : p.position === position
          ? { ...p, position: null }
          : p
      )
    )
  }

  return (
    <DndContext>
      <div className="container">
        <h1>Lineup Builder</h1>
        <select
          className="formation-selector"
          onChange={(e) => {
            const newFormation = formations.find(
              (f) => f.name === e.target.value
            )!
            setSelectedFormation(newFormation)
            setPlayers((prev) => prev.map((p) => ({ ...p, position: null })))
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
              onDropPlayer={handleDropPlayer}
            />
          </div>
        </div>
      </div>
    </DndContext>
  )
}
