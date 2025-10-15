import { Formation } from "../types/types"

export const formations: Formation[] = [
  {
    name: "4-4-2",
    positions: [
      { role: "GK", x: 50, y: 95 },
      { role: "RB", x: 75, y: 80 },
      { role: "CB", x: 60, y: 80 },
      { role: "CB", x: 40, y: 80 },
      { role: "LB", x: 25, y: 80 },
      { role: "RM", x: 80, y: 50 },
      { role: "CM", x: 60, y: 50 },
      { role: "CM", x: 40, y: 50 },
      { role: "LM", x: 20, y: 50 },
      { role: "ST", x: 60, y: 20 },
      { role: "ST", x: 40, y: 20 },
    ],
  },
  // Add more formations if needed
]
