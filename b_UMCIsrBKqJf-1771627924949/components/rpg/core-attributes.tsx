"use client"

import { useEffect, useRef } from "react"
import { Minus, Plus, Dumbbell, Crosshair, Brain, HeartPulse, Sparkles } from "lucide-react"

export interface Attributes {
  strength: number
  agility: number
  intellect: number
  vigor: number
  presence: number
}

interface CoreAttributesProps {
  attributes: Attributes
  pointsAvailable: number
  onAttributeChange: (attr: keyof Attributes, value: number) => void
}

const attrMeta: {
  key: keyof Attributes
  label: string
  sub: string
  icon: React.ElementType
  color: string
}[] = [
  { key: "strength", label: "STR", sub: "Power", icon: Dumbbell, color: "#ef4444" },
  { key: "agility", label: "AGI", sub: "Speed", icon: Crosshair, color: "#22c55e" },
  { key: "intellect", label: "INT", sub: "Logic", icon: Brain, color: "#a855f7" },
  { key: "vigor", label: "VIG", sub: "Stamina", icon: HeartPulse, color: "#22c55e" },
  { key: "presence", label: "PRE", sub: "Will", icon: Sparkles, color: "#a855f7" },
]

function drawRadarChart(
  canvas: HTMLCanvasElement,
  attributes: Attributes,
  animPhase: number
) {
  const ctx = canvas.getContext("2d")
  if (!ctx) return

  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  ctx.scale(dpr, dpr)

  const w = rect.width
  const h = rect.height
  const cx = w / 2
  const cy = h / 2
  const maxR = Math.min(w, h) / 2 - 24
  const gridMax = 5
  const absMax = 10

  const labels = ["STR", "AGI", "PRE", "VIG", "INT"]
  const values = [
    attributes.strength,
    attributes.agility,
    attributes.presence,
    attributes.vigor,
    attributes.intellect,
  ]
  const sides = 5
  const angleStep = (Math.PI * 2) / sides
  const startAngle = -Math.PI / 2

  ctx.clearRect(0, 0, w, h)

  for (let ring = 1; ring <= gridMax; ring++) {
    const r = (ring / gridMax) * maxR
    ctx.beginPath()
    for (let i = 0; i <= sides; i++) {
      const angle = startAngle + i * angleStep
      const x = cx + Math.cos(angle) * r
      const y = cy + Math.sin(angle) * r
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.strokeStyle = ring === gridMax ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)"
    ctx.lineWidth = ring === gridMax ? 1.5 : 1
    ctx.stroke()
  }

  for (let i = 0; i < sides; i++) {
    const angle = startAngle + i * angleStep
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(cx + Math.cos(angle) * maxR, cy + Math.sin(angle) * maxR)
    ctx.strokeStyle = "rgba(255,255,255,0.06)"
    ctx.lineWidth = 1
    ctx.stroke()
  }

  for (let ring = 1; ring <= gridMax; ring++) {
    const angle0 = startAngle
    const r = (ring / gridMax) * maxR
    const x = cx + Math.cos(angle0) * r
    const y = cy + Math.sin(angle0) * r
    ctx.fillStyle = "rgba(255,255,255,0.3)"
    ctx.font = "9px Geist, sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(String(ring * 2), x, y - 5)
  }

  const hasOverflow = values.some((v) => v > gridMax)

  if (hasOverflow) {
    ctx.beginPath()
    for (let i = 0; i <= sides; i++) {
      const idx = i % sides
      const angle = startAngle + idx * angleStep
      const v = Math.min(values[idx], absMax)
      const r = (v / gridMax) * maxR
      const x = cx + Math.cos(angle) * r
      const y = cy + Math.sin(angle) * r
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    const pulse = 0.4 + Math.sin(animPhase) * 0.15
    ctx.save()
    ctx.setLineDash([4, 4])
    ctx.strokeStyle = `rgba(234, 179, 8, ${pulse * 0.7})`
    ctx.lineWidth = 1.5
    ctx.stroke()
    ctx.restore()
  }

  const clampedValues = values.map((v) => Math.min(v, gridMax))
  ctx.beginPath()
  for (let i = 0; i <= sides; i++) {
    const idx = i % sides
    const angle = startAngle + idx * angleStep
    const r = (clampedValues[idx] / gridMax) * maxR
    const x = cx + Math.cos(angle) * r
    const y = cy + Math.sin(angle) * r
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.closePath()
  ctx.fillStyle = "rgba(232, 115, 42, 0.2)"
  ctx.fill()
  ctx.strokeStyle = "#e8732a"
  ctx.lineWidth = 2
  ctx.stroke()

  for (let i = 0; i < sides; i++) {
    const angle = startAngle + i * angleStep
    const isOver = values[i] > gridMax
    const displayVal = isOver ? values[i] : clampedValues[i]
    const r = (displayVal / gridMax) * maxR
    const x = cx + Math.cos(angle) * r
    const y = cy + Math.sin(angle) * r

    ctx.beginPath()
    ctx.arc(x, y, 3, 0, Math.PI * 2)
    ctx.fillStyle = isOver ? "#eab308" : "#e8732a"
    ctx.fill()
    ctx.strokeStyle = "#0b0d12"
    ctx.lineWidth = 1.5
    ctx.stroke()
  }

  for (let i = 0; i < sides; i++) {
    const angle = startAngle + i * angleStep
    const lx = cx + Math.cos(angle) * (maxR + 18)
    const ly = cy + Math.sin(angle) * (maxR + 18)
    ctx.fillStyle = values[i] > gridMax ? "#eab308" : "rgba(255,255,255,0.7)"
    ctx.font = "10px Geist, sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(labels[i], lx, ly)
  }
}

export function CoreAttributes({
  attributes,
  pointsAvailable,
  onAttributeChange,
}: CoreAttributesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const hasOverflow = Object.values(attributes).some((v) => v > 5)

  useEffect(() => {
    let raf: number
    const animate = () => {
      animRef.current += 0.03
      if (canvasRef.current) {
        drawRadarChart(canvasRef.current, attributes, animRef.current)
      }
      if (hasOverflow) {
        raf = requestAnimationFrame(animate)
      }
    }
    animate()
    const handleResize = () => {
      if (canvasRef.current) drawRadarChart(canvasRef.current, attributes, animRef.current)
    }
    window.addEventListener("resize", handleResize)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener("resize", handleResize)
    }
  }, [attributes, hasOverflow])

  return (
    <div className="rounded-lg border border-rpg-border bg-card px-4 py-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground">Attributes</h3>
        <span className="rounded-full border border-rpg-border bg-rpg-surface-raised px-2 py-0.5 text-[10px] font-medium text-foreground">
          {pointsAvailable} pts
        </span>
      </div>

      <div className="flex items-start gap-3">
        <div className="shrink-0">
          <canvas ref={canvasRef} className="h-40 w-40" />
        </div>

        <div className="flex flex-1 flex-col gap-1.5">
          {attrMeta.map(({ key, label, icon: Icon, color }) => (
            <div key={key} className="flex items-center gap-2">
              <div
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded"
                style={{ backgroundColor: `${color}20` }}
              >
                <Icon className="h-3 w-3" style={{ color }} />
              </div>
              <span className="w-8 text-[11px] font-semibold text-foreground">{label}</span>
              <div className="ml-auto flex items-center gap-1">
                <button
                  onClick={() => onAttributeChange(key, Math.max(0, attributes[key] - 1))}
                  className="flex h-5 w-5 items-center justify-center rounded border border-rpg-border bg-rpg-surface-raised text-muted-foreground transition-colors hover:bg-rpg-border hover:text-foreground"
                >
                  <Minus className="h-2.5 w-2.5" />
                </button>
                <span className="w-5 text-center text-xs font-bold text-foreground">
                  {attributes[key]}
                </span>
                <button
                  onClick={() => onAttributeChange(key, Math.min(10, attributes[key] + 1))}
                  disabled={pointsAvailable <= 0}
                  className="flex h-5 w-5 items-center justify-center rounded border border-rpg-border bg-rpg-surface-raised text-muted-foreground transition-colors hover:bg-rpg-border hover:text-foreground disabled:opacity-40"
                >
                  <Plus className="h-2.5 w-2.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
