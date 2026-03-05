export interface Origin {
    id: number
    name: string
    description: string
    trainedSkills: string[] | string | null
    abilityName: string | null
    abilityDescription: string | null
}

export interface CharacterClass {
    id: number
    name: string
    description: string
}

export interface Trail {
    id: number
    name: string
    description: string | null
    classId: number
    progression?: Array<{
        id: number
        trailId: number
        nex: number
        title: string
        description: string | null
        type: string
    }>
}

export interface ClassAbility {
    id: number
    classId: number
    name: string
    description: string | null
    effects: any
}

export interface ParanormalPower {
    id: number
    name: string
    description: string | null
    element: string | null
    peCost: number | null
    requirements: string | null
    effects: any
    category: number
}

export interface Ritual {
    id: number
    name: string
    element: string
    circle: number
    execution: string
    range: string
    target: string
    duration: string
    resistance: string | null
    description: string | null
    discente: string | null
    verdadeiro: string | null
    normalPe?: number | null
    discentePe?: number | null
    verdadeiroPe?: number | null
    normalDamage?: string | null
    discenteDamage?: string | null
    verdadeiroDamage?: string | null
}

export interface CatalogWeapon {
    id: number
    name: string
    category: number
    type: string
    weaponType: string | null
    damage: string
    damageType: string | null
    critical: string | null
    criticalMultiplier: string | null
    range: string | null
    ammoCapacity: number | null
    ammoType: string | null
    spaces: number
    description: string | null
    special: any
}

export interface CatalogProtection {
    id: number
    name: string
    category: number
    type: string
    defenseBonus: number
    dodgePenalty: number
    spaces: number
    description: string | null
    special: any
}

export interface CatalogGeneralItem {
    id: number
    name: string
    category: number
    type: string | null
    spaces: number
    description: string | null
    effects: any
}

export interface CatalogCursedItem {
    id: number
    name: string
    category: number
    element: number | null
    itemType: string | null
    spaces: number
    description: string | null
    benefits: any
    curses: any
}

export interface CatalogAmmunition {
    id: number
    name: string
    category: number
    type: string
    description: string | null
    damageBonus?: string | null
    spaces: number
    damageTypeOverride?: string | null
    criticalBonus?: number | null
    criticalMultiplierBonus?: string | null
    weaponTypeRestriction?: string | null
    element?: string | null
}

export interface CatalogProtectionModification {
    id: number
    name: string
    category: number
    type: string
    element: string | null
    description: string | null
    specialProperties: any
    defenseBonus: number | null
    protectionTypeRestriction: string | null
}

export interface CharacterProps {
    character: {
        id: number
        name: string
        nex: number
        rank?: string
        affinity?: string | null
        classId?: number
        originId?: number
        trailId?: number
        trail?: { id: number; name: string }
        class?: { id: number; name: string }
        origin?: { id: number; name: string; trainedSkills?: string[] | string | null }
        attributes?: {
            strength: number
            agility: number
            intellect: number
            vigor: number
            presence: number
        }
        stats?: {
            currentHp: number
            currentPe: number
            currentSanity: number
        }
        skills?: Array<{
            trainingDegree: number
            skill?: { name: string }
        }>
        classAbilities?: Array<{
            id: number
            classAbilityId: number
            config?: any
            classAbility?: {
                id: number
                name: string
                description: string | null
                effects: any
            }
        }>
        paranormalPowers?: Array<{
            id: number
            paranormalPowerId: number
            paranormalPower?: {
                id: number
                name: string
                description: string | null
                element: string | null
                effects: any
                requirements: string | null
            }
        }>
        rituals?: Array<{
            id: number
            ritualId: number
            ritual?: Ritual
        }>
    }
    classes: CharacterClass[]
    origins: Origin[]
    classTrails?: Trail[]
    calculatedStats?: {
        maxHp: number
        maxPe: number
        maxSanity: number
        currentHp: number
        currentPe: number
        currentSanity: number
        defense: number
        dodge: number
        permanentSanityLoss: number
    }
    classInfo?: {
        hpFormula: string
        peFormula: string
        sanityFormula: string
        proficiencies: string | null
        baseHp: number
        hpPerLevel: number
        basePe: number
        pePerLevel: number
        baseSanity: number
        sanityPerLevel: number
    }
    attributeBonusFromNex?: number
    trailProgressions?: Array<{
        id: number
        trailId: number
        nex: number
        title: string
        description: string | null
        type: string
    }>
    availableAbilities?: ClassAbility[]
    paranormalPowers?: ParanormalPower[]
    catalogRituals?: Ritual[]
    catalogWeapons?: CatalogWeapon[]
    catalogProtections?: CatalogProtection[]
    catalogGeneralItems?: CatalogGeneralItem[]
    catalogCursedItems?: CatalogCursedItem[]
    inventoryWeapons?: any[]
    inventoryProtections?: any[]
    inventoryGeneralItems?: any[]
    catalogAmmunitions?: CatalogAmmunition[]
    catalogProtectionModifications?: CatalogProtectionModification[]
}

export interface InventoryItem {
    id: number
    weaponId?: number
    name: string
    desc: string
    qty: number
    weight: string
    type: string
    damage?: string
    damageType?: string | null
    category?: number | null
    calculatedCategory?: number | null
    critical?: string | null
    criticalMultiplier?: string | null
    range?: string | null
    weaponType?: string | null
    uniqueId: string
    spaces: number
    modifications?: any[]
}
