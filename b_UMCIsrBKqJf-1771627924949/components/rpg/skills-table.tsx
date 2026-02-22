"use client"

import { useState } from "react"
import {
  Dices,
  Filter,
  Plus,
  ChevronLeft,
  ChevronRight,
  Swords,
  Eye,
  Crosshair,
  Sparkles,
  Dumbbell,
  Brain,
  HeartPulse,
} from "lucide-react"

interface Skill {
  id: number
  name: string
  description: string
  attribute: string
  trainingLevel: string
  bonus: number
  icon: React.ElementType
}

const allSkills: Skill[] = [
  { id: 1, name: "Athletics", description: "Physical prowess", attribute: "Strength", trainingLevel: "Trained", bonus: 4, icon: Dumbbell },
  { id: 2, name: "Occultism", description: "Forbidden knowledge", attribute: "Intellect", trainingLevel: "Veteran", bonus: 8, icon: Eye },
  { id: 3, name: "Marksmanship", description: "Ranged combat", attribute: "Agility", trainingLevel: "Expert", bonus: 12, icon: Crosshair },
  { id: 4, name: "Persuasion", description: "Social manipulation", attribute: "Presence", trainingLevel: "Untrained", bonus: 0, icon: Sparkles },
  { id: 5, name: "Stealth", description: "Moving unseen", attribute: "Agility", trainingLevel: "Trained", bonus: 4, icon: Eye },
  { id: 6, name: "Medicine", description: "Healing arts", attribute: "Intellect", trainingLevel: "Expert", bonus: 10, icon: HeartPulse },
  { id: 7, name: "Intimidation", description: "Force of will", attribute: "Presence", trainingLevel: "Trained", bonus: 3, icon: Swords },
  { id: 8, name: "Survival", description: "Wilderness lore", attribute: "Vigor", trainingLevel: "Veteran", bonus: 7, icon: HeartPulse },
  { id: 9, name: "Hacking", description: "Digital intrusion", attribute: "Intellect", trainingLevel: "Expert", bonus: 11, icon: Brain },
  { id: 10, name: "Melee Combat", description: "Close quarters", attribute: "Strength", trainingLevel: "Veteran", bonus: 9, icon: Swords },
  { id: 11, name: "Acrobatics", description: "Agile maneuvers", attribute: "Agility", trainingLevel: "Trained", bonus: 5, icon: Dumbbell },
  { id: 12, name: "Deception", description: "Art of lies", attribute: "Presence", trainingLevel: "Expert", bonus: 8, icon: Eye },
]

interface SkillsTableProps {
  onRollCheck: (skillName: string, bonus: number) => void
}

const PAGE_SIZE = 4

export function SkillsTable({ onRollCheck }: SkillsTableProps) {
  const [page, setPage] = useState(0)
  const [skills, setSkills] = useState(allSkills)
  const totalPages = Math.ceil(skills.length / PAGE_SIZE)
  const pageSkills = skills.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const trainingLevels = ["Untrained", "Trained", "Veteran", "Expert"]

  const bonusColor = (b: number) => {
    if (b >= 10) return "text-rpg-green"
    if (b >= 5) return "text-rpg-effort"
    if (b > 0) return "text-rpg-orange"
    return "text-muted-foreground"
  }

  return (
    <div className="p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-bold text-foreground">
          Skills & Proficiencies
        </h3>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 rounded-lg border border-rpg-border bg-rpg-surface-raised px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-rpg-border">
            <Filter className="h-3.5 w-3.5 text-rpg-orange" />
            All Categories
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-rpg-border bg-rpg-surface-raised px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-rpg-border">
            <Plus className="h-3.5 w-3.5" />
            Add Custom Skill
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-rpg-border">
              <th className="pb-3 text-[10px] font-bold uppercase tracking-wider text-rpg-orange">
                Skill Name
              </th>
              <th className="hidden pb-3 text-[10px] font-bold uppercase tracking-wider text-rpg-orange sm:table-cell">
                Attribute
              </th>
              <th className="pb-3 text-[10px] font-bold uppercase tracking-wider text-rpg-orange">
                Training Level
              </th>
              <th className="pb-3 text-center text-[10px] font-bold uppercase tracking-wider text-rpg-orange">
                Bonus
              </th>
              <th className="pb-3 text-right text-[10px] font-bold uppercase tracking-wider text-rpg-orange">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {pageSkills.map((skill) => (
              <tr
                key={skill.id}
                className="border-b border-rpg-border/50 last:border-0"
              >
                <td className="py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rpg-surface-raised">
                      <skill.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {skill.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {skill.description}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="hidden py-3.5 text-sm text-muted-foreground sm:table-cell">
                  {skill.attribute}
                </td>
                <td className="py-3.5">
                  <select
                    value={skill.trainingLevel}
                    onChange={(e) => {
                      const updated = skills.map((s) =>
                        s.id === skill.id
                          ? { ...s, trainingLevel: e.target.value }
                          : s
                      )
                      setSkills(updated)
                    }}
                    className="rounded-md border border-rpg-border bg-rpg-surface-raised px-2 py-1 text-xs text-foreground focus:border-rpg-orange focus:outline-none"
                  >
                    {trainingLevels.map((t) => (
                      <option key={t} value={t} className="bg-rpg-surface">
                        {t}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-3.5 text-center">
                  <span
                    className={`text-sm font-bold ${bonusColor(skill.bonus)}`}
                  >
                    +{skill.bonus}
                  </span>
                </td>
                <td className="py-3.5 text-right">
                  <button
                    onClick={() => onRollCheck(skill.name, skill.bonus)}
                    className="flex items-center gap-1.5 rounded-lg border border-rpg-border bg-rpg-surface-raised px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-rpg-border"
                  >
                    <Dices className="h-3.5 w-3.5" />
                    Roll Check
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Showing {page * PAGE_SIZE + 1}-
          {Math.min((page + 1) * PAGE_SIZE, skills.length)} of {skills.length}{" "}
          skills
        </p>
        <div className="flex gap-1">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-rpg-border bg-rpg-surface-raised text-muted-foreground transition-colors hover:bg-rpg-border disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-rpg-border bg-rpg-surface-raised text-muted-foreground transition-colors hover:bg-rpg-border disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
