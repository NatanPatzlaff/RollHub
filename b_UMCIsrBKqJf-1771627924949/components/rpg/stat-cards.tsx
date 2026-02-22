"use client"

import { Heart, Zap, Brain, RotateCcw } from "lucide-react"

interface StatCardData {
  hp: { current: number; max: number; temp: number }
  effort: { current: number; max: number }
  sanity: { current: number; max: number; threshold: number; goingInsane: boolean }
}

interface StatCardsProps {
  stats: StatCardData
  onStatsChange: (stats: StatCardData) => void
  layout?: "horizontal" | "vertical"
}

export function StatCards({ stats, onStatsChange, layout = "horizontal" }: StatCardsProps) {
  const hpPercent = (stats.hp.current / stats.hp.max) * 100
  const effortPercent = (stats.effort.current / stats.effort.max) * 100
  const sanityPercent = (stats.sanity.current / stats.sanity.max) * 100

  const hpStatus =
    hpPercent > 75
      ? "Healthy"
      : hpPercent > 50
        ? "Wounded"
        : hpPercent > 25
          ? "Bloodied"
          : "Critical"

  const hpStatusColor =
    hpPercent > 75
      ? "bg-rpg-green/20 text-rpg-green"
      : hpPercent > 50
        ? "bg-rpg-effort/20 text-rpg-effort"
        : hpPercent > 25
          ? "bg-rpg-orange/20 text-rpg-orange"
          : "bg-rpg-hp/20 text-rpg-hp"

  return (
    <div className={layout === "vertical" ? "flex flex-col gap-2" : "grid grid-cols-1 gap-4 md:grid-cols-3"}>
      <div className="rounded-lg border border-rpg-border bg-card px-4 py-3">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <Heart className="h-3.5 w-3.5 text-rpg-hp" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-rpg-hp">HP</span>
          </div>
          <span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${hpStatusColor}`}>
            {hpStatus}
          </span>
        </div>
        <div className="flex items-center gap-3 mb-1.5">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-foreground">{stats.hp.current}</span>
            <span className="text-[10px] text-muted-foreground">/ {stats.hp.max}</span>
          </div>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-rpg-surface-raised">
            <div
              className="h-full rounded-full bg-rpg-hp transition-all duration-300"
              style={{ width: `${Math.min(hpPercent, 100)}%` }}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          <input
            type="number"
            value={stats.hp.current}
            onChange={(e) =>
              onStatsChange({ ...stats, hp: { ...stats.hp, current: Number(e.target.value) } })
            }
            className="w-full rounded border border-rpg-border bg-rpg-surface-raised px-2 py-1 text-[11px] text-foreground focus:border-rpg-orange focus:outline-none"
            aria-label="Current HP"
          />
          <input
            type="number"
            value={stats.hp.max}
            onChange={(e) =>
              onStatsChange({ ...stats, hp: { ...stats.hp, max: Number(e.target.value) } })
            }
            className="w-full rounded border border-rpg-border bg-rpg-surface-raised px-2 py-1 text-[11px] text-foreground focus:border-rpg-orange focus:outline-none"
            aria-label="Max HP"
          />
          <input
            type="number"
            value={stats.hp.temp}
            onChange={(e) =>
              onStatsChange({ ...stats, hp: { ...stats.hp, temp: Number(e.target.value) } })
            }
            className="w-full rounded border border-rpg-border bg-rpg-surface-raised px-2 py-1 text-[11px] text-foreground focus:border-rpg-orange focus:outline-none"
            aria-label="Temp HP"
          />
        </div>
      </div>

      <div className="rounded-lg border border-rpg-border bg-card px-4 py-3">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-rpg-effort" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-rpg-effort">PE</span>
          </div>
          <button
            onClick={() =>
              onStatsChange({ ...stats, effort: { ...stats.effort, current: stats.effort.max } })
            }
            className="flex items-center gap-1 text-[10px] text-muted-foreground transition-colors hover:text-foreground"
          >
            <RotateCcw className="h-2.5 w-2.5" />
            Reset
          </button>
        </div>
        <div className="flex items-center gap-3 mb-1.5">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-foreground">{stats.effort.current}</span>
            <span className="text-[10px] text-muted-foreground">/ {stats.effort.max}</span>
          </div>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-rpg-surface-raised">
            <div
              className="h-full rounded-full bg-rpg-effort transition-all duration-300"
              style={{ width: `${Math.min(effortPercent, 100)}%` }}
            />
          </div>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() =>
              onStatsChange({
                ...stats,
                effort: { ...stats.effort, current: Math.max(0, stats.effort.current - 1) },
              })
            }
            className="flex-1 rounded border border-rpg-border bg-rpg-surface-raised px-2 py-1 text-[10px] font-medium text-foreground transition-colors hover:bg-rpg-border"
          >
            -1 Skill
          </button>
          <button
            onClick={() =>
              onStatsChange({
                ...stats,
                effort: { ...stats.effort, current: Math.max(0, stats.effort.current - 3) },
              })
            }
            className="flex-1 rounded border border-rpg-border bg-rpg-surface-raised px-2 py-1 text-[10px] font-medium text-foreground transition-colors hover:bg-rpg-border"
          >
            -3 Ritual
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-rpg-border bg-card px-4 py-3">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <Brain className="h-3.5 w-3.5 text-rpg-sanity" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-rpg-sanity">Sanity</span>
          </div>
          <label className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <input
              type="checkbox"
              checked={stats.sanity.goingInsane}
              onChange={(e) =>
                onStatsChange({ ...stats, sanity: { ...stats.sanity, goingInsane: e.target.checked } })
              }
              className="h-2.5 w-2.5 rounded border-rpg-border accent-rpg-sanity"
            />
            Insane
          </label>
        </div>
        <div className="flex items-center gap-3 mb-1.5">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-foreground">{stats.sanity.current}</span>
            <span className="text-[10px] text-muted-foreground">/ {stats.sanity.max}</span>
          </div>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-rpg-surface-raised">
            <div
              className="h-full rounded-full bg-rpg-sanity transition-all duration-300"
              style={{ width: `${Math.min(sanityPercent, 100)}%` }}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <input
            type="number"
            value={stats.sanity.current}
            onChange={(e) =>
              onStatsChange({ ...stats, sanity: { ...stats.sanity, current: Number(e.target.value) } })
            }
            className="w-full rounded border border-rpg-border bg-rpg-surface-raised px-2 py-1 text-[11px] text-foreground focus:border-rpg-sanity focus:outline-none"
            aria-label="Current Sanity"
          />
          <input
            type="number"
            value={stats.sanity.threshold}
            onChange={(e) =>
              onStatsChange({ ...stats, sanity: { ...stats.sanity, threshold: Number(e.target.value) } })
            }
            className="w-full rounded border border-rpg-border bg-rpg-surface-raised px-2 py-1 text-[11px] text-foreground focus:border-rpg-sanity focus:outline-none"
            aria-label="Sanity Threshold"
          />
        </div>
      </div>
    </div>
  )
}
