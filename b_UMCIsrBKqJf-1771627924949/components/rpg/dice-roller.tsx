"use client"

import { useState } from "react"
import { Dices, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

interface RollEntry {
  id: number
  label: string
  result: number
  total: number
  timestamp: Date
}

interface DiceRollerProps {
  onRoll: (entry: RollEntry) => void
  rolls: RollEntry[]
}

const diceTypes = [
  { sides: 4, label: "D4" },
  { sides: 6, label: "D6" },
  { sides: 8, label: "D8" },
  { sides: 10, label: "D10" },
  { sides: 12, label: "D12" },
  { sides: 20, label: "D20" },
  { sides: 100, label: "D100" },
]

export function DiceRoller({ onRoll, rolls }: DiceRollerProps) {
  const [selectedDice, setSelectedDice] = useState(20)
  const [numDice, setNumDice] = useState(1)
  const [modifier, setModifier] = useState(0)
  const [lastRoll, setLastRoll] = useState<{
    results: number[]
    total: number
  } | null>(null)
  const [isRolling, setIsRolling] = useState(false)

  const rollDice = () => {
    setIsRolling(true)
    setTimeout(() => {
      const results: number[] = []
      for (let i = 0; i < numDice; i++) {
        results.push(Math.floor(Math.random() * selectedDice) + 1)
      }
      const sum = results.reduce((a, b) => a + b, 0)
      const total = sum + modifier

      setLastRoll({ results, total })
      setIsRolling(false)

      onRoll({
        id: Date.now(),
        label: `${numDice}d${selectedDice}${modifier !== 0 ? (modifier > 0 ? `+${modifier}` : modifier) : ""}`,
        result: sum,
        total,
        timestamp: new Date(),
      })
    }, 400)
  }

  return (
    <div className="rounded-xl border border-rpg-border bg-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <Dices className="h-5 w-5 text-rpg-orange" />
        <h3 className="text-lg font-bold text-foreground">Dice Roller</h3>
      </div>

      <div className="mb-4 grid grid-cols-4 gap-1.5 sm:grid-cols-7">
        {diceTypes.map((d) => (
          <button
            key={d.sides}
            onClick={() => setSelectedDice(d.sides)}
            className={cn(
              "rounded-lg border px-2 py-2 text-xs font-bold transition-all",
              selectedDice === d.sides
                ? "border-rpg-orange bg-rpg-orange/10 text-rpg-orange"
                : "border-rpg-border bg-rpg-surface-raised text-muted-foreground hover:border-rpg-orange/50 hover:text-foreground"
            )}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div className="mb-4 flex gap-3">
        <div className="flex-1">
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Number
          </label>
          <input
            type="number"
            min={1}
            max={10}
            value={numDice}
            onChange={(e) => setNumDice(Math.max(1, Math.min(10, Number(e.target.value))))}
            className="w-full rounded-md border border-rpg-border bg-rpg-surface-raised px-3 py-1.5 text-sm text-foreground focus:border-rpg-orange focus:outline-none"
          />
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Modifier
          </label>
          <input
            type="number"
            value={modifier}
            onChange={(e) => setModifier(Number(e.target.value))}
            className="w-full rounded-md border border-rpg-border bg-rpg-surface-raised px-3 py-1.5 text-sm text-foreground focus:border-rpg-orange focus:outline-none"
          />
        </div>
      </div>

      <div className="mb-2 text-center text-sm text-muted-foreground">
        {numDice}d{selectedDice}
        {modifier !== 0 && (modifier > 0 ? ` + ${modifier}` : ` - ${Math.abs(modifier)}`)}
      </div>

      <button
        onClick={rollDice}
        disabled={isRolling}
        className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg bg-rpg-orange py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-rpg-orange/90 disabled:opacity-60"
      >
        <Dices className={cn("h-4 w-4", isRolling && "animate-spin")} />
        {isRolling ? "Rolling..." : "Roll Dice"}
      </button>

      {lastRoll && (
        <div className="rounded-lg border border-rpg-border bg-rpg-surface-raised p-4 text-center">
          <div className="mb-1 flex flex-wrap items-center justify-center gap-2">
            {lastRoll.results.map((r, i) => (
              <span
                key={i}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-bold",
                  r === selectedDice
                    ? "border-rpg-green bg-rpg-green/10 text-rpg-green"
                    : r === 1
                      ? "border-rpg-hp bg-rpg-hp/10 text-rpg-hp"
                      : "border-rpg-border bg-rpg-surface text-foreground"
                )}
              >
                {r}
              </span>
            ))}
          </div>
          {modifier !== 0 && (
            <p className="mb-1 text-xs text-muted-foreground">
              Modifier: {modifier > 0 ? `+${modifier}` : modifier}
            </p>
          )}
          <p className="text-3xl font-bold text-rpg-orange">{lastRoll.total}</p>
        </div>
      )}

      {rolls.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Roll History
          </p>
          <div className="flex max-h-32 flex-col gap-1 overflow-y-auto">
            {rolls
              .slice(-6)
              .reverse()
              .map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between rounded-md bg-rpg-surface-raised px-3 py-1.5 text-xs"
                >
                  <span className="font-mono text-muted-foreground">
                    {r.label}
                  </span>
                  <span className="font-bold text-foreground">{r.total}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
