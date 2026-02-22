"use client"

import { useState, useCallback } from "react"
import { StatCards } from "@/components/rpg/stat-cards"
import { CoreAttributes, type Attributes } from "@/components/rpg/core-attributes"
import { CombatDefenses } from "@/components/rpg/combat-defenses"
import { SkillsTable } from "@/components/rpg/skills-table"
import { DiceRoller } from "@/components/rpg/dice-roller"
import { Inventory } from "@/components/rpg/inventory"
import { Swords, Backpack, Flame } from "lucide-react"
import { cn } from "@/lib/utils"

interface RollEntry {
  id: number
  label: string
  result: number
  total: number
  timestamp: Date
}

type BottomTab = "inventory" | "rituals" | "combat"

export default function CharacterSheetPage() {
  const [rolls, setRolls] = useState<RollEntry[]>([])
  const [activeTab, setActiveTab] = useState<BottomTab>("inventory")

  const [stats, setStats] = useState({
    hp: { current: 42, max: 58, temp: 0 },
    effort: { current: 8, max: 12 },
    sanity: { current: 65, max: 80, threshold: 20, goingInsane: false },
  })

  const [attributes, setAttributes] = useState<Attributes>({
    strength: 5,
    agility: 7,
    intellect: 8,
    vigor: 6,
    presence: 4,
  })

  const pointsAvailable = 12

  const handleRoll = useCallback((entry: RollEntry) => {
    setRolls((prev) => [...prev, entry])
  }, [])

  const handleSkillRollCheck = useCallback(
    (skillName: string, bonus: number) => {
      const roll = Math.floor(Math.random() * 20) + 1
      const total = roll + bonus
      handleRoll({
        id: Date.now(),
        label: `${skillName} (1d20+${bonus})`,
        result: roll,
        total,
        timestamp: new Date(),
      })
    },
    [handleRoll]
  )

  const handleAttributeChange = useCallback(
    (attr: keyof Attributes, value: number) => {
      setAttributes((prev) => ({ ...prev, [attr]: value }))
    },
    []
  )

  const tabs: { key: BottomTab; label: string; icon: React.ElementType }[] = [
    { key: "inventory", label: "Inventario", icon: Backpack },
    { key: "rituals", label: "Rituais", icon: Flame },
    { key: "combat", label: "Combate", icon: Swords },
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="flex flex-1 flex-col gap-3 p-3 lg:flex-row">
        <div className="flex flex-1 flex-col gap-3 min-h-0 lg:w-[62%] lg:flex-none">
          <div className="flex-1 min-h-0 overflow-y-auto rounded-xl border border-rpg-border bg-card">
            <SkillsTable onRollCheck={handleSkillRollCheck} />
          </div>

          <div className="flex flex-col min-h-0 flex-1 rounded-xl border border-rpg-border bg-card">
            <div className="flex shrink-0 border-b border-rpg-border">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors",
                    activeTab === tab.key
                      ? "border-b-2 border-rpg-orange text-rpg-orange"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto">
              {activeTab === "inventory" && <Inventory />}
              {activeTab === "rituals" && (
                <div className="flex h-full items-center justify-center p-6">
                  <div className="text-center">
                    <Flame className="mx-auto mb-3 h-10 w-10 text-rpg-orange/40" />
                    <p className="text-sm font-semibold text-foreground">Rituais</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Seus rituais e magias aparecerao aqui.
                    </p>
                  </div>
                </div>
              )}
              {activeTab === "combat" && (
                <div className="p-4">
                  <DiceRoller onRoll={handleRoll} rolls={rolls} />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 min-h-0 overflow-y-auto lg:w-[38%] lg:flex-none">
          <CoreAttributes
            attributes={attributes}
            pointsAvailable={pointsAvailable}
            onAttributeChange={handleAttributeChange}
          />

          <CombatDefenses attributes={attributes} />

          <StatCards stats={stats} onStatsChange={setStats} layout="vertical" />
        </div>
      </div>
    </div>
  )
}
