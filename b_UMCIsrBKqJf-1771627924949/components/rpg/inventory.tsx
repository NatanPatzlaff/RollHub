"use client"

import { useState } from "react"
import {
  Backpack,
  Plus,
  Trash2,
  Sword,
  Shield,
  FlaskConical,
  Scroll,
  Gem,
  Package,
  ChevronDown,
  ChevronUp,
  Weight,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface InventoryItem {
  id: number
  name: string
  type: string
  quantity: number
  weight: number
  description: string
  equipped: boolean
}

const iconMap: Record<string, React.ElementType> = {
  Weapon: Sword,
  Armor: Shield,
  Potion: FlaskConical,
  Scroll: Scroll,
  Gem: Gem,
  Misc: Package,
}

const typeColors: Record<string, string> = {
  Weapon: "#ef4444",
  Armor: "#3b82f6",
  Potion: "#22c55e",
  Scroll: "#a855f7",
  Gem: "#eab308",
  Misc: "#6b7280",
}

const defaultItems: InventoryItem[] = [
  { id: 1, name: "Plasma Pistol", type: "Weapon", quantity: 1, weight: 2.5, description: "Standard sidearm with energy cells", equipped: true },
  { id: 2, name: "Kevlar Vest", type: "Armor", quantity: 1, weight: 8, description: "Provides ballistic resistance", equipped: true },
  { id: 3, name: "Stim Pack", type: "Potion", quantity: 4, weight: 0.5, description: "Restores 2d6 health on use", equipped: false },
  { id: 4, name: "Cipher Module", type: "Scroll", quantity: 1, weight: 0.2, description: "Decryption key for Neon City network", equipped: false },
  { id: 5, name: "Ether Shard", type: "Gem", quantity: 2, weight: 0.1, description: "Power source for rituals", equipped: false },
  { id: 6, name: "Grapple Hook", type: "Misc", quantity: 1, weight: 3, description: "Retractable climbing aid", equipped: false },
  { id: 7, name: "EMP Grenade", type: "Weapon", quantity: 3, weight: 1, description: "Disables electronics in 5m radius", equipped: false },
  { id: 8, name: "Neural Amp", type: "Misc", quantity: 1, weight: 0.3, description: "Boosts Intellect checks by +2", equipped: true },
]

const maxWeight = 80

export function Inventory({ items: propItems }: { items?: InventoryItem[] }) {
  const [items, setItems] = useState<InventoryItem[]>(propItems || defaultItems)
  const [showAdd, setShowAdd] = useState(false)
  const [sortAsc, setSortAsc] = useState(true)
  const [filterType, setFilterType] = useState("All")
  const [newItem, setNewItem] = useState({
    name: "",
    type: "Misc",
    quantity: 1,
    weight: 1,
    description: "",
  })

  const totalWeight = items.reduce(
    (sum, i) => sum + i.weight * i.quantity,
    0
  )

  const filteredItems = items
    .filter((i) => filterType === "All" || i.type === filterType)
    .sort((a, b) => (sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)))

  const addItem = () => {
    if (!newItem.name.trim()) return
    setItems([
      ...items,
      {
        id: Date.now(),
        ...newItem,
        equipped: false,
      },
    ])
    setNewItem({ name: "", type: "Misc", quantity: 1, weight: 1, description: "" })
    setShowAdd(false)
  }

  const removeItem = (id: number) => {
    setItems(items.filter((i) => i.id !== id))
  }

  const toggleEquip = (id: number) => {
    setItems(
      items.map((i) =>
        i.id === id ? { ...i, equipped: !i.equipped } : i
      )
    )
  }

  return (
    <div className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Backpack className="h-5 w-5 text-rpg-orange" />
          <h3 className="text-lg font-bold text-foreground">Inventory</h3>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1.5 rounded-lg border border-rpg-border bg-rpg-surface-raised px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-rpg-border"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Item
        </button>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Weight className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {totalWeight.toFixed(1)} / {maxWeight} lbs
          </span>
          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-rpg-surface-raised">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                totalWeight / maxWeight > 0.9
                  ? "bg-rpg-hp"
                  : totalWeight / maxWeight > 0.7
                    ? "bg-rpg-effort"
                    : "bg-rpg-green"
              )}
              style={{ width: `${Math.min((totalWeight / maxWeight) * 100, 100)}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="rounded-md border border-rpg-border bg-rpg-surface-raised px-2 py-1 text-xs text-foreground focus:border-rpg-orange focus:outline-none"
          >
            <option value="All" className="bg-rpg-surface">All Types</option>
            {Object.keys(iconMap).map((t) => (
              <option key={t} value={t} className="bg-rpg-surface">
                {t}
              </option>
            ))}
          </select>
          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="flex items-center gap-1 rounded-md border border-rpg-border bg-rpg-surface-raised px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
          >
            {sortAsc ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
            Name
          </button>
        </div>
      </div>

      {showAdd && (
        <div className="mb-4 rounded-lg border border-rpg-border bg-rpg-surface-raised p-3">
          <div className="mb-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <input
              type="text"
              placeholder="Item name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="col-span-2 rounded-md border border-rpg-border bg-rpg-surface px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-rpg-orange focus:outline-none"
            />
            <select
              value={newItem.type}
              onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
              className="rounded-md border border-rpg-border bg-rpg-surface px-2 py-1.5 text-sm text-foreground focus:border-rpg-orange focus:outline-none"
            >
              {Object.keys(iconMap).map((t) => (
                <option key={t} value={t} className="bg-rpg-surface">
                  {t}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Qty"
                min={1}
                value={newItem.quantity}
                onChange={(e) =>
                  setNewItem({ ...newItem, quantity: Number(e.target.value) })
                }
                className="w-full rounded-md border border-rpg-border bg-rpg-surface px-2 py-1.5 text-sm text-foreground focus:border-rpg-orange focus:outline-none"
              />
            </div>
          </div>
          <div className="mb-2 flex gap-2">
            <input
              type="number"
              placeholder="Weight"
              step={0.1}
              min={0}
              value={newItem.weight}
              onChange={(e) =>
                setNewItem({ ...newItem, weight: Number(e.target.value) })
              }
              className="w-24 rounded-md border border-rpg-border bg-rpg-surface px-2 py-1.5 text-sm text-foreground focus:border-rpg-orange focus:outline-none"
            />
            <input
              type="text"
              placeholder="Description"
              value={newItem.description}
              onChange={(e) =>
                setNewItem({ ...newItem, description: e.target.value })
              }
              className="flex-1 rounded-md border border-rpg-border bg-rpg-surface px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-rpg-orange focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowAdd(false)}
              className="rounded-md border border-rpg-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
            <button
              onClick={addItem}
              className="rounded-md bg-rpg-orange px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-rpg-orange/90"
            >
              Add
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        {filteredItems.map((item) => {
          const Icon = iconMap[item.type] || Package;
          const color = typeColors[item.type] || "#6b7280";
          // Exemplo: para armas, mostrar card detalhado
          const isWeapon = item.type === "Weapon" || item.type === "Arma";
          // Suporte a campos extras (arma): dano, alcance, margem de crítico, multiplicador de crítico
          // Espera-se que esses campos estejam em item.damage, item.range, item.critical, item.criticalMultiplier
          return (
            <div
              key={item.id}
              className={cn(
                "flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors",
                item.equipped
                  ? "border-rpg-orange/30 bg-rpg-orange/5"
                  : "border-rpg-border bg-rpg-surface-raised"
              )}
            >
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${color}15` }}
              >
                <Icon className="h-4 w-4" style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {item.name}
                  </p>
                  {item.equipped && (
                    <span className="shrink-0 rounded-full bg-rpg-orange/20 px-1.5 py-0.5 text-[9px] font-bold text-rpg-orange">
                      EQUIPPED
                    </span>
                  )}
                </div>
                {isWeapon ? (
                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span><b>Dano:</b> {item.damage || '-'}</span>
                    <span><b>Alcance:</b> {item.range || '-'}</span>
                    <span><b>Crítico:</b> {item.critical || '-'}</span>
                    <span><b>Multiplicador:</b> {item.criticalMultiplier || '-'}</span>
                  </div>
                ) : (
                  <p className="text-[10px] text-muted-foreground truncate">
                    {item.description}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
                <span>x{item.quantity}</span>
                <span>{item.weight}lb</span>
                <button
                  onClick={() => toggleEquip(item.id)}
                  className={cn(
                    "rounded-md border px-2 py-1 text-[10px] font-medium transition-colors",
                    item.equipped
                      ? "border-rpg-orange/40 text-rpg-orange hover:bg-rpg-orange/10"
                      : "border-rpg-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.equipped ? "Unequip" : "Equip"}
                </button>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-muted-foreground transition-colors hover:text-rpg-hp"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="py-8 text-center text-sm text-muted-foreground">
          No items found.
        </div>
      )}
    </div>
  )
}
