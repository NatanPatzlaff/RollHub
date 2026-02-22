"use client"

import { useState } from "react"
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Backpack,
  BookMarked,
  Settings,
  Dice5,
  Menu,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: false },
  { icon: Users, label: "Character Sheet", active: true },
  { icon: BookOpen, label: "Spells & Rituals", active: false },
  { icon: Backpack, label: "Inventory", active: false },
  { icon: BookMarked, label: "Journal", active: false },
]

interface RollEntry {
  id: number
  label: string
  result: number
  total: number
  timestamp: Date
}

interface SidebarProps {
  rolls: RollEntry[]
  activeNav: string
  onNavChange: (label: string) => void
}

export function AppSidebar({ rolls, activeNav, onNavChange }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 flex items-center justify-center rounded-lg bg-rpg-surface p-2 text-foreground lg:hidden"
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-rpg-border bg-sidebar lg:static lg:z-auto",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center gap-3 px-5 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rpg-orange font-sans text-lg font-bold text-primary-foreground">
            A
          </div>
          <span className="text-lg font-bold text-foreground">
            Apex<span className="text-rpg-orange">RPG</span>
          </span>
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto text-muted-foreground lg:hidden"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-2">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = activeNav === item.label
              return (
                <li key={item.label}>
                  <button
                    onClick={() => {
                      onNavChange(item.label)
                      setMobileOpen(false)
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "border-l-2 border-rpg-orange bg-rpg-surface-raised text-rpg-orange"
                        : "text-muted-foreground hover:bg-rpg-surface-raised hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-4.5 w-4.5" />
                    {item.label}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="border-t border-rpg-border px-4 py-3">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Recent Rolls
          </p>
          {rolls.length === 0 ? (
            <p className="text-xs italic text-muted-foreground">
              No rolls yet this session.
            </p>
          ) : (
            <ul className="flex max-h-32 flex-col gap-1 overflow-y-auto">
              {rolls.slice(-5).reverse().map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between text-xs text-muted-foreground"
                >
                  <span className="truncate">{r.label}</span>
                  <span className="font-mono font-semibold text-foreground">
                    {r.total}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-rpg-border px-3 py-3">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-rpg-surface-raised hover:text-foreground">
            <Settings className="h-4.5 w-4.5" />
            Settings
          </button>
        </div>

        <div className="border-t border-rpg-border px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rpg-surface-raised text-xs font-bold text-muted-foreground">
              GM
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Game Master</p>
              <p className="text-xs text-muted-foreground">gm@apex-rpg.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
