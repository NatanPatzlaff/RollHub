# Cálculo e Exibição de Bônus de Armas com Modificações e Maldições

## 1. Método de Cálculo dos Bônus de Modificações de Arma

O cálculo dos bônus de modificações de arma é feito no backend ao montar o inventário, somando os campos `damageBonus`, `criticalBonus`, `attackBonus` etc. Exemplo:

```ts
const inventoryWeapons = characterWeaponsRows.map((cw: any) => ({
  id: cw.id,
  weaponId: cw.weapon_id,
  name: cw.custom_name || cw.name,
  // ...outros campos...
  modifications: characterWeaponModificationsRows
    .filter((m: any) => m.character_weapon_id === cw.id)
    .map((m: any) => ({
      id: m.id,
      modificationId: m.modification_id,
      name: m.mod_name,
      type: m.mod_type,
      element: m.mod_element,
      category: m.mod_category,
      attackBonus: m.mod_attack_bonus || 0,
      damageBonus: m.mod_damage_bonus || null,
      criticalBonus: m.mod_critical_bonus || 0,
      specialProperties: m.mod_special_properties
        ? typeof m.mod_special_properties === 'string'
          ? JSON.parse(m.mod_special_properties)
          : m.mod_special_properties
        : null,
    })),
}))
```

No frontend, a soma dos bônus geralmente é feita via `.reduce` sobre o array de modificações da arma.

---

## 2. Método de Cálculo dos Bônus de Maldições

No backend, maldições são carregadas em `catalogCursedItems` e associadas ao inventário. O campo `curses` pode conter efeitos especiais, elementos, tipo etc. Exemplo:

```ts
const catalogCursedItems = cursedItemsRows.map((r: any) => ({
  id: r.id,
  name: r.name,
  category: r.category,
  element: r.element,
  itemType: r.item_type,
  spaces: r.spaces,
  description: r.description,
  benefits:
    typeof r.benefits === 'string' ? (r.benefits ? JSON.parse(r.benefits) : null) : r.benefits,
  curses: typeof r.curses === 'string' ? (r.curses ? JSON.parse(r.curses) : null) : r.curses,
}))
```

A aplicação dos efeitos de maldição (elemento, tipo, bônus especiais) é feita no frontend ao exibir ou calcular os stats finais, somando os efeitos de `curses` conforme a lógica do componente.

---

## 3. Interface TypeScript de Arma com Modificações e Maldições

```ts
interface InventoryWeapon {
  id: number
  weaponId: number
  name: string
  type: 'Weapon'
  damage: string
  range: number
  critical: string
  criticalMultiplier: number
  damageType: string
  description: string
  equipped: boolean
  quantity: number
  spaces: number
  category: string
  modifications: {
    id: number
    modificationId: number
    name: string
    type: string
    element: string
    category: string
    attackBonus: number
    damageBonus: string | null
    criticalBonus: number
    specialProperties: any
  }[]
  // Pode haver outros campos, dependendo do uso
}

interface CatalogCursedItem {
  id: number
  name: string
  category: string
  element: string
  itemType: string
  spaces: number
  description: string
  benefits: any
  curses: any
}
```

---

## 4. Exibição dos Bônus no Frontend

No frontend, a soma dos stats finais é feita geralmente em um componente de exibição, por exemplo:

```ts
const totalAttackBonus = weapon.modifications.reduce((sum, m) => sum + (m.attackBonus || 0), 0)
const totalDamageBonus = weapon.modifications.reduce(
  (sum, m) => sum + (parseInt(m.damageBonus) || 0),
  0
)
const totalCriticalBonus = weapon.modifications.reduce((sum, m) => sum + (m.criticalBonus || 0), 0)
// Para maldições, somar efeitos de weapon.curses se aplicável
```

Exemplo de exibição:

```tsx
<span>
  Dano: {weapon.damage}
  {totalDamageBonus > 0 && <> +{totalDamageBonus}</>}
</span>
<span>
  Ataque: {totalAttackBonus > 0 && <>+{totalAttackBonus}</>}
</span>
<span>
  Crítico: {weapon.critical}
  {totalCriticalBonus > 0 && <> +{totalCriticalBonus}</>}
</span>
```

Efeitos de maldição podem ser exibidos em tooltips ou linhas adicionais, conforme o conteúdo de `weapon.curses`.
