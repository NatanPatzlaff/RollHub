"use client"

import { Bell, Save, Search } from "lucide-react"

export function CharacterHeader() {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="pl-10 lg:pl-0">
        <h1 className="text-2xl font-bold text-foreground">
          Operative: <span className="text-foreground">Cipher</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          Level 5 &bull; Netrunner Class &bull; Neon City Faction
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search database..."
            className="w-48 rounded-lg border border-rpg-border bg-rpg-surface-raised py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-rpg-orange focus:outline-none"
          />
        </div>
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-rpg-border bg-rpg-surface-raised text-muted-foreground transition-colors hover:text-foreground">
          <Bell className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-rpg-orange" />
        </button>
        <button className="flex items-center gap-2 rounded-lg bg-rpg-green px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-rpg-green/90">
          <Save className="h-4 w-4" />
          Save Sheet
        </button>
      </div>
    </header>
  )
}
