"use client"

import { Shield } from "lucide-react"
import type { Attributes } from "./core-attributes"

interface CombatDefensesProps {
  attributes: Attributes
}

export function CombatDefenses({ attributes }: CombatDefensesProps) {
  const passiveDefense = 10 + attributes.agility + 4
  const dodgeRating = attributes.agility + 4

  return (
    <div className="rounded-lg border border-rpg-border bg-card px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-foreground">Combat Defenses</h3>
        <button className="flex items-center gap-1 text-[10px] font-medium text-rpg-orange transition-colors hover:text-rpg-orange/80">
          <Shield className="h-3 w-3" />
          Armor
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center justify-between rounded-md border border-rpg-border bg-rpg-surface-raised px-3 py-2">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Defense</p>
            <p className="text-[8px] text-muted-foreground">{"Base 10 + AGI + Armor"}</p>
          </div>
          <span className="text-xl font-bold text-foreground">{passiveDefense}</span>
        </div>
        <div className="flex items-center justify-between rounded-md border border-rpg-border bg-rpg-surface-raised px-3 py-2">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Dodge</p>
            <p className="text-[8px] text-muted-foreground">AGI + Reflex</p>
          </div>
          <span className="text-xl font-bold text-rpg-orange">{dodgeRating}</span>
        </div>
      </div>
    </div>
  )
}
