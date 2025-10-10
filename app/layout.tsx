import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Lineup Builder",
  description: "Build your football lineup",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
