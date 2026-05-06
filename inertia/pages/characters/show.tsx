import { Card, CardBody, Button, Chip, Divider, useDisclosure, addToast } from '@heroui/react'
import { Head, Link as LinkIcon, router, usePage } from '@inertiajs/react'
import axios from 'axios'
import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Transmit } from '@adonisjs/transmit-client'
import { skillDescriptions } from '../../utils/skillDescriptions'
import {
  Zap,
  Plus,
  Brain,
  Heart,
  Dumbbell,
  Wind,
  Sword,
  Shield,
  Briefcase,
  Eye,
  Crosshair,
  Sparkles,
  BookOpen,
  Search,
  Calculator,
  Dice5,
  History,
  ChevronRight,
  Target,
  Ghost,
  Skull,
  UserCheck,
  Droplets,
  ShieldCheck,
  Lock,
  AlertCircle,
  Wand2,
  Info,
  User,
  Dices,
  RotateCcw,
  Check,
  Edit3,
  Swords,
  X,
} from 'lucide-react'
import TrailSelectModal from './components/TrailSelectModal'
import RitualSelectModal from './components/RitualSelectModal'
import ParanormalPowerModal from './components/ParanormalPowerModal'
import { useAbilityEffects } from '../../hooks/useAbilityEffects'
import AffinityModal from './components/AffinityModal'
import BaseModal from './components/BaseModal'
import AttributesDiceTrayCard, {
  type AttributesDiceTrayCardHandle,
} from './components/AttributesDiceTrayCard'
import CombatDefensesCard from './components/CombatDefensesCard'
import AddItemModal from './components/AddItemModal'
import SkillsCard from './components/SkillsCard'
import CharacterTabsCard from './components/CharacterTabsCard'
import CreateCharacterModal from '../home/CreateCharacterModal'
import RitualBuffModal from './components/RitualBuffModal'
import { ModificationModal } from './components/ModificationModal'
import DotTargetModal from './components/DotTargetModal'
import DotRollModal from './components/DotRollModal'
import AllyBuffModal from './components/AllyBuffModal'
import RollHistorySidebar from './components/RollHistorySidebar'
import {
  getRitualBuff,
  rollDiceExpression,
  getAttributeBonus,
  type RitualBuffEffect,
} from '../../utils/ritualBuffs'
import { useRitualCalculations } from '../../hooks/useRitualCalculations'

const applyStepIncrease = (damage: string, steps: number): string => {
  // Parsear "2d6" em { count: 2, die: 6 }
  const match = damage.match(/^(\d+)d(\d+)$/)
  if (!match) return damage
  const count = parseInt(match[1])
  const die = parseInt(match[2])
  return `${count + steps}d${die}`
}

interface Origin {
  id: number
  name: string
  description: string
  trainedSkills: string[] | string | null
  abilityName: string | null
  abilityDescription: string | null
}

interface OriginAbilityData {
  id: number
  originId: number
  name: string
  description: string | null
  type: string | null
  peCost: string | null
  range: string | null
  castTime: string | null
  duration: string | null
  target: string | null
  effects: any | null
}

interface CharacterClass {
  id: number
  name: string
  description: string
}

/** Helper de debounce customizado para evitar dependência de lodash */
function debounce<T extends (...args: any[]) => any>(func: T, wait: number) {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

interface Trail {
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

interface ClassAbility {
  id: number
  classId: number
  name: string
  description: string | null
  effects: any
}

interface ParanormalPower {
  id: number
  name: string
  description: string | null
  element: string | null
  peCost: number | null
  requirements: string | null
  effects: any
  category: number
}

interface Ritual {
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
}

interface CatalogWeapon {
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

interface CatalogProtection {
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

interface CatalogGeneralItem {
  id: number
  name: string
  category: number
  type: string | null
  spaces: number
  description: string | null
  effects: any
}

interface CatalogCursedItem {
  id: number
  name: string
  element: number | null
  itemType: string | null
  spaces: number
  description: string | null
  benefits: any
  curses: any
}

interface CatalogAmmunition {
  id: number
  name: string
  category: number
  description: string | null
  spaces: number
  duration: string | null
  weaponTypeRestriction: any | null
}

interface CatalogHomebrewItem {
  id: number
  name: string
  description: string | null
  itemType: 'weapon' | 'protection' | 'ammunition' | 'general'
  damage: string | null
  damageType: string | null
  range: string | null
  defenseBonus: number | null
  penalty: number | null
  caliber: string | null
  quantityPerBox: number | null
  weight: number | null
  price: number | null
  category: number | null
  skillBonusName: string | null
  skillBonusValue: number | null
  createdByUserId: number | null
}

interface InventoryAmmunitionModification {
  id: number
  modificationId: number
  name: string
  type: string
  element: string | null
  category: number
  attackBonus: number
  damageBonus: string | null
  criticalBonus: number
  specialProperties: any
}

interface InventoryAmmunition {
  id: number
  ammunitionId: number
  name: string
  quantity: number
  spaces: number
  category: number
  description: string | null
  notes: string | null
  type: 'Ammunition'
  modifications: InventoryAmmunitionModification[]
}

interface CharacterProps {
  character: {
    id: number
    name: string
    nex: number
    affinity?: string | null
    rank?: string
    classId?: number
    originId?: number
    trailId?: number
    trail?: { id: number; name: string }
    trailConfig?: Record<string, any>
    class?: { id: number; name: string }
    origin?: {
      id: number
      name: string
      trainedSkills?: string[] | string | null
      abilityName?: string | null
      abilityDescription?: string | null
    }
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
      characterClassAbilityId?: number | null
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
    homebrewItems?: Array<{
      id: number
      name: string
      skillBonusName: string | null
      skillBonusValue: number | null
    }>
    campaigns?: Array<{ dddiceRoomSlug: string | null }>
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
    permanentSanityLoss?: number
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
    effects?: Record<string, any> | null
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
  inventoryAmmunitions?: InventoryAmmunition[]
  catalogAmmunitions?: CatalogAmmunition[]
  catalogHomebrewItems?: CatalogHomebrewItem[]
  catalogWeaponModifications?: any[]
  originAbilities?: OriginAbilityData[]
  campaignId: number | null
}

export default function CharacterShow(initialProps: CharacterProps) {
  const pageProps = usePage().props as unknown as CharacterProps & { class_trails?: Trail[] }
  const {
    character,
    classes,
    origins,
    availableAbilities = [],
    paranormalPowers: catalogParanormalPowersProp = [],
    calculatedStats,
    classInfo,
    attributeBonusFromNex = 0,
    catalogWeapons = [],
    catalogProtections = [],
    catalogGeneralItems = [],
    catalogCursedItems = [],
    inventoryWeapons = [],
    inventoryProtections = [],
    inventoryGeneralItems = [],
    inventoryAmmunitions = [],
    catalogAmmunitions = [],
    catalogHomebrewItems = [],
    catalogWeaponModifications = [],
    trailProgressions = [],
    catalogRituals = [],
    originAbilities = [],
    campaignId = null,
  } = { ...initialProps, ...pageProps } as CharacterProps

  console.log('[SSE] props campaignId:', campaignId)

  // Normalize classTrails: backend may send camelCase (classTrails) or snake_case (class_trails)
  const classTrails: Trail[] =
    initialProps.classTrails ?? pageProps.classTrails ?? pageProps.class_trails ?? []

  const catalogParanormalPowers: ParanormalPower[] = (catalogParanormalPowersProp || []).filter(
    (power) => {
      if (!power.requirements) return true
      // Parse requirements like 'Conhecimento 1', 'Energia 2', etc.
      const match = power.requirements.trim().match(/^([A-Za-zÀ-ž]+)\s+(\d+)$/i)
      if (!match) return true
      const reqElement = match[1].toUpperCase()
      const reqCircle = parseInt(match[2], 10)
      // Score = sum of ritual circles + 1 per paranormal power (same element)
      // must reach reqCircle (e.g. "Conhecimento 3" needs score >= 3)
      let score = 0
      for (const cr of (character.rituals || []) as any[]) {
        const ritual = cr.ritual
        if (ritual && ritual.element?.toUpperCase() === reqElement) score += ritual.circle
      }
      for (const cp of (character.paranormalPowers || []) as any[]) {
        const pp = cp.paranormalPower
        if (pp && pp.element?.toUpperCase() === reqElement) score += 1
      }
      return score >= reqCircle
    }
  )

  // Personagem sem trilha: considerar trailId ou trail_id (serialização pode vir em snake_case)
  const characterTrailId = character.trailId ?? (character as { trail_id?: number | null }).trail_id
  const hasNoTrail = characterTrailId == null || characterTrailId === undefined

  // Collapsible sections state
  const [expandedSections, setExpandedSections] = useState({
    originAbility: true,
    classAbilities: true,
    chosenAbilities: true,
    trailAbilities: true,
    acquiredAbilities: true,
    paranormalPowers: true,
    rituals: true,
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Use calculated stats from server or fallback to defaults
  const characterId = character.id

  const [hp, setHp] = useState(calculatedStats?.currentHp || 21)
  const [pe, setPe] = useState(calculatedStats?.currentPe || 3)
  const [san, setSan] = useState(calculatedStats?.currentSanity || 12)
  const [permSanLoss, setPermSanLoss] = useState(calculatedStats?.permanentSanityLoss || 0)
  const [roomItems, setRoomItems] = useState<any[]>([])

  const [pendingReaction, setPendingReaction] = useState<any>(null)
  const pendingReactionRef = useRef<any>(null)

  const handleReaction = async (reactionType: string) => {
    setPendingReaction(null)
    pendingReactionRef.current = null
    try {
      await axios.post(`/api/campaigns/${campaignId}/reaction-response`, {
        reactionType,
        characterId: character.id,
      })
      console.log('[REACTION] Resposta enviada:', reactionType)
    } catch (e) {
      console.error('[REACTION] Erro ao enviar resposta:', e)
    }
  }

  const [isMyTurn, setIsMyTurn] = useState(false)

  // SSE para receber solicitações de reações
  useEffect(() => {
    console.log('[SSE] useEffect rodou, campaignId:', campaignId, 'character.id:', character.id)
    if (!campaignId) return
    fetchRoomItems()

    const transmitClient = new Transmit({ baseUrl: window.location.origin })
    const subscription = transmitClient.subscription(`character/${character.id}/reactions`)

    subscription.create().then(() => {
      console.log('[SSE] conectado ao canal character/' + character.id + '/reactions')
    }).catch((e) => {
      console.error('[SSE] erro ao criar subscription:', e)
    })

    subscription.onMessage<any>((data) => {
      console.log('[SSE] mensagem recebida:', data)
      if (data.type === 'REACTION_REQUEST') {
        setPendingReaction(data)
        pendingReactionRef.current = data
      }
      if (data.type === 'BUFF_RECEIVED') {
        const { buff, casterName } = data
        setActiveRitualBuffs((prev) => {
          const semDuplicata = prev.filter((b) => b.label !== buff.label)
          return [...semDuplicata, { ...buff, id: `${buff.label}-${Date.now()}` }]
        })
        addToast({
          title: `Buff Recebido`,
          description: `${casterName} aplicou ${buff.label} em você.`,
          color: 'success',
        })
      }
    })

    // Canal de eventos gerais da campanha
    const campaignSub = transmitClient.subscription(`campaign/${campaignId}/events`)
    campaignSub.create().then(() => {
      console.log('[SSE] conectado ao canal campaign/' + campaignId + '/events')
    }).catch((e) => {
      console.error('[SSE] erro canal campanha:', e)
    })

    campaignSub.onMessage<any>((data) => {
      console.log('[SSE] evento de campanha:', data)
      if (data.type === 'REACTION_REQUEST') {
        setPendingReaction(data)
        pendingReactionRef.current = data
      }
      if (data.type === 'COMBAT_STARTED') {
        setActiveCombatId(data.combatId)
      }
      if (data.type === 'TURN_START') {
        if (data.combatId) setActiveCombatId(data.combatId)
        if (data.participantId) {
          // opcional: carregar participantes se ainda não tivermos activeCombatId
        }
      }
      if (data.type === 'SCENE_END') {
        resetSceneUses()
        clearAllRitualBuffs()
        setActiveCombatId(null)
        setActiveCombatActions([])
        console.log('[SCENE] Fim de cena aplicado — buffs e ações de combate limpos')
      }
      if (data.type === 'ROOM_ITEMS_UPDATED') {
        fetchRoomItems()
        router.reload({ preserveScroll: true, preserveState: true })
      }
      if (data.type === 'TURN_START') {
        const isMe = data.characterId === character.id
        setIsMyTurn(isMe)
        // Auto-dismiss após 8 segundos
        if (isMe) setTimeout(() => setIsMyTurn(false), 8000)

        // Lógica de DoT (Esquentar) - Modal Visual com dddice
        if (isMe && (data.combatId || activeCombatId)) {
          const cId = data.combatId || activeCombatId
          fetch(`/api/combats/${cId}/participants`)
            .then(r => r.json())
            .then((allParticipants: any[]) => {
              setCombatParticipants(allParticipants)

              const myDebuffs = allParticipants.filter(p =>
                p.status?.debuffs?.some((d: any) => d.type === 'esquentar' && d.casterId === character.id)
              )

              if (myDebuffs.length === 0) return

              const targets = myDebuffs.map(p => ({
                id: p.id,
                name: p.name,
                isPlayer: p.status.debuffs.find((d: any) => d.type === 'esquentar' && d.casterId === character.id).targetIsPlayer
              }))

              setDotRollTargets(targets)
              setDotRollModalOpen(true)
            })
            .catch(err => console.error('[DoT] Erro ao processar:', err))
        }

        // Lógica de Desconto Automático de PE para Ações Sustentadas
        if (isMe) {
          const sustainedActions = activeCombatActionsRef.current.filter(
            a => a.duration === 'sustained' && a.sustainCostPerTurn
          )

          for (const action of sustainedActions) {
            setPe(prev => {
              const newPe = Math.max(0, prev - action.sustainCostPerTurn)
              if (newPe === 0) {
                setActiveCombatActions(prevActions =>
                  prevActions.filter(a => a.id !== action.id)
                )
                addToast({
                  title: 'Ritual Desativado',
                  description: `${action.label} foi desativado por falta de PE.`,
                  color: 'warning'
                })
              }
              return newPe
            })
          }
        }
      }
      
        if (data.type === 'BUFF_COPY_CONSUMED') {
          if (Number(data.characterId) === Number(character.id)) {
            if (data.remainingCopies <= 0) {
              removeRitualBuff(data.buffId)
            } else {
              updateRitualBuff(data.buffId, {
                remainingCopies: data.remainingCopies,
                defenseBonus: data.newDefenseBonus
              })
            }
          }
        }

        if (data.characterId === character.id) {
        if (data.type === 'ITEM_COLLECTED') {
          addToast({ title: 'Item Coletado', description: 'Você coletou um item da cena.', color: 'success' })
          router.reload({ only: ['character'] })
        }
        if (data.type === 'CUSTOM_ITEM_PENDING') {
          addToast({ title: 'Item Solicitado', description: 'O item aguarda a aprovação do mestre.', color: 'warning' })
          router.reload({ only: ['character'] })
        }
        if (data.type === 'CUSTOM_ITEM_ADDED') {
          addToast({ title: 'Item Criado', description: 'Você adicionou o item ao inventário.', color: 'success' })
          router.reload({ only: ['character'] })
        }
        if (data.type === 'CUSTOM_ITEM_APPROVED') {
          addToast({ title: 'Item Aprovado', description: 'O mestre aprovou a criação do seu item.', color: 'success' })
          router.reload({ only: ['character'] })
        }
        if (data.type === 'CUSTOM_ITEM_REJECTED') {
          addToast({ title: 'Item Rejeitado', description: 'O mestre rejeitou a criação do item.', color: 'danger' })
          router.reload({ only: ['character'] })
        }
      }
    })

    return () => {
      subscription.delete().catch(() => {})
      campaignSub.delete().catch(() => {})
    }
  }, [character.id, campaignId])

  const handleTempModificationChosen = (mod: any) => {
    if (!modifyingWeapon) return
    const weaponId = modifyingWeapon.id.toString()
    
    // Converte modificação em buff de ritual seguindo o mapeamento do catálogo (camelCase)
    const tempBuff: ActiveRitualBuff = {
      id: `temp-mod-${mod.id}-${Date.now()}`,
      label: `Amal. Tec.: ${mod.name}`,
      weaponAttackBonus: mod.attackBonus ?? 0,
      weaponDamageBonus: 0,
      weaponExtraDamageDice: undefined,
      weaponThreatRangeBonus: mod.criticalBonus ?? 0,
      weaponCritMultiplierBonus: mod.criticalMultiplierBonus 
        ? parseInt(String(mod.criticalMultiplierBonus).replace('+', '').replace('x', '')) 
        : 0,
      weaponDamageStepBonus: 0,
      buffDuration: 'scene',
      targetWeaponId: weaponId,
      defenseBonus: 0,
      dodgeBonus: 0,
      tempHp: 0,
      strBonus: 0,
      agiBonus: 0,
      intBonus: 0,
      preBonus: 0,
      weaponExtraDamageElement: mod.element,
      weaponDamageElement: mod.element,
    }

    // Mapeamento de dano (fixo vs dados)
    if (mod.damageBonus) {
      const dbStr = String(mod.damageBonus)
      if (dbStr.includes('d')) {
        tempBuff.weaponExtraDamageDice = dbStr.replace('+', '')
      } else {
        tempBuff.weaponDamageBonus = parseInt(dbStr.replace('+', '')) || 0
      }
    }

    // Mapeamento de propriedades especiais (ex: Calibre Grosso)
    const specialProps = typeof mod.specialProperties === 'string'
      ? JSON.parse(mod.specialProperties)
      : (mod.specialProperties ?? {})
    
    if (specialProps.extra_die) tempBuff.weaponDamageStepBonus = specialProps.extra_die

    console.log('[TEMP-MOD] mod recebido:', JSON.stringify(mod))
    console.log('[TEMP-MOD] modifyingWeapon:', modifyingWeapon)
    console.log('[TEMP-MOD] tempBuff criado:', JSON.stringify(tempBuff))

    setActiveRitualBuffs(prev => [...prev, tempBuff])
    setIsTempRitual(false)
    onModifyWeaponModalOpenChange()
    addToast({ title: 'Modificação temporária aplicada!', color: 'success' })
  }

  // ── Estado de buffs ativos de rituais ───────────────────────────────────────
  interface ActiveRitualBuff {
    id: string
    label: string
    defenseBonus: number
    dodgeBonus: number
    tempHp: number
    strBonus: number
    agiBonus: number
    intBonus: number
    preBonus: number
    healByDamageFactor?: number
    // Efeitos de arma
    weaponAttackBonus?: number
    weaponDamageBonus?: number
    weaponThreatRangeBonus?: number
    weaponCritMultiplierBonus?: number
    weaponExtraDamageDice?: string
    weaponExtraDamageElement?: string
    weaponDamageElement?: string
    weaponType?: 'melee' | 'ranged' | 'all'
    buffDuration?: 'scene' | 'sustained' | 'next_attack'
    targetWeaponId?: string
    skillAdvantage?: string[]
    weaponDamageStepBonus?: number
    copies?: number
    remainingCopies?: number
    defensePerCopy?: number
    skillBonus?: number
  }
  const [activeRitualBuffs, setActiveRitualBuffs] = useState<ActiveRitualBuff[]>([])
  const activeRitualBuffsRef = useRef<ActiveRitualBuff[]>(activeRitualBuffs)
  useEffect(() => {
    activeRitualBuffsRef.current = activeRitualBuffs
  }, [activeRitualBuffs])

  // ── Estado de buffs ativos de habilidades (trilha / origem) ────────────────
  interface ActiveAbilityBuff {
    id: string
    abilityName: string
    source: 'trail' | 'origin' | 'class'
    effects: any
  }
  const [activeAbilityBuffs, setActiveAbilityBuffs] = useState<ActiveAbilityBuff[]>([])
  const [abilityUsesThisScene, setAbilityUsesThisScene] = useState<Record<string, number>>({})

  const [tempHp, setTempHp] = useState(0)
  const [tempPe, setTempPe] = useState(0)

  // Estado do modal de buff de ritual
  const [isRitualBuffModalOpen, setIsRitualBuffModalOpen] = useState(false)
  const [pendingRitualBuff, setPendingRitualBuff] = useState<{
    ritualName: string
    version: 'base' | 'discente' | 'verdadeiro'
    buff: RitualBuffEffect
  } | null>(null)
  
  const [dotTargetModalOpen, setDotTargetModalOpen] = useState(false)
  const [pendingDotPayload, setPendingDotPayload] = useState<any>(null)
  const [activeCombatId, setActiveCombatId] = useState<number | null>(null)
  const [combatParticipants, setCombatParticipants] = useState<any[]>([])
  const [allyBuffModalOpen, setAllyBuffModalOpen] = useState(false)
  const [pendingAllyBuff, setPendingAllyBuff] = useState<any>(null)
  const [campaignCharacters, setCampaignCharacters] = useState<any[]>([])
  const [selectedAlly, setSelectedAlly] = useState<any>(null)
  
  const [dotRollModalOpen, setDotRollModalOpen] = useState(false)
  const [dotRollTargets, setDotRollTargets] = useState<Array<{ id: number; name: string; isPlayer: boolean }>>([])
  
  const [activeCombatActions, setActiveCombatActions] = useState<any[]>([])
  const activeCombatActionsRef = useRef<any[]>(activeCombatActions)
  useEffect(() => {
    activeCombatActionsRef.current = activeCombatActions
  }, [activeCombatActions])

  // Persistir HP no backend
  useEffect(() => {
    if (characterId && hp !== undefined) {
      axios.put(`/characters/${characterId}/stats`, { currentHp: hp })
    }
  }, [hp])

  // Persistir PE no backend
  useEffect(() => {
    if (characterId && pe !== undefined) {
      axios.put(`/characters/${characterId}/stats`, { currentPe: pe })
    }
  }, [pe])

  // Persistir Sanidade no backend
  useEffect(() => {
    if (characterId && san !== undefined) {
      axios.put(`/characters/${characterId}/stats`, { currentSanity: san })
    }
  }, [san])

  // Persistir perda permanente de sanidade no backend
  useEffect(() => {
    if (characterId) {
      axios.put(`/characters/${characterId}/stats`, { permanentSanityLoss: permSanLoss })
    }
  }, [permSanLoss])

  // Busca inicial de buffs persistidos
  useEffect(() => {
    if (!characterId) return
    axios.get(`/api/characters/${characterId}/active-buffs`)
      .then(({ data }) => {
        const ritualBuffs = data
          .filter((b: any) => b.buffType === 'ritual')
          .map((b: any) => b.data)
        const abilityBuffs = data
          .filter((b: any) => b.buffType === 'ability')
          .map((b: any) => b.data)
        setActiveRitualBuffs(ritualBuffs)
        setActiveAbilityBuffs(abilityBuffs)
      })
      .catch(() => {})
  }, [characterId])

  // Função de sincronização com debounce
  const syncBuffsToServer = useMemo(() => 
    debounce((rituals: any[], abilities: any[]) => {
      if (!characterId) return
      axios.post(`/api/characters/${characterId}/active-buffs/sync`, {
        ritualBuffs: rituals,
        abilityBuffs: abilities,
      }).catch(() => {})
    }, 1000)
  , [characterId])

  // Sincroniza sempre que os buffs mudarem
  useEffect(() => {
    syncBuffsToServer(activeRitualBuffs, activeAbilityBuffs)
  }, [activeRitualBuffs, activeAbilityBuffs, syncBuffsToServer])

  // Damage taken inputs
  const [damageToHp, setDamageToHp] = useState('')
  const [damageToPe, setDamageToPe] = useState('')
  const [damageToSan, setDamageToSan] = useState('')

  // Edit modal state
  const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure()
  const [editStep, setEditStep] = useState(1)
  const [editNex, setEditNex] = useState(character.nex)
  const [editClassId, setEditClassId] = useState<number | null>(character.class?.id || null)
  const [editOriginId, setEditOriginId] = useState<number | null>(character.origin?.id || null)
  const [editName, setEditName] = useState(character.name)
  const [isAddingAbility, setIsAddingAbility] = useState(false)
  const [abilitySearch, setAbilitySearch] = useState('')
  const [isTranscendChoiceOpen, setIsTranscendChoiceOpen] = useState(false)
  const [isAffinityModalOpen, setIsAffinityModalOpen] = useState(false)
  const [isAffinityLoading, setIsAffinityLoading] = useState(false)
  const [isParanormalSelectOpen, setIsParanormalSelectOpen] = useState(false)

  // Roll History Sidebar state
  const [isRollHistoryOpen, setIsRollHistoryOpen] = useState(false)
  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState(false)
  const [campaignRolls, setCampaignRolls] = useState<any[]>([])

  // Buscar histórico de rolagens da campanha
  const loadCampaignRolls = async () => {
    try {
      // Assumindo que o personagem tem uma relations campaign_id
      const response = await axios.get(`/api/characters/${character.id}/campaign-rolls`)
      const formattedRolls = (response.data.rolls || []).map((r: any) => ({
        ...r,
        id: r.id,
        player: r.player_name,
        action: r.action,
        roll: r.roll_expression,
        result: r.result,
        time: new Date(r.rolled_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        isCritical: !!r.is_critical,
        isFail: !!r.is_fail,
        isGM: !!r.is_gm,
        diceValues: r.diceValues || undefined
      }))
      setCampaignRolls(formattedRolls)
    } catch (error) {
      console.error('Erro ao buscar histórico de rolagens:', error)
      // Evita limpar as rolagens locais já feitas na sessão se a API não existir ainda
    }
  }

  const handleClearHistory = () => {
    setIsConfirmClearOpen(true)
  }

  const confirmClearHistory = async () => {
    try {
      await axios.post(`/api/characters/${character.id}/rolls/clear`)
      setCampaignRolls([])
      setIsConfirmClearOpen(false)
    } catch (error) {
      console.error('Erro ao limpar histórico:', error)
    }
  }

  const handleDeleteRoll = async (rollId: string | number) => {
    try {
      await axios.delete(`/api/characters/${character.id}/rolls/${rollId}`)
      setCampaignRolls((prev) => prev.filter((r) => r.id !== rollId))
    } catch (error) {
      console.error('Erro ao excluir rolagem:', error)
    }
  }

  // Carregar rolls quando abre a sidebar ou no mount inicial
  useEffect(() => {
    loadCampaignRolls()
  }, [])

  // Configurar polling de 10 segundos para novas rolagens da campanha
  useEffect(() => {
    const interval = setInterval(() => {
      loadCampaignRolls()
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  // Carregar rolls quando abre a sidebar especificamente (forçar refresh)
  useEffect(() => {
    if (isRollHistoryOpen) {
      loadCampaignRolls()
    }
  }, [isRollHistoryOpen])

  // --- Affinity selection ---------------------------------------------------
  const selectAffinity = (affinity: string) => {
    setIsAffinityLoading(true)
    router.put(
      `/characters/${character.id}/affinity`,
      { affinity },
      {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
          setIsAffinityModalOpen(false)
          setIsAffinityLoading(false)
        },
        onError: () => setIsAffinityLoading(false),
      }
    )
  }
  const [isRitualSelectOpen, setIsRitualSelectOpen] = useState(false)
  const [lastTranscendAbilityId, setLastTranscendAbilityId] = useState<number | null>(null)

  // --- Detecção automática de habilidades ----------------------------------
  const hasAbility = (name: string) =>
    (character.classAbilities || []).some((ca) => ca.classAbility?.name === name)

  // Ocultista
  const hasRitualPotente = hasAbility('Ritual Potente')
  const hasRitualPredileto = hasAbility('Ritual Predileto')
  const hasTatuagemRitualistica = hasAbility('Tatuagem Ritualística')
  const hasMestreEmElemento = hasAbility('Mestre em Elemento')
  const hasCamuflarOcultismo = hasAbility('Camuflar Ocultismo')

  // Especialista
  const hasPerito = hasAbility('Perito')
  const hasEcletico = hasAbility('Eclético')
  const hasEngenhosidade = hasAbility('Engenhosidade')

  // Combatente
  const hasTiroCerteiro = hasAbility('Tiro Certeiro')

  // --- Configuração de Ritual Predileto (nome do ritual configurado) --------
  const ritualPrediletoConfig = useMemo(() => {
    const ca = (character.classAbilities || []).find(
      (ca) => ca.classAbility?.name === 'Ritual Predileto'
    )
    return (ca?.config as { ritualName?: string } | undefined)?.ritualName || null
  }, [character.classAbilities])

  // Elemento configurado para Mestre em Elemento
  const mestreElementoConfig = useMemo(() => {
    const ca = (character.classAbilities || []).find(
      (ca) => ca.classAbility?.name === 'Mestre em Elemento'
    )
    return (ca?.config as { element?: string } | undefined)?.element || null
  }, [character.classAbilities])

  // --- Toggles opcionais de uso de habilidades -----------------------------
  const [usarCamuflar, setUsarCamuflar] = useState(false)

  // --- Trail Config (habilidades de trilha configuráveis) ------------------
  const trailConfig = character.trailConfig || {}

  const abilityEffects = useAbilityEffects({
    classAbilities: character.classAbilities,
    paranormalPowers: character.paranormalPowers,
    originAbilities,
    trailProgressions,
  })

  // Toggles de trilha (estado local sincronizado com backend)
  const [useFlagelo, setUseFlagelo] = useState<boolean>(trailConfig.useFlagelo ?? false)
  const [useLaminaMaldita, setUseLaminaMaldita] = useState<boolean>(
    trailConfig.useLaminaMaldita ?? false
  )
  const [useOcultismoForAttacks, setUseOcultismoForAttacks] = useState<boolean>(
    trailConfig.useOcultismoForAttacks ?? false
  )

  // A Favorita — arma favorita (escolha permanente)
  const favoriteWeaponName: string | null = trailConfig.favoriteWeapon || null

  // Salvar trail config no backend
  const saveTrailConfig = (updates: Record<string, any>) => {
    router.put(`/characters/${character.id}/trail-config`, updates, {
      preserveUrl: true,
      preserveState: true,
      // @ts-ignore
      preserveScroll: true,
    })
  }

  // Toggle handlers que salvam automaticamente
  const toggleFlagelo = (val: boolean) => {
    setUseFlagelo(val)
    saveTrailConfig({ useFlagelo: val })
  }
  const toggleLaminaMaldita = (val: boolean) => {
    setUseLaminaMaldita(val)
    saveTrailConfig({ useLaminaMaldita: val })
  }
  const toggleOcultismoForAttacks = (val: boolean) => {
    setUseOcultismoForAttacks(val)
    saveTrailConfig({ useOcultismoForAttacks: val })
  }

  // Modal de configuração de trilha (A Favorita)
  const {
    isOpen: isTrailConfigModalOpen,
    onOpen: onTrailConfigModalOpen,
    onOpenChange: onTrailConfigModalOpenChange,
  } = useDisclosure()
  const [selectedFavoriteWeapon, setSelectedFavoriteWeapon] = useState<string>(
    favoriteWeaponName || ''
  )
  const [isSavingTrailConfig, setIsSavingTrailConfig] = useState(false)

  const saveTrailConfigModal = () => {
    if (!selectedFavoriteWeapon) return
    setIsSavingTrailConfig(true)
    router.put(
      `/characters/${character.id}/trail-config`,
      { favoriteWeapon: selectedFavoriteWeapon },
      {
        preserveUrl: true,
        // @ts-ignore
        preserveScroll: true,
        onSuccess: () => {
          setIsSavingTrailConfig(false)
          onTrailConfigModalOpenChange()
        },
        onError: () => setIsSavingTrailConfig(false),
      }
    )
  }





  // --- Cálculo de dado do Perito conforme NEX -------------------------------
  const peritoBonus = useMemo(() => {
    if (character.nex >= 85) return { dice: '1d12', cost: 4 }
    if (character.nex >= 55) return { dice: '1d10', cost: 3 }
    if (character.nex >= 25) return { dice: '1d8', cost: 3 }
    return { dice: '1d6', cost: 2 }
  }, [character.nex])

  // Perícias configuradas no Perito
  const peritoSkills = useMemo(() => {
    const ca = (character.classAbilities || []).find((ca) => ca.classAbility?.name === 'Perito')
    return (ca?.config?.selectedSkills as string[] | undefined) || []
  }, [character.classAbilities])

  // Ability configuration modal state
  const {
    isOpen: isAbilityConfigOpen,
    onOpen: onAbilityConfigOpen,
    onOpenChange: onAbilityConfigOpenChange,
  } = useDisclosure()
  const [configuringAbility, setConfiguringAbility] = useState<any>(null)
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [availableSkills, setAvailableSkills] = useState<string[]>([])
  const [isConfiguringAbility, setIsConfiguringAbility] = useState(false)
  const [selectedRitual, setSelectedRitual] = useState<string>('')
  const [selectedElement, setSelectedElement] = useState<string>('')
  
  // Perito PE spending state
  const [peritoPeSpending, setPeritoPeSpending] = useState<Record<string, number>>({})

  // Trail selection modal state
  const {
    isOpen: isTrailModalOpen,
    onOpen: onTrailModalOpen,
    onOpenChange: onTrailModalOpenChange,
  } = useDisclosure()

  // Trail powers dropdown state
  const { isOpen: isTrailPowersOpen, onOpenChange: onTrailPowersOpenChange } = useDisclosure()

  // Ability selection modal state
  const {
    isOpen: isAbilitySelectOpen,
    onOpen: onAbilitySelectOpen,
    onOpenChange: onAbilitySelectOpenChange,
  } = useDisclosure()

  // Add Item modal state
  const {
    isOpen: isAddItemModalOpen,
    onOpen: onAddItemModalOpen,
    onOpenChange: onAddItemModalOpenChange,
  } = useDisclosure()

  // Weapon Modification Modal state
  const {
    isOpen: isModifyWeaponModalOpen,
    onOpen: onModifyWeaponModalOpen,
    onOpenChange: onModifyWeaponModalOpenChange,
  } = useDisclosure()
  const [isTempRitual, setIsTempRitual] = useState(false)
  const [modifyingWeapon, setModifyingWeapon] = useState<any>(null)
  const [modifyingAmmunition, setModifyingAmmunition] = useState<any>(null)
  const [isUpdatingModifications, setIsUpdatingModifications] = useState(false)
  const [modTypeFilter, setModTypeFilter] = useState<'Melhoria' | 'Maldição'>('Melhoria')

  // Ammunition Modification Modal state
  const {
    isOpen: isModifyAmmunitionModalOpen,
    onOpen: onModifyAmmunitionModalOpen,
    onOpenChange: onModifyAmmunitionModalOpenChange,
  } = useDisclosure()

  // RANK AND CATEGORY LIMITS
  const [rank, setRank] = useState(character.rank || 'Recruta')
  const [isUpdatingRank, setIsUpdatingRank] = useState(false)

  const RANK_OPTIONS = [
    'Recruta',
    'Operador',
    'Agente Especial',
    'Oficial de Operações',
    'Agente de Elite',
  ]

  const RANK_LIMITS: Record<string, Record<number, number>> = {
    'Recruta': { 1: 2, 2: 0, 3: 0, 4: 0 },
    'Operador': { 1: 3, 2: 1, 3: 0, 4: 0 },
    'Agente Especial': { 1: 3, 2: 2, 3: 1, 4: 0 },
    'Oficial de Operações': { 1: 3, 2: 3, 3: 2, 4: 1 },
    'Agente de Elite': { 1: 3, 2: 3, 3: 3, 4: 2 },
  }

  const categoryLabels: Record<number, string> = { 0: '0', 1: 'I', 2: 'II', 3: 'III', 4: 'IV' }

  // Persistir Patente no backend
  useEffect(() => {
    if (characterId && rank && rank !== character.rank) {
      setIsUpdatingRank(true)
      router.put(
        `/characters/${characterId}`,
        { rank },
        {
          preserveUrl: true,
          preserveState: true,
          // @ts-ignore
          preserveScroll: true,
          onFinish: () => setIsUpdatingRank(false),
        }
      )
    }
  }, [rank])

  // Check if adding a modification to a weapon would exceed the rank's category limits
  const canApplyModification = (
    weapon: any,
    modCategory: number
  ): { allowed: boolean; reason?: string } => {
    if (!weapon) return { allowed: false, reason: 'Nenhuma arma selecionada.' }
    const limits = RANK_LIMITS[rank] || {}

    // Calcula a categoria base da arma
    const rawBase =
      typeof weapon.category === 'string'
        ? ['I', 'II', 'III', 'IV', 'V'].indexOf(weapon.category) + 1
        : weapon.category || 0

    // Aplica redução de categoria da arma favorita no TOTAL (base + mods)
    const isFavorite = !!favoriteWeaponName && weapon.name === favoriteWeaponName
    const catReduction = isFavorite ? favoriteWeaponCategoryReduction : 0

    const currentModSum =
      weapon.modifications?.reduce((sum: number, m: any) => sum + (m.category || 0), 0) || 0
    const newFinalCategory = Math.max(0, rawBase + currentModSum + modCategory - catReduction)

    if (newFinalCategory > 4) {
      return { allowed: false, reason: `Categoria ${newFinalCategory} não existe.` }
    }

    if (newFinalCategory <= 0) {
      return { allowed: true }
    }

    const limit = limits[newFinalCategory] ?? 0
    const currentUsedOfNewCategory = categoryConsumption[newFinalCategory] || 0

    if (currentUsedOfNewCategory >= limit) {
      const romanCats = ['I', 'II', 'III', 'IV']
      return {
        allowed: false,
        reason: `Limite de ${limit} item(ns) CAT ${romanCats[newFinalCategory - 1]} para patente ${rank} atingido.`,
      }
    }

    return { allowed: true }
  }

  const canApplyAmmunitionModification = (
    ammo: any,
    modCategory: number
  ): { allowed: boolean; reason?: string } => {
    if (!ammo) return { allowed: false, reason: 'Nenhuma munição selecionada.' }
    const limits = RANK_LIMITS[rank] || {}

    const rawBase =
      typeof ammo.category === 'string'
        ? ['I', 'II', 'III', 'IV', 'V'].indexOf(ammo.category) + 1
        : ammo.category || 0

    const currentModSum =
      ammo.modifications?.reduce((sum: number, m: any) => sum + (m.category || 0), 0) || 0
    const newFinalCategory = Math.max(0, rawBase + currentModSum + modCategory)

    if (newFinalCategory > 4) {
      return { allowed: false, reason: `Categoria ${newFinalCategory} não existe.` }
    }

    if (newFinalCategory <= 0) {
      return { allowed: true }
    }

    const limit = limits[newFinalCategory] ?? 0
    const currentUsedOfNewCategory = categoryConsumption[newFinalCategory] || 0

    if (currentUsedOfNewCategory >= limit) {
      const romanCats = ['I', 'II', 'III', 'IV']
      return {
        allowed: false,
        reason: `Limite de ${limit} item(ns) CAT ${romanCats[newFinalCategory - 1]} para patente ${rank} atingido.`,
      }
    }

    return { allowed: true }
  }

  // @ts-ignore
  if (isAddingAbility) {
    /* unused state but kept for now */
  }

  // Skill context menu state
  const {
    isOpen: isSkillMenuOpen,
    onOpen: onSkillMenuOpen,
    onOpenChange: onSkillMenuOpenChange,
  } = useDisclosure()
  const [selectedSkillName, setSelectedSkillName] = useState<string | null>(null)

  // Calculate max PE that can be spent for Perito based on NEX
  const getMaxPeritoPe = () => {
    if (character.nex >= 85) return 5 // NEX 85%+: +1d12
    if (character.nex >= 55) return 4 // NEX 55%+: +1d10
    if (character.nex >= 25) return 3 // NEX 25%+: +1d8
    return 2 // NEX < 25%: +1d6 (base)
  }

  const maxPeritoPe = getMaxPeritoPe()

  // --- Ocultista: créditos de rituais ------------------------------------
  const isOcultista = character.class?.name === 'Ocultista'

  const circuloMaximo = isOcultista
    ? character.nex >= 85
      ? 4
      : character.nex >= 55
        ? 3
        : character.nex >= 25
          ? 2
          : 1
    : character.nex >= 75
      ? 3
      : character.nex >= 45
        ? 2
        : 1

  // Créditos ganhos: 3 iniciais + 1 por nível acima do 1 (level = floor(nex/5))
  const nexLevel = Math.floor(character.nex / 5)
  const creditosGanhos = 3 + Math.max(0, nexLevel - 1)

  // Créditos usados = rituais com ignora_limite_conhecimento = true
  const creditosUsados = (character.rituals || []).filter(
    (r: any) => r.ignoraLimiteConhecimento === true || r.ignora_limite_conhecimento === true
  ).length

  const creditosRestantes = creditosGanhos - creditosUsados

  const openEditModal = (step: number) => {
    setEditStep(step)
    setEditNex(character.nex)
    setEditClassId(character.class?.id || null)
    setEditOriginId(character.origin?.id || null)
    setEditName(character.name)
    onEditOpen()
  }

  // Configure ability functions
  const openAbilityConfig = (ability: any) => {
    setConfiguringAbility(ability)

    // Load available skills (excluding Luta and Pontaria)
    const allSkills = character.skills?.map((s) => s.skill?.name).filter(Boolean) || []
    const available = allSkills.filter((skill) => skill !== 'Luta' && skill !== 'Pontaria')
    setAvailableSkills(available as string[])

    // Load already selected skills if they exist
    if (ability.config?.selectedSkills) {
      setSelectedSkills(ability.config.selectedSkills)
    } else {
      setSelectedSkills([])
    }

    // Load ritual config (Ritual Predileto)
    setSelectedRitual(ability.config?.ritualName || '')

    // Load element config (Mestre em Elemento, Especialista em Elemento)
    setSelectedElement(ability.config?.element || '')

    onAbilityConfigOpen()
  }

  const saveAbilityConfig = async () => {
    if (!configuringAbility) return
    const abilityName = configuringAbility.classAbility?.name

    // Validate for Perito
    if (abilityName === 'Perito' && selectedSkills.length !== 2) {
      addToast({ title: 'Seleção inválida', description: 'Por favor, selecione exatamente 2 perícias para Perito.', color: 'warning', timeout: 4000 })
      return
    }
    // Validate for Ritual Predileto
    if (abilityName === 'Ritual Predileto' && !selectedRitual) {
      addToast({ title: 'Seleção inválida', description: 'Por favor, selecione um ritual.', color: 'warning', timeout: 4000 })
      return
    }
    // Validate for element abilities
    if (
      (abilityName === 'Mestre em Elemento' || abilityName === 'Especialista em Elemento') &&
      !selectedElement
    ) {
      addToast({ title: 'Seleção inválida', description: 'Por favor, selecione um elemento.', color: 'warning', timeout: 4000 })
      return
    }

    const configPayload: Record<string, any> = {}
    if (abilityName === 'Perito') {
      configPayload.selectedSkills = selectedSkills
    } else if (abilityName === 'Ritual Predileto') {
      configPayload.ritualName = selectedRitual
    } else if (abilityName === 'Mestre em Elemento' || abilityName === 'Especialista em Elemento') {
      configPayload.element = selectedElement
    }

    setIsConfiguringAbility(true)
    router.put(`/characters/${character.id}/abilities/${configuringAbility.id}`, configPayload, {
      onSuccess: () => {
        setIsConfiguringAbility(false)
        onAbilityConfigOpenChange()
      },
      onError: (errors) => {
        console.error('Ability configuration failed:', errors)
        setIsConfiguringAbility(false)
      },
    })
  }

  const toggleSkillSelection = (skill: string) => {
    if (
      configuringAbility.classAbility?.name === 'Perito' &&
      selectedSkills.length >= 2 &&
      !selectedSkills.includes(skill)
    ) {
      return // Can't add more than 2 for Perito
    }

    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill))
    } else {
      setSelectedSkills([...selectedSkills, skill])
    }
  }

  const addItemToCharacter = (
    type: 'weapon' | 'protection' | 'general' | 'cursed' | 'ammunition',
    itemId: number,
    quantity?: number,
    chosenSkillBonusName?: string
  ) => {
    // Buscar os espaços que o item ocupa
    let itemSpaces = 0
    const qty = quantity ?? 1

    if (type === 'weapon') {
      const w = catalogWeapons.find((i) => i.id === itemId)
      if (w) itemSpaces = w.spaces || 0
    } else if (type === 'protection') {
      const p = catalogProtections.find((i) => i.id === itemId)
      if (p) itemSpaces = p.spaces || 0
    } else if (type === 'general') {
      const g = catalogGeneralItems.find((i) => i.id === itemId)
      if (g) itemSpaces = g.spaces || 0
    } else if (type === 'cursed') {
      const c = catalogCursedItems.find((i) => i.id === itemId)
      if (c) itemSpaces = c.spaces || 0
    } else if (type === 'ammunition') {
      const a = catalogAmmunitions.find((i) => i.id === itemId)
      if (a) itemSpaces = a.spaces || 0
    }

    const totalAddedSpaces = itemSpaces * qty

    // Validar limites de Categoria
    let itemCategory = 0
    if (type === 'weapon') {
      const w = catalogWeapons.find((i) => i.id === itemId)
      if (w) itemCategory = w.category
    } else if (type === 'protection') {
      const p = catalogProtections.find((i) => i.id === itemId)
      if (p) itemCategory = p.category
    } else if (type === 'general') {
      const g = catalogGeneralItems.find((i) => i.id === itemId)
      if (g) itemCategory = g.category
    } else if (type === 'cursed') {
      const c = catalogCursedItems.find((i) => i.id === itemId)
      if (c) itemCategory = 0 // Maldições geralmente não têm categoria de patente, ou têm?
      // Padronizaremos como cat 0 se não especificado
    } else if (type === 'ammunition') {
      const a = catalogAmmunitions.find((i) => i.id === itemId)
      if (a) itemCategory = a.category
    }

    if (itemCategory > 0) {
      const currentConsumption = categoryConsumption[itemCategory] || 0
      const limit = RANK_LIMITS[rank]?.[itemCategory] ?? 0

      if (currentConsumption + qty > limit) {
        addToast({ 
          title: 'Limite de Categoria atingido', 
          description: `Limite de Categoria ${categoryLabels[itemCategory]} atingido para a patente ${rank}!\nLimite: ${limit} | Atual: ${currentConsumption}`, 
          color: 'warning', 
          timeout: 4000 
        })
        return
      }
    }

    // Validar limite máximo (não pode passar do dobro do limite)
    if (inventoryCapacity.used + totalAddedSpaces > inventoryCapacity.maxCapacity) {
      addToast({ 
        title: 'Limite de carga excedido!', 
        description: `Você só pode carregar até ${inventoryCapacity.maxCapacity} espaços (o dobro do seu limite de ${inventoryCapacity.limit}).`, 
        color: 'warning', 
        timeout: 4000 
      })
      return
    }

    router.post(
      `/characters/${character.id}/items`,
      { 
        type, 
        itemId: Number(itemId), 
        quantity: qty, 
        chosenSkillBonusName: chosenSkillBonusName ?? '' 
      },
      {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
          onAddItemModalOpenChange()
        },
        onError: (errors) => {
          console.error('Erro ao adicionar item:', errors)
          addToast({ title: 'Erro', description: 'Erro ao adicionar item. Verifique se o item existe e tente novamente.', color: 'danger', timeout: 4000 })
        },
      }
    )
  }

  const fetchRoomItems = useCallback(async () => {
    if (!campaignId) return
    try {
      const response = await axios.get(`/api/campaigns/${campaignId}/room-items`)
      setRoomItems(response.data)
    } catch (err) {
      console.error('Erro ao buscar itens da sala:', err)
    }
  }, [campaignId])

  const handleDropInventoryItem = async (itemType: string, itemId: number) => {
    try {
      await axios.post(`/api/characters/${character.id}/drop-item`, { itemType, itemId })
      fetchRoomItems()
      router.reload({ preserveScroll: true, preserveState: true })
    } catch (err) {
      console.error('Erro ao largar item:', err)
    }
  }

  const handlePickupItem = async (roomItemId: number) => {
    try {
      await axios.post(`/api/room-items/${roomItemId}/pickup`, { characterId: character.id })
      fetchRoomItems()
      router.reload({ preserveScroll: true, preserveState: true })
    } catch (err) {
      console.error('Erro ao pegar item:', err)
    }
  }

  const handleRollCombatAction = (damageDice: string, label: string) => {
    const [qtyStr, sidesStr] = damageDice.split('d')
    const qty = parseInt(qtyStr)
    const sides = parseInt(sidesStr)
    diceTrayRef.current?.rollDice(sides, qty, label, 'sum', 0, [])
  }

  const selectTrail = (trailId: number) => {
    router.put(
      `/characters/${character.id}/trail`,
      { trailId },
      {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
          onTrailModalOpenChange()
        },
        onError: (errors) => {
          console.error('Trail selection failed:', errors)
        },
      }
    )
  }

  const addClassAbility = (abilityId: number) => {
    // Check if the ability is "Transcender"
    const ability = availableAbilities?.find((a) => a.id === abilityId)
    if (ability?.name === 'Transcender') {
      setLastTranscendAbilityId(abilityId)
      setIsTranscendChoiceOpen(true)
      onAbilitySelectOpenChange() // Close the current modal
      return
    }

    setIsAddingAbility(true)
    router.post(
      `/characters/${character.id}/abilities`,
      { abilityId },
      {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
          setIsAddingAbility(false)
          onAbilitySelectOpenChange()
        },
        onError: (errors) => {
          setIsAddingAbility(false)
          console.error('Ability addition failed:', errors)
        },
      }
    )
  }

  const addParanormalPower = (powerId: number) => {
    setIsAddingAbility(true)
    router.post(
      `/characters/${character.id}/paranormal-powers`,
      { powerId, transcendAbilityId: lastTranscendAbilityId },
      {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
          setIsAddingAbility(false)
          setIsParanormalSelectOpen(false) // Close the specific modal
          setLastTranscendAbilityId(null)
        },
        onError: () => setIsAddingAbility(false),
      }
    )
  }

  const removeParanormalPower = (powerId: number, characterClassAbilityId?: number | null) => {
    const isTranscend = !!characterClassAbilityId
    const msg = isTranscend
      ? 'Este poder foi adquirido via Transcender. Removê-lo também irá remover o uso de Transcender e restaurar sua Sanidade Máxima. Confirmar?'
      : 'Tem certeza que deseja remover este poder paranormal?'
    if (!confirm(msg)) return
    if (isTranscend) {
      router.delete(`/characters/${character.id}/abilities/${characterClassAbilityId}`, {
        preserveState: true,
        preserveScroll: true,
      })
    } else {
      router.delete(`/characters/${character.id}/paranormal-powers/${powerId}`, {
        preserveState: true,
        preserveScroll: true,
      })
    }
  }

  const addRitual = (ritualId: number) => {
    setIsAddingAbility(true)
    router.post(
      `/characters/${character.id}/rituals`,
      { ritualId, transcendAbilityId: lastTranscendAbilityId },
      {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
          setIsAddingAbility(false)
          setIsRitualSelectOpen(false) // Close the specific modal
          setLastTranscendAbilityId(null)
        },
        onError: () => setIsAddingAbility(false),
      }
    )
  }

  const removeRitual = (ritualId: number, characterClassAbilityId?: number | null) => {
    const isTranscend = !!characterClassAbilityId
    const msg = isTranscend
      ? 'Este ritual foi aprendido via Transcender. Removê-lo também irá remover o uso de Transcender e restaurar sua Sanidade Máxima. Confirmar?'
      : 'Tem certeza que deseja remover este ritual?'
    if (!confirm(msg)) return
    if (isTranscend) {
      router.delete(`/characters/${character.id}/abilities/${characterClassAbilityId}`, {
        preserveState: true,
        preserveScroll: true,
      })
    } else {
      router.delete(`/characters/${character.id}/rituals/${ritualId}`, {
        preserveState: true,
        preserveScroll: true,
      })
    }
  }

  // Toggle Weapon Modification
  const toggleModification = async (
    characterWeaponId: number,
    modificationId: number,
    action: 'add' | 'remove'
  ) => {
    setIsUpdatingModifications(true)

    if (action === 'add') {
      router.post(
        `/characters/${character.id}/weapons/${characterWeaponId}/modifications`,
        { modificationId },
        {
          onSuccess: () => {
            setIsUpdatingModifications(false)
            // Update local state if needed (Inertia will reload usually)
          },
          onError: () => setIsUpdatingModifications(false),
          preserveScroll: true,
          preserveState: true,
        }
      )
    } else {
      router.delete(
        `/characters/${character.id}/weapons/${characterWeaponId}/modifications/${modificationId}`,
        {
          onSuccess: () => {
            setIsUpdatingModifications(false)
          },
          onError: () => setIsUpdatingModifications(false),
          preserveScroll: true,
          preserveState: true,
        }
      )
    }
  }

  // Toggle Ammunition Modification
  const toggleAmmunitionModification = async (
    characterAmmunitionId: number,
    modificationId: number,
    action: 'add' | 'remove'
  ) => {
    setIsUpdatingModifications(true)

    if (action === 'add') {
      router.post(
        `/characters/${character.id}/ammunitions/${characterAmmunitionId}/modifications`,
        { modificationId },
        {
          onSuccess: () => setIsUpdatingModifications(false),
          onError: () => setIsUpdatingModifications(false),
          preserveScroll: true,
          preserveState: true,
        }
      )
    } else {
      router.delete(
        `/characters/${character.id}/ammunitions/${characterAmmunitionId}/modifications/${modificationId}`,
        {
          onSuccess: () => setIsUpdatingModifications(false),
          onError: () => setIsUpdatingModifications(false),
          preserveScroll: true,
          preserveState: true,
        }
      )
    }
  }

  const handleSkillContextMenu = (skillName: string, event: React.MouseEvent) => {
    event.preventDefault()
    setSelectedSkillName(skillName)
    onSkillMenuOpen()
  }

  // Editable attributes state
  const initialAttrs = character.attributes || {
    strength: 1,
    agility: 1,
    intellect: 1,
    vigor: 1,
    presence: 1,
  }
  const [strength, setStrength] = useState(initialAttrs.strength)
  const [agility, setAgility] = useState(initialAttrs.agility)
  const [intellect, setIntellect] = useState(initialAttrs.intellect)
  const [vigor, setVigor] = useState(initialAttrs.vigor)
  const [presence, setPresence] = useState(initialAttrs.presence)
  const { calcPeAjustado, calcConjurationDt, resistDt, calcDamageBonus } = useRitualCalculations({
    nex: character.nex,
    presence,
    intellect,
    hasRitualPredileto,
    ritualPrediletoConfig,
    hasTatuagemRitualistica,
    hasMestreEmElemento,
    mestreElementoConfig,
    hasCamuflarOcultismo,
    usarCamuflar,
    hasRitualPotente,
  })
  const [isSaving, setIsSaving] = useState(false)
  // Ref para expor rollDice / rollWeapon / openDiceTray ao SkillsCard e CharacterTabsCard
  const diceTrayRef = useRef<AttributesDiceTrayCardHandle>(null)

  // Refs para sincronização de logs/cura
  const playerNameRef = useRef(character.name)
  useEffect(() => {
    playerNameRef.current = character.name
  }, [character.name])

  const handleNewRoll = useCallback(
    (roll: any) => {
      // Adicionar localmente para feedback imediato
      setCampaignRolls((prev: any) => [roll, ...prev])

      // Interceptar rolagem de iniciativa se solicitada
      console.log('[INICIATIVA-DEBUG] handleNewRoll chamado:', {
        action: roll.action,
        result: roll.result,
        pendingReaction: pendingReactionRef.current,
        rollType: pendingReactionRef.current?.rollType,
        includes: roll.action?.includes('Iniciativa')
      })
      if (
        pendingReactionRef.current?.rollType === 'Iniciativa' &&
        roll.action && roll.action.includes('Iniciativa')
      ) {
        axios
          .post(`/api/campaigns/${campaignId}/reaction-response`, {
            characterId: character.id,
            type: 'initiative',
            value: roll.result,
          })
          .then(() => {
            setPendingReaction(null)
            pendingReactionRef.current = null
          })
          .catch((err) => console.error('Erro ao responder iniciativa:', err))
      }

      // Persistir no banco de dados
      axios
        .post(`/api/characters/${character.id}/rolls`, {
          action: roll.action,
          roll_expression: roll.roll,
          result: roll.result,
          is_critical: roll.isCritical,
          is_fail: roll.isFail,
          is_gm: roll.isGM,
          diceValues: roll.diceValues ?? null,
        })
        .catch((err) => console.error('Erro ao persistir rolagem:', err))
    },
    [character.id]
  )

  const onNewRollRef = useRef(handleNewRoll)
  useEffect(() => {
    onNewRollRef.current = handleNewRoll
  }, [handleNewRoll])

  // Calculate max HP, PE, and Sanity dynamically based on class, NEX, and attributes
  // Formula: base + level * attribute + (level - 1) * perLevel
  // Level = NEX / 5
  const { maxHp, maxPe, maxSan } = useMemo(() => {
    const level = Math.floor(character.nex / 5)

    // HP calculation: baseHp + level * vigor + (level - 1) * hpPerLevel + ability bonuses
    const baseHp = classInfo?.baseHp || 20
    const hpPerLevel = classInfo?.hpPerLevel || 4
    let calculatedMaxHp = baseHp + level * vigor + (level - 1) * hpPerLevel
    calculatedMaxHp += (abilityEffects?.hpBonusPerNex || 0) * level

    // PE calculation: basePe + level * presence + (level - 1) * pePerLevel + ability bonuses
    const basePe = classInfo?.basePe || 2
    const pePerLevel = classInfo?.pePerLevel || 2
    let calculatedMaxPe = basePe + level * presence + (level - 1) * pePerLevel
    calculatedMaxPe += (abilityEffects?.peBonusFlat || 0)
    calculatedMaxPe += (abilityEffects?.peBonusPerNex || 0) * level

    // Sanity calculation: baseSanity + (level - 1) * sanityPerLevel
    const baseSanity = classInfo?.baseSanity || 12
    const sanityPerLevel = classInfo?.sanityPerLevel || 3
    let calculatedMaxSan = baseSanity + (level - 1) * sanityPerLevel

    // Cada uso de Transcender subtrai sanityPerLevel da sanidade máxima
    const transcendCount = (character.classAbilities || []).filter(
      (ca) => ca.classAbility?.name === 'Transcender'
    ).length
    calculatedMaxSan -= transcendCount * sanityPerLevel

    // Subtrair perda permanente de sanidade
    calculatedMaxSan -= permSanLoss

    return {
      maxHp: calculatedMaxHp,
      maxPe: calculatedMaxPe,
      maxSan: Math.max(0, calculatedMaxSan),
    }
  }, [character.nex, vigor, presence, classInfo, character.classAbilities, permSanLoss, abilityEffects])

  // Ocultismo training degree for ritual roll bonus
  const ocultismoDegree = ((): number => {
    const cs = ((character.skills || []) as any[]).find((s) => s.skill?.name === 'Ocultismo')
    return cs?.trainingDegree ?? 0
  })()

  // Ritual roll deduction callbacks
  const handleDeductPe = (amount: number) => setPe((prev: number) => Math.max(0, prev - amount))
  const handleDeductSan = (amount: number) => setSan((prev: number) => Math.max(0, prev - amount))
  const handleDeductPermSan = (amount: number) => setPermSanLoss((prev: number) => prev + amount)

  // Mapeamento de perícia → atributo base (espelha SkillsCard ALL_SKILLS)
  const SKILL_ATTR: Record<string, string> = {
    Acrobacia: 'AGI',
    Adestramento: 'PRE',
    Artes: 'PRE',
    Atletismo: 'FOR',
    Atualidades: 'INT',
    Ciências: 'INT',
    Crime: 'AGI',
    Diplomacia: 'PRE',
    Enganação: 'PRE',
    Fortitude: 'VIG',
    Furtividade: 'AGI',
    Iniciativa: 'AGI',
    Intimidação: 'PRE',
    Intuição: 'PRE',
    Investigação: 'INT',
    Luta: 'FOR',
    Medicina: 'INT',
    Ocultismo: 'INT',
    Percepção: 'PRE',
    Pilotagem: 'AGI',
    Pontaria: 'AGI',
    Profissão: 'INT',
    Reflexos: 'AGI',
    Religião: 'PRE',
    Sobrevivência: 'INT',
    Tática: 'INT',
    Tecnologia: 'INT',
    Vontade: 'PRE',
  }

  /** Ativa uma habilidade (trilha ou origem): desconta PE e registra buff ativo */
  const handleActivateAbility = (
    abilityName: string,
    source: 'trail' | 'origin' | 'class',
    peCost: number,
    effects: any
  ) => {
    if (peCost > 0) handleDeductPe(peCost)

    // Garante que effects é um objeto (proteção extra caso ainda chegue como string)
    const eff =
      typeof effects === 'string'
        ? (() => {
            try {
              return JSON.parse(effects)
            } catch {
              return {}
            }
          })()
        : effects || {}

    // Infere duration se não presente no effects
    let duration = eff.duration
    if (!duration) {
      if (abilityName === 'Eclético') {
        duration = 'next_test'
      } else if (eff.attack_bonus || eff.damage_bonus || eff.threat_range_bonus) {
        duration = 'next_attack'
      } else if (eff.bonus && (eff.skill_bonus_attr || eff.skill_bonus_target)) {
        duration = 'next_test'
      } else {
        duration = 'scene'
      }
    }

    // Gera effect_label se ausente
    const effectLabel =
      eff.effect_label ||
      (eff.threat_range_bonus ? `+${eff.threat_range_bonus} margem de ameaça` : null) ||
      (eff.attack_bonus && eff.damage_bonus
        ? `+${eff.attack_bonus} atk / +${eff.damage_bonus} dano`
        : null) ||
      (eff.attack_bonus ? `+${eff.attack_bonus} no ataque` : null) ||
      (eff.damage_bonus ? `+${eff.damage_bonus} no dano` : null) ||
      (eff.bonus && eff.skill_bonus_attr
        ? `+${eff.bonus} em ${Array.isArray(eff.skill_bonus_attr) ? eff.skill_bonus_attr.join('/') : eff.skill_bonus_attr}`
        : null) ||
      (eff.bonus ? `+${eff.bonus} bônus` : null) ||
      abilityName

    const enrichedEffects = { ...eff, duration, effect_label: effectLabel }

    if (duration !== 'instant') {
      setActiveAbilityBuffs((prev) => [
        ...prev,
        { id: `${abilityName}-${Date.now()}`, abilityName, source, effects: enrichedEffects },
      ])
    }
    setAbilityUsesThisScene((prev) => ({
      ...prev,
      [abilityName]: (prev[abilityName] ?? 0) + 1,
    }))
  }

  const clearAbilityBuff = (buffId: string) =>
    setActiveAbilityBuffs((prev) => prev.filter((b) => b.id !== buffId))

  const resetSceneUses = () => {
    setAbilityUsesThisScene({})
    setActiveAbilityBuffs([])
  }

  // ── Totais derivados dos buffs ativos de rituais ────────────────────────────
  const ritualDefenseBonus = activeRitualBuffs.reduce((s, b) => s + b.defenseBonus, 0)
  const ritualDodgeBonus = activeRitualBuffs.reduce((s, b) => s + b.dodgeBonus, 0)

  /** Aplica um buff de ritual em si mesmo */
  const applyRitualBuffToSelf = (buff: RitualBuffEffect, chosenAttr?: string, chosenWeapon?: string, chosenElement?: string) => {
    const newBuff = {
      id: `${buff.label}-${Date.now()}`,
      label: buff.label,
      defenseBonus: buff.defenseBonus ?? 0,
      dodgeBonus: buff.dodgeBonus ?? 0,
      tempHp: 0,
      strBonus: 0,
      agiBonus: 0,
      intBonus: 0,
      preBonus: 0,
      healByDamageFactor: buff.healByDamageFactor,
      weaponAttackBonus: buff.weaponAttackBonus,
      weaponDamageBonus: buff.weaponDamageBonus,
      weaponThreatRangeBonus: buff.weaponThreatRangeBonus,
      weaponCritMultiplierBonus: buff.weaponCritMultiplierBonus,
      weaponExtraDamageDice: buff.elementChoice ? '1d6' : buff.weaponExtraDamageDice,
      weaponExtraDamageElement: chosenElement || buff.weaponDamageElement,
      weaponDamageElement: chosenElement || buff.weaponDamageElement,
      weaponType: buff.weaponType,
      buffDuration: buff.buffDuration,
      targetWeaponId: chosenWeapon,
      skillAdvantage: buff.skillAdvantage,
      copies: buff.copies,
      remainingCopies: buff.copies,
      defensePerCopy: buff.defensePerCopy,
      skillBonus: buff.skillBonus,
    }

    // Cura de PV
    if (buff.healDice) {
      const { total, rolls } = rollDiceExpression(buff.healDice)
      const bonusPotente = hasRitualPotente ? intellect : 0
      const curaTotal = total + bonusPotente
      setHp((prev) => {
        const hpAntes = prev
        const hpDepois = Math.min(maxHp, prev + curaTotal)
        const curadoReal = hpDepois - hpAntes
        // Registra no histórico de rolagens
        onNewRollRef.current?.({
          id: `heal-${Date.now()}`,
          player: playerNameRef.current,
          action: `✦ ${buff.label} (Cura)`,
          roll: buff.healDice,
          result: curadoReal,
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          diceValues: rolls,
          isHeal: true,
        })
        return hpDepois
      })
    }

    // PV temporários
    if (buff.tempHp) {
      const { total } = rollDiceExpression(buff.tempHp)
      const bonusPotente = hasRitualPotente ? intellect : 0
      newBuff.tempHp = total + bonusPotente
      setTempHp((prev) => prev + newBuff.tempHp)
    }
    if (buff.tempHpFlat) {
      newBuff.tempHp = buff.tempHpFlat
      setTempHp((prev) => prev + buff.tempHpFlat!)
    }

    // Bônus de atributo diretos no buff (sem escolha)
    if (buff.strBonus) {
      newBuff.strBonus = buff.strBonus
      setStrength((p) => p + buff.strBonus!)
    }
    if (buff.agiBonus) {
      newBuff.agiBonus = buff.agiBonus
      setAgility((p) => p + buff.agiBonus!)
    }
    if (buff.intBonus) {
      newBuff.intBonus = buff.intBonus
      setIntellect((p) => p + buff.intBonus!)
    }
    if (buff.preBonus) {
      newBuff.preBonus = buff.preBonus
      setPresence((p) => p + buff.preBonus!)
    }

    // Bônus de atributo por escolha (Aprimorar Físico / Mente)
    if (buff.attributeChoice && chosenAttr) {
      const bonus = getAttributeBonus(pendingRitualBuff?.version ?? 'base')
      if (chosenAttr === 'str') {
        newBuff.strBonus = bonus
        setStrength((p) => p + bonus)
      }
      if (chosenAttr === 'agi') {
        newBuff.agiBonus = bonus
        setAgility((p) => p + bonus)
      }
      if (chosenAttr === 'int') {
        newBuff.intBonus = bonus
        setIntellect((p) => p + bonus)
      }
      if (chosenAttr === 'pre') {
        newBuff.preBonus = bonus
        setPresence((p) => p + bonus)
      }
    }

    setActiveRitualBuffs((prev) => {
      // Trava de duplicata: remove buff anterior do mesmo ritual antes de adicionar
      const semDuplicata = prev.filter(b => b.label !== newBuff.label)
      
      // Reverte atributos do buff anterior se existia
      const buffAnterior = prev.find(b => b.label === newBuff.label)
      if (buffAnterior) {
        if (buffAnterior.strBonus) setStrength(p => p - buffAnterior.strBonus)
        if (buffAnterior.agiBonus) setAgility(p => p - buffAnterior.agiBonus)
        if (buffAnterior.intBonus) setIntellect(p => p - buffAnterior.intBonus)
        if (buffAnterior.preBonus) setPresence(p => p - buffAnterior.preBonus)
        if (buffAnterior.tempHp) setTempHp(p => Math.max(0, p - buffAnterior.tempHp))
      }
      
      return [...semDuplicata, newBuff]
    })
  }

  /** Callback para cura automática baseada em dano (Hemofagia etc) */
  const handleHealByDamage = useCallback((amount: number, label: string) => {
    setHp((prev) => {
      const hpAntes = prev
      const hpDepois = Math.min(maxHp, prev + amount)
      const curadoReal = hpDepois - hpAntes
      
      if (curadoReal > 0) {
        onNewRollRef.current?.({
          id: `heal-dmg-${Date.now()}`,
          player: playerNameRef.current,
          action: `✦ ${label} (Cura por Dano)`,
          roll: '-',
          result: curadoReal,
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          isHeal: true,
        })
      }
      return hpDepois
    })
  }, [maxHp])

  /** Callback para resultado de dano de arma (Hemofagia Discente etc) */
  const handleWeaponDamageResult = useCallback((dmg: number) => {
    // Verifica se há buff de healByDamageFactor ativo que seja next_attack (Hemofagia)
    const healBuff = activeRitualBuffs.find(b => b.healByDamageFactor && b.buffDuration === 'next_attack')
    if (healBuff) {
      handleHealByDamage(Math.floor(dmg * healBuff.healByDamageFactor!), healBuff.label)
    }
  }, [activeRitualBuffs, handleHealByDamage])

  const updateRitualBuff = (buffId: string, updates: Partial<ActiveRitualBuff>) => {
    setActiveRitualBuffs((prev) =>
      prev.map((b) => (b.id === buffId ? { ...b, ...updates } : b))
    )
  }

  /** Remove um buff ativo pelo id */
  const removeRitualBuff = (buffId: string) => {
    setActiveRitualBuffs((prev) => {
      const removed = prev.find((b) => b.id === buffId)
      if (removed) {
        if (removed.tempHp > 0) setTempHp((t) => Math.max(0, t - removed.tempHp))
        if (removed.strBonus) setStrength((p) => p - removed.strBonus)
        if (removed.agiBonus) setAgility((p) => p - removed.agiBonus)
        if (removed.intBonus) setIntellect((p) => p - removed.intBonus)
        if (removed.preBonus) setPresence((p) => p - removed.preBonus)
      }
      return prev.filter((b) => b.id !== buffId)
    })
  }

  /** Remove todos os buffs ativos (fim de cena) */
  const clearAllRitualBuffs = () => {
    setActiveRitualBuffs((prev) => {
      const totStr = prev.reduce((s, b) => s + b.strBonus, 0)
      const totAgi = prev.reduce((s, b) => s + b.agiBonus, 0)
      const totInt = prev.reduce((s, b) => s + b.intBonus, 0)
      const totPre = prev.reduce((s, b) => s + b.preBonus, 0)
      if (totStr) setStrength((p) => p - totStr)
      if (totAgi) setAgility((p) => p - totAgi)
      if (totInt) setIntellect((p) => p - totInt)
      if (totPre) setPresence((p) => p - totPre)

      // Força sincronização imediata após limpar todos os buffs
      if (characterId) {
        axios.post(`/api/characters/${characterId}/active-buffs/sync`, {
          ritualBuffs: [],
          abilityBuffs: [],
        }).catch(() => {})
      }

      return []
    })
    setTempHp(0)
  }
  
  const handleDeactivateCombatAction = (actionId: string) => {
    setActiveCombatActions(prev => prev.filter(a => a.id !== actionId))
  }

  /** Handler para ações de ritual vindas do banco (ritual_actions.action_payload) */
  const handleRitualAction = (actionPayload: any) => {
    console.log('[DEBUG] handleRitualAction chamado:', actionPayload)

    if (actionPayload.type === 'combatAction' || actionPayload.type === 'sustainedCombatAction') {
      const newAction = {
        id: `${actionPayload.label}-${Date.now()}`,
        label: actionPayload.label,
        damageDice: actionPayload.damageDice,
        damageElement: actionPayload.damageElement,
        sustainCostPerTurn: actionPayload.sustainCostPerTurn,
        duration: actionPayload.duration,
        type: actionPayload.type
      }
      setActiveCombatActions(prev => {
        const semDuplicata = prev.filter(a => a.label !== newAction.label)
        return [...semDuplicata, newAction]
      })
      return
    }

    if (actionPayload.type === 'weaponBuff') {
      handleRitualBuffSuccess({
        label: actionPayload.label,
        weaponExtraDamageDice: actionPayload.weaponExtraDamageDice,
        weaponDamageElement: actionPayload.weaponDamageElement,
        buffDuration: actionPayload.buffDuration,
        selfOnly: actionPayload.selfOnly
      })
      return
    }
    if (actionPayload.type === 'dotDebuff') {
      const startRitualFlow = (combatId: number) => {
        axios.get(`/api/combats/${combatId}/participants`)
          .then(res => {
            setCombatParticipants(res.data)
            setPendingDotPayload(actionPayload)
            setDotTargetModalOpen(true)
          })
          .catch(err => {
            console.error('[DoT] Erro ao carregar participantes:', err)
            addToast({ title: 'Erro', description: 'Não foi possível carregar os participantes do combate.', color: 'danger' })
          })
      }

      if (activeCombatId) {
        startRitualFlow(activeCombatId)
      } else if (campaignId) {
        // Tentar buscar o combate ativo da campanha se não tivermos no state
        axios.get(`/api/campaigns/${campaignId}/active-combat`)
          .then(res => {
            if (res.data && res.data.id) {
              setActiveCombatId(res.data.id)
              startRitualFlow(res.data.id)
            } else {
              addToast({ title: 'Aviso', description: 'O combate precisa estar ativo para usar este ritual.', color: 'warning' })
            }
          })
          .catch(() => {
            addToast({ title: 'Aviso', description: 'O combate precisa estar ativo para usar este ritual.', color: 'warning' })
          })
      } else {
        addToast({ title: 'Aviso', description: 'O combate precisa estar ativo para usar este ritual.', color: 'warning' })
      }
      return
    }
    // Outros tipos de payload podem ser adicionados aqui no futuro (ex: damage, heal, etc)
  }

  const handleDotTargetConfirm = async (participantId: number, isPlayer: boolean) => {
    if (!pendingDotPayload) return

    try {
      await axios.patch(`/api/combat-participants/${participantId}/debuff`, {
        debuff: {
          type: 'esquentar',
          casterId: character.id,
          damageDice: pendingDotPayload.turnDamageDice,
          element: pendingDotPayload.damageElement,
          targetIsPlayer: isPlayer
        }
      })
      addToast({ title: 'Sucesso', description: 'Ritual aplicado ao alvo.', color: 'success' })
    } catch (err) {
      console.error('[DoT] Erro ao aplicar debuff:', err)
      addToast({ title: 'Erro', description: 'Falha ao aplicar ritual ao alvo.', color: 'danger' })
    }

    setDotTargetModalOpen(false)
    setPendingDotPayload(null)
  }

  const handleAllyBuffConfirm = async (allyId: number, chosenWeaponId?: string, chosenElement?: string) => {
    if (!pendingAllyBuff) return

    const { buff } = pendingAllyBuff
    const effects: any = { ...buff.effects }

    if (buff.label === 'Amaldiçoar Arma' || buff.ritualName === 'Amaldiçoar Arma') {
      effects.damageBonus = '1d6'
      if (chosenElement) effects.element = chosenElement
    }

    if (buff.attribute && buff.attributeBonus) effects[buff.attribute] = buff.attributeBonus
    if (buff.defenseBonus) effects.defense = buff.defenseBonus
    if (buff.dodgeBonus) effects.dodge = buff.dodgeBonus
    if (buff.weaponExtraDamageDice) effects.weaponExtraDamageDice = buff.weaponExtraDamageDice
    if (buff.weaponAttackBonus) effects.weaponAttackBonus = buff.weaponAttackBonus
    if (chosenElement && !effects.element) effects.damageElement = chosenElement
    else if (buff.damageElement && !effects.element) effects.damageElement = buff.damageElement

    const targetType = chosenWeaponId ? 'weapon' : 'character'
    const targetId = chosenWeaponId ? parseInt(chosenWeaponId) : allyId

    const payload = {
      buff: {
        ...buff,
        target_type: targetType,
        target_id: targetId,
        effects
      },
      casterName: character.name
    }

    try {
      await axios.post(`/api/characters/${allyId}/receive-buff`, payload)
      setAllyBuffModalOpen(false)
      setPendingAllyBuff(null)
      addToast({ title: 'Buff Aplicado', description: `${buff.label} enviado para o aliado.`, color: 'success' })
    } catch (err) {
      addToast({ title: 'Erro', description: 'Falha ao enviar buff.', color: 'danger' })
    }
  }

  const handleDotRoll = (targetId: number, isPlayer: boolean, onSuccess: () => void) => {
    diceTrayRef.current?.openDiceTray()
    diceTrayRef.current?.rollDice(
      6,
      1,
      `Esquentar`,
      'sum',
      0,
      [],
      async (damage: number) => {
        if (!isPlayer) {
          try {
            await axios.patch(`/api/combat-participants/${targetId}/damage`, {
              damage,
              damageType: 'Fogo'
            })
          } catch (err) {
            console.error('[DoT] Erro ao aplicar dano:', err)
            addToast({ 
              title: 'Erro', 
              description: 'Falha ao sincronizar dano com o servidor.', 
              color: 'danger' 
            })
          }
        } else {
          addToast({
            title: 'Ritual Esquentar',
            description: `🔥 Alvo sofre ${damage} de dano de fogo. Desconte manualmente.`,
            color: 'warning'
          })
        }
        
        // Notifica o modal que a rolagem terminou
        onSuccess()
      }
    )
  }

  const activeCombatParticipantId = combatParticipants.find(p => p.characterId === character.id)?.id

  const handleDropItem = async () => {
    if (!activeCombatParticipantId) return
    try {
      await axios.delete(`/api/combat-participants/${activeCombatParticipantId}/debuff/esquentar`)
      addToast({ title: 'Sucesso', description: 'Você largou o objeto e parou de queimar.', color: 'success' })
    } catch (e) {
      console.error('[DROP] Erro ao largar objeto:', e)
    }
  }

  /** Callback chamado quando um ritual de buff é conjurado com sucesso */
  const handleRitualBuffSuccess = (
    ritualNameOrPayload: string | any,
    version: 'base' | 'discente' | 'verdadeiro' = 'base'
  ) => {
    console.log('[DEBUG] handleRitualBuffSuccess chamado para:', ritualNameOrPayload, version)
    try {
      let buff: RitualBuffEffect | undefined
      let ritualName: string
      
      if (typeof ritualNameOrPayload === 'object') {
        buff = ritualNameOrPayload as RitualBuffEffect
        ritualName = buff.label || 'Buff de Ritual'
      } else {
        ritualName = ritualNameOrPayload
        buff = getRitualBuff(ritualName, version)
      }
      
      console.log('[DEBUG] buff retornado:', buff)
      
      if (!buff) {
        console.warn('[DEBUG] Nenhum buff encontrado para:', ritualName, version)
        return
      }



      const hasEffect =
        buff.defenseBonus ||
        buff.dodgeBonus ||
        buff.tempHp ||
        buff.tempHpFlat ||
        buff.healDice ||
        buff.healByDamageFactor ||
        buff.weaponExtraDamageDice ||
        buff.weaponAttackBonus ||
        buff.weaponDamageBonus ||
        buff.weaponThreatRangeBonus ||
        buff.weaponCritMultiplierBonus ||
        buff.skillAdvantage?.length ||
        buff.elementChoice ||
        buff.tempModification ||
        buff.skillBonus ||
        (buff.attributeChoice?.length ?? 0) > 0

      if (!hasEffect) {
        console.log('[DEBUG] Ritual sem efeitos de buff automáticos.')
        return
      }

      const hasWeaponChoice = !!(buff.weaponExtraDamageDice || buff.weaponAttackBonus || buff.elementChoice)

      if (buff.tempModification) {
        // Para Amaldiçoar Tecnologia, precisamos primeiro escolher a arma no RitualBuffModal
        // antes de abrir o ModificationModal.
        console.log('[DEBUG] Abrindo RitualBuffModal para escolha de arma (tempModification)')
        setPendingRitualBuff({ ritualName, version, buff })
        setIsRitualBuffModalOpen(true)
        return
      }

      if (!hasWeaponChoice && buff.selfOnly && !buff.attributeChoice?.length) {
        console.log('[DEBUG] Aplicando buff diretamente no self')
        applyRitualBuffToSelf(buff)
      } else {
        console.log('[DEBUG] Abrindo modal de buff de ritual')
        setPendingRitualBuff({ ritualName, version, buff })
        setIsRitualBuffModalOpen(true)
      }
    } catch (err) {
      console.error('[DEBUG] ERRO em handleRitualBuffSuccess:', err)
    }
  }

  // Filter trail progressions by current NEX
  const { currentTrailAbilities, futureTrailAbilities } = useMemo(() => {
    const current = trailProgressions.filter((prog) => prog.nex <= character.nex)
    const future = trailProgressions.filter((prog) => prog.nex > character.nex)
    return { currentTrailAbilities: current, futureTrailAbilities: future }
  }, [trailProgressions, character.nex])

  // Calcula a redução de categoria para a arma favorita (trilha Aniquilador)
  // A Favorita (NEX 10): -1 | Técnica Secreta (NEX 40): -2 | Máquina de Matar (NEX 99): -3
  const favoriteWeaponCategoryReduction = useMemo(() => {
    if (!favoriteWeaponName) return 0
    const isAniquilador = character.trail?.name === 'Aniquilador'
    if (!isAniquilador) return 0
    // Verifica as progressões obtidas para determinar redução máxima
    const obtained = trailProgressions.filter((p) => p.nex <= character.nex)
    let reduction = 0
    for (const prog of obtained) {
      if (prog.title === 'Máquina de Matar') {
        reduction = 3
        break
      }
      if (prog.title === 'Técnica Secreta') {
        reduction = 2
      }
      if (prog.title === 'A Favorita' && reduction < 1) {
        reduction = 1
      }
    }
    return reduction
  }, [favoriteWeaponName, character.trail?.name, character.nex, trailProgressions])

  // Calculate how many class abilities can be chosen (1 per 15% NEX) and how many are already chosen
  const { maxClassAbilities, chosenClassAbilities, canChooseMore } = useMemo(() => {
    // Count how many non-mandatory abilities are already chosen
    const nonMandatory =
      character.classAbilities?.filter((ability) => {
        const effects =
          typeof ability.classAbility?.effects === 'string'
            ? JSON.parse(ability.classAbility?.effects || '{}')
            : ability.classAbility?.effects || {}
        return effects.mandatory !== true
      }) || []

    // Calculate max based on NEX (1 per 15%)
    const max = Math.floor(character.nex / 15)
    const canChoose = max > nonMandatory.length

    return {
      maxClassAbilities: max,
      chosenClassAbilities: nonMandatory.length,
      canChooseMore: canChoose,
    }
  }, [character.classAbilities, character.nex])

  // Track if HP/PE/San was at max, so when max increases, current also increases
  const [prevMaxHp, setPrevMaxHp] = useState(maxHp)
  const [prevMaxPe, setPrevMaxPe] = useState(maxPe)
  const [prevMaxSan, setPrevMaxSan] = useState(maxSan)

  useEffect(() => {
    // If HP was at max and max increased, keep it at max
    if (hp === prevMaxHp && maxHp > prevMaxHp) {
      setHp(maxHp)
    }
    // If max decreased and HP is above new max, cap it
    else if (hp > maxHp) {
      setHp(maxHp)
    }
    setPrevMaxHp(maxHp)
  }, [maxHp])

  useEffect(() => {
    // If PE was at max and max increased, keep it at max
    if (pe === prevMaxPe && maxPe > prevMaxPe) {
      setPe(maxPe)
    }
    // If max decreased and PE is above new max, cap it
    else if (pe > maxPe) {
      setPe(maxPe)
    }
    setPrevMaxPe(maxPe)
  }, [maxPe])

  useEffect(() => {
    // If Sanity was at max and max increased, keep it at max
    if (san === prevMaxSan && maxSan > prevMaxSan) {
      setSan(maxSan)
    }
    // If Sanity was at max and max decreased, reduce current accordingly
    else if (san === prevMaxSan && maxSan < prevMaxSan) {
      setSan(maxSan)
    }
    // If max decreased and Sanity is above new max, cap it
    else if (san > maxSan) {
      setSan(maxSan)
    }
    setPrevMaxSan(maxSan)
  }, [maxSan])

  // Aplica dano consumindo PV temporários primeiro, depois PV real
  const takeDamage = (amount: number) => {
    let remaining = amount
    if (tempHp > 0) {
      const absorbed = Math.min(tempHp, remaining)
      setTempHp((prev) => Math.max(0, prev - absorbed))
      remaining -= absorbed
    }
    if (remaining > 0) {
      setHp((prev) => Math.max(0, prev - remaining))
    }
  }

  // Apply damage to HP based on damage input
  const applyDamageHp = () => {
    const appliedDamage = Math.max(0, Number(damageToHp) || 0)
    takeDamage(appliedDamage)
    setDamageToHp('')
  }

  // Aplica gasto de PE consumindo PE temporários primeiro
  const takePeDamage = (amount: number) => {
    let remaining = amount
    if (tempPe > 0) {
      const absorbed = Math.min(tempPe, remaining)
      setTempPe((prev) => Math.max(0, prev - absorbed))
      remaining -= absorbed
    }
    if (remaining > 0) {
      setPe((prev) => Math.max(0, prev - remaining))
    }
  }

  // Apply damage to PE based on damage input
  const applyDamagePe = () => {
    const appliedDamage = Math.max(0, Number(damageToPe) || 0)
    takePeDamage(appliedDamage)
    setDamageToPe('')
  }

  // Apply damage to Sanity based on damage input
  const applyDamageSan = () => {
    const appliedDamage = Math.max(0, Number(damageToSan) || 0)
    setSan((prevSan) => Math.max(0, prevSan - appliedDamage))
    setDamageToSan('')
  }

  const isMundano = character.nex === 0 || character.class?.name === 'Mundano'
  const baseAttrPoints = isMundano ? 3 : 4
  const maxAttrValue = isMundano ? 3 : 5

  // Calculate available points: base + NEX bonus + 1 for each attribute at 0
  // All attributes start at 1 (base). Points spent = value above 1. Reducing to 0 gives +1 bonus.
  const { usedPoints, availablePoints } = useMemo(() => {
    const attrs = [strength, agility, intellect, vigor, presence]
    const base = baseAttrPoints + (isMundano ? 0 : attributeBonusFromNex)
    const zeroBonus = attrs.filter((v) => v === 0).length
    const total = base + zeroBonus
    // Points used = sum of (value - 1) for each attribute, counting 0 as -1 (gives back a point)
    const used = attrs.reduce((sum, v) => sum + (v - 1), 0)
    return { totalPoints: total, usedPoints: used, availablePoints: total - used }
  }, [strength, agility, intellect, vigor, presence, attributeBonusFromNex])

  // Check if attributes changed from initial
  const hasChanges =
    strength !== initialAttrs.strength ||
    agility !== initialAttrs.agility ||
    intellect !== initialAttrs.intellect ||
    vigor !== initialAttrs.vigor ||
    presence !== initialAttrs.presence

  // Combined attrs object for display

  // Calculate available skills based on class and intellect
  // Especialista: 7 + intelecto escolhidas livremente + perícias da origem
  // Combatente: 1 + intelecto escolhidas livremente + perícias da origem + (Luta OU Pontaria) + (Fortitude OU Reflexos)
  // Ocultista: 3 + intelecto escolhidas livremente + perícias da origem + Ocultismo + Vontade (automáticas)
  const baseSkills =
    character.class?.name === 'Especialista'
      ? 7
      : character.class?.name === 'Ocultista'
        ? 3
        : character.class?.name === 'Combatente'
          ? 2
          : 0
  const totalSkillsAllowed = baseSkills + intellect

  // Get skills provided by origin from origin data
  const originSkillsFromOrigin = useMemo(() => {
    if (!character.origin?.trainedSkills) return []
    const skills =
      typeof character.origin.trainedSkills === 'string'
        ? JSON.parse(character.origin.trainedSkills || '[]')
        : character.origin.trainedSkills || []
    return skills as string[]
  }, [character.origin?.trainedSkills])

  // Class mandatory skills (automatic, cannot be removed)
  const classMandatorySkills = useMemo(() => {
    if (character.class?.name === 'Ocultista') return ['Ocultismo', 'Vontade']
    return []
  }, [character.class?.name])

  // Class choice skill pools for Combatente
  const classSkillPools = useMemo(() => {
    if (character.class?.name === 'Combatente') {
      return [
        { name: 'Combate', skills: ['Luta', 'Pontaria'], required: 1 },
        { name: 'Defesa', skills: ['Fortitude', 'Reflexos'], required: 1 },
      ]
    }
    return []
  }, [character.class?.name])

  // Count skills provided by origin
  const originProvidedSkills = originSkillsFromOrigin.length

  // Available skills to choose freely = base + intellect (origin and class skills are ADDITIONAL)
  const availableSkillsToChoose = totalSkillsAllowed

  // Calculate available veteran skills (+10) based on class and intellect (unlocked at NEX 35%)
  const baseUpgradesAllowed =
    character.class?.name === 'Especialista'
      ? 7
      : character.class?.name === 'Ocultista'
        ? 3
        : character.class?.name === 'Combatente'
          ? 2
          : 0
  const totalVeteranSkillsAllowed = character.nex >= 35 ? baseUpgradesAllowed + intellect : 0

  // Calculate available expert skills (+15) based on class and intellect (unlocked at NEX 70%)
  const totalExpertSkillsAllowed = character.nex >= 70 ? baseUpgradesAllowed + intellect : 0

  const [isLearningSkills, setIsLearningSkills] = useState(false)

  // Initialize trained skills from database (trainingDegree 5 = trained, 10 = veteran)
  // Use useMemo to prevent recalculation on every render
  const initialTrainedSkills = useMemo(
    () =>
      (character.skills || [])
        .filter((cs: any) => cs.trainingDegree >= 5)
        .map((cs: any) => cs.skill?.name)
        .filter(Boolean),
    [character.skills]
  )
  const initialVeteranSkills = useMemo(
    () =>
      (character.skills || [])
        .filter((cs: any) => cs.trainingDegree >= 10)
        .map((cs: any) => cs.skill?.name)
        .filter(Boolean),
    [character.skills]
  )

  const initialExpertSkills = useMemo(
    () =>
      (character.skills || [])
        .filter((cs: any) => cs.trainingDegree >= 15)
        .map((cs: any) => cs.skill?.name)
        .filter(Boolean),
    [character.skills]
  )

  const [trainedSkills, setTrainedSkills] = useState<string[]>(initialTrainedSkills)
  const [veteranSkills, setVeteranSkills] = useState<string[]>(initialVeteranSkills)
  const [expertSkills, setExpertSkills] = useState<string[]>(initialExpertSkills)
  const [skillFilter, setSkillFilter] = useState<string>('Todos')
  const [showSkillInfo, setShowSkillInfo] = useState<boolean>(true)

  // Ensure trained skills don't exceed the limit if intellect decreases
  useEffect(() => {
    if (trainedSkills.length === 0 && initialTrainedSkills.length > 0) {
      // First mount - don't run the limiter yet
      return
    }
    setTrainedSkills((prev) => {
      const allClassPoolSkills = classSkillPools.flatMap((pool) => pool.skills)
      const lockedSkills = [...originSkillsFromOrigin, ...classMandatorySkills]

      // Regular chosen skills (not locked, not from pools)
      const regularChosenSkills = prev.filter(
        (skill) => !lockedSkills.includes(skill) && !allClassPoolSkills.includes(skill)
      )

      // Calculate extra pool skills (beyond required per pool)
      const extraPoolSkills = classSkillPools.reduce((sum, pool) => {
        const poolSkillsChosen = prev.filter((skill) => pool.skills.includes(skill))
        return sum + Math.max(0, poolSkillsChosen.length - pool.required)
      }, 0)

      // Total "paid" skills
      const paidSkillsCount = regularChosenSkills.length + extraPoolSkills

      if (paidSkillsCount > availableSkillsToChoose) {
        // Need to remove some skills - prioritize keeping regular skills, remove extras from pools first
        let toRemove = paidSkillsCount - availableSkillsToChoose
        let newSkills = [...prev]

        // First, remove extra pool skills
        for (const pool of classSkillPools) {
          if (toRemove <= 0) break
          const poolSkillsChosen = newSkills.filter((skill) => pool.skills.includes(skill))
          while (poolSkillsChosen.length > pool.required && toRemove > 0) {
            const skillToRemove = poolSkillsChosen.pop()
            if (skillToRemove) {
              newSkills = newSkills.filter((s) => s !== skillToRemove)
              toRemove--
            }
          }
        }

        // Then remove regular skills if still needed
        if (toRemove > 0) {
          const regularToKeep = regularChosenSkills.slice(0, regularChosenSkills.length - toRemove)
          newSkills = newSkills.filter(
            (skill) =>
              lockedSkills.includes(skill) ||
              allClassPoolSkills.includes(skill) ||
              regularToKeep.includes(skill)
          )
        }

        return newSkills
      }
      return prev
    })
  }, [availableSkillsToChoose, originSkillsFromOrigin, classMandatorySkills, classSkillPools])

  // Ensure veteran skills don't exceed the limit
  useEffect(() => {
    setVeteranSkills((prev) => prev.slice(0, totalVeteranSkillsAllowed))
  }, [totalVeteranSkillsAllowed])

  // Ensure expert skills don't exceed the limit
  useEffect(() => {
    setExpertSkills((prev) => prev.slice(0, totalExpertSkillsAllowed))
  }, [totalExpertSkillsAllowed])

  // Auto-train class mandatory skills (e.g., Ocultismo + Vontade for Ocultista)
  useEffect(() => {
    if (classMandatorySkills.length > 0) {
      setTrainedSkills((prev) => {
        const missingSkills = classMandatorySkills.filter((skill) => !prev.includes(skill))
        if (missingSkills.length > 0) {
          return [...prev, ...missingSkills]
        }
        return prev
      })
    }
  }, [classMandatorySkills])

  // Save skills to database
  const [isSavingSkills, setIsSavingSkills] = useState(false)

  const saveSkills = async () => {
    setIsSavingSkills(true)
    router.put(
      `/characters/${character.id}/skills`,
      {
        trainedSkills,
        veteranSkills,
        expertSkills,
      },
      {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
          setIsLearningSkills(false)
        },
        onError: (errors) => {
          console.error('Skill save failed:', errors)
        },
        onFinish: () => {
          setIsSavingSkills(false)
        },
      }
    )
  }

  const toggleSkillTraining = (skillName: string) => {
    if (!isLearningSkills) return

    const isTrained = trainedSkills.includes(skillName)
    const isVeteran = veteranSkills.includes(skillName)
    const isExpert = expertSkills.includes(skillName)
    const isFromOrigin = originSkillsFromOrigin.includes(skillName)
    const isClassMandatory = classMandatorySkills.includes(skillName)
    const isLocked = isFromOrigin || isClassMandatory

    // Check if skill is from a class pool (Combatente)
    const skillPool = classSkillPools.find((pool) => pool.skills.includes(skillName))
    const allClassPoolSkills = classSkillPools.flatMap((pool) => pool.skills)

    // Count skills chosen from each class pool
    const getPoolChosenCount = (pool: (typeof classSkillPools)[0]) =>
      trainedSkills.filter((skill) => pool.skills.includes(skill)).length

    // Count extra pool skills (beyond required, these cost regular skill points)
    const extraPoolSkills = classSkillPools.reduce((sum, pool) => {
      const count = getPoolChosenCount(pool)
      return sum + Math.max(0, count - pool.required)
    }, 0)

    // Count user-chosen skills (not from origin, class mandatory)
    const lockedSkills = [...originSkillsFromOrigin, ...classMandatorySkills]
    const regularChosenSkills = trainedSkills.filter(
      (skill) => !lockedSkills.includes(skill) && !allClassPoolSkills.includes(skill)
    )

    // Total "paid" skills = regular skills + extra pool skills
    const paidSkillsCount = regularChosenSkills.length + extraPoolSkills

    if (!isTrained) {
      // Not trained -> Train it
      if (skillPool) {
        // This is a class pool skill (Combatente)
        const poolChosenCount = getPoolChosenCount(skillPool)
        if (poolChosenCount < skillPool.required) {
          // First choice from pool is FREE
          setTrainedSkills((prev) => [...prev, skillName])
        } else if (paidSkillsCount < availableSkillsToChoose) {
          // Can add as extra (costs a skill point)
          setTrainedSkills((prev) => [...prev, skillName])
        }
      } else if (paidSkillsCount < availableSkillsToChoose) {
        // Regular skill and within limit
        setTrainedSkills((prev) => [...prev, skillName])
      }
    } else if (isTrained && !isVeteran && character.nex >= 35) {
      // Trained -> Make Veteran (if limit allows)
      if (veteranSkills.length < totalVeteranSkillsAllowed) {
        setVeteranSkills((prev) => [...prev, skillName])
      } else {
        // If can't make veteran, try to untrain (unless locked)
        if (!isLocked) {
          if (skillPool) {
            const poolChosenCount = getPoolChosenCount(skillPool)
            if (poolChosenCount > skillPool.required) {
              setTrainedSkills((prev) => prev.filter((s) => s !== skillName))
            }
          } else {
            setTrainedSkills((prev) => prev.filter((s) => s !== skillName))
          }
        }
      }
    } else if (isVeteran && !isExpert && character.nex >= 70) {
      // Veteran -> Make Expert (if limit allows)
      if (expertSkills.length < totalExpertSkillsAllowed) {
        setExpertSkills((prev) => [...prev, skillName])
      } else {
        // Se não puder fazer expert, volta para treinado ou remove conforme as regras de bloqueio
        setVeteranSkills((prev) => prev.filter((s) => s !== skillName))
        if (!isLocked) {
          setTrainedSkills((prev) => prev.filter((s) => s !== skillName))
        }
      }
    } else if (isExpert) {
      // Expert -> Untrain or Downgrade
      setExpertSkills((prev) => prev.filter((s) => s !== skillName))
      setVeteranSkills((prev) => prev.filter((s) => s !== skillName))
      if (!isLocked) {
        setTrainedSkills((prev) => prev.filter((s) => s !== skillName))
      }
    } else if (isVeteran) {
      // Veteran -> Untrain or Downgrade (se NEX < 70 ou sem slots de Expert)
      if (isLocked) {
        setVeteranSkills((prev) => prev.filter((s) => s !== skillName))
      } else {
        setVeteranSkills((prev) => prev.filter((s) => s !== skillName))
        setTrainedSkills((prev) => prev.filter((s) => s !== skillName))
      }
    } else if (!isLocked) {
      // Trained (but not Veteran) -> Untrain completely
      if (skillPool) {
        const poolChosenCount = getPoolChosenCount(skillPool)
        if (poolChosenCount > skillPool.required) {
          setTrainedSkills((prev) => prev.filter((s) => s !== skillName))
        } else {
          setTrainedSkills((prev) => prev.filter((s) => s !== skillName))
        }
      } else {
        setTrainedSkills((prev) => prev.filter((s) => s !== skillName))
      }
    }
  }

  const allSkills = [
    { name: 'Acrobacia', attr: 'AGI' },
    { name: 'Adestramento', attr: 'PRE' },
    { name: 'Artes', attr: 'PRE' },
    { name: 'Atletismo', attr: 'FOR' },
    { name: 'Atualidades', attr: 'INT' },
    { name: 'Ciências', attr: 'INT' },
    { name: 'Crime', attr: 'AGI' },
    { name: 'Diplomacia', attr: 'PRE' },
    { name: 'Enganação', attr: 'PRE' },
    { name: 'Fortitude', attr: 'VIG' },
    { name: 'Furtividade', attr: 'AGI' },
    { name: 'Iniciativa', attr: 'AGI' },
    { name: 'Intimidação', attr: 'PRE' },
    { name: 'Intuição', attr: 'PRE' },
    { name: 'Investigação', attr: 'INT' },
    { name: 'Luta', attr: 'FOR' },
    { name: 'Medicina', attr: 'INT' },
    { name: 'Ocultismo', attr: 'INT' },
    { name: 'Percepção', attr: 'PRE' },
    { name: 'Pilotagem', attr: 'AGI' },
    { name: 'Pontaria', attr: 'AGI' },
    { name: 'Profissão', attr: 'INT' },
    { name: 'Reflexos', attr: 'AGI' },
    { name: 'Religião', attr: 'PRE' },
    { name: 'Sobrevivência', attr: 'INT' },
    { name: 'Tática', attr: 'INT' },
    { name: 'Tecnologia', attr: 'INT' },
    { name: 'Vontade', attr: 'PRE', },
  ]

  // Mock Data (will be replaced by real data later)

  const [expandedItemId, setExpandedItemId] = useState<string | number | null>(null)

  const inventory: {
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
    calculatedCategory?: number | null // Adicionamos a categoria calculada baseada em mods
    critical?: string | null
    criticalMultiplier?: string | null
    range?: string | null
    weaponType?: string | null
    uniqueId: string
    spaces: number
    modifications?: any[]
  }[] = useMemo(() => {
    const weapons = inventoryWeapons.map((w, index) => {
      // Calcula a Categoria (+1 por Melhoria, +2 por Maldição via mod.category)
      const baseCategory =
        typeof w.category === 'string'
          ? ['I', 'II', 'III', 'IV', 'V'].indexOf(w.category) + 1
          : w.category || 0

      const modsCategorySum =
        w.modifications?.reduce((sum: number, mod: any) => sum + (mod.category || 0), 0) || 0

      // Aplica redução de categoria da arma favorita no TOTAL (base + mods)
      const isFavorite = !!favoriteWeaponName && w.name === favoriteWeaponName
      const catReduction = isFavorite ? favoriteWeaponCategoryReduction : 0
      const finalCategory = Math.max(0, baseCategory + modsCategorySum - catReduction)
      console.log('[INV-MAP] arma:', w.name, 'favoriteWeaponName:', favoriteWeaponName, 'isFavorite:', isFavorite, 'baseCategory:', baseCategory, 'modsCategorySum:', modsCategorySum, 'catReduction:', catReduction, 'finalCategory:', finalCategory)

      return {
        id: w.id,
        weaponId: w.weaponId,
        name: w.name,
        desc: w.description || '',
        qty: w.quantity ?? 1,
        weight: `${w.spaces} Espaços`,
        spaces: w.spaces || 0,
        type: 'Arma',
        damage: w.damage,
        damageType: w.damageType,
        category: w.category,
        baseCategory,
        categoryReduction: catReduction,
        isFavoriteWeapon: isFavorite,
        calculatedCategory: finalCategory,
        critical: w.critical,
        criticalMultiplier: w.criticalMultiplier,
        range: w.range,
        weaponType: w.weaponType,
        equipped: w.equipped ?? false,
        itemKind: 'weapon' as const,
        uniqueId: `weapon-${w.id}-${index}`,
        modifications: w.modifications,
      }
    })

    const protections = inventoryProtections.map((p, index) => ({
      id: p.id,
      protectionId: p.protectionId,
      name: p.name,
      desc: p.description || '',
      qty: p.quantity ?? 1,
      weight: `${p.spaces} Espaços`,
      spaces: p.spaces || 0,
      type: 'Armadura',
      equipped: p.equipped ?? false,
      itemKind: 'protection' as const,
      uniqueId: `protection-${p.id}-${index}`,
    }))

    const generalItems = inventoryGeneralItems.map((g, index) => ({
      id: g.id,
      generalItemId: g.generalItemId,
      name: g.name,
      desc: g.description || '',
      qty: g.quantity ?? 1,
      weight: `${g.spaces} Espaços`,
      spaces: g.spaces || 0,
      type: 'Consumível',
      equipped: false as const,
      itemKind: 'general' as const,
      uniqueId: `general-${g.id}-${index}`,
    }))

    const ammunitions = inventoryAmmunitions.map((a, index) => {
      const baseCategory =
        typeof a.category === 'string'
          ? ['I', 'II', 'III', 'IV', 'V'].indexOf(a.category) + 1
          : a.category || 0

      const modsCategorySum =
        a.modifications?.reduce((sum: number, mod: any) => sum + (mod.category || 0), 0) || 0

      const finalCategory = Math.max(0, baseCategory + modsCategorySum)

      return {
        id: a.id,
        ammunitionId: a.ammunitionId,
        name: a.name,
        desc: a.description || '',
        qty: a.quantity ?? 1,
        weight: `${a.spaces} Espaços`,
        spaces: a.spaces || 0,
        type: 'Munição',
        category: a.category,
        baseCategory,
        calculatedCategory: finalCategory,
        equipped: false as const,
        itemKind: 'ammunition' as const,
        uniqueId: `ammunition-${a.id}-${index}`,
        modifications: a.modifications,
        notes: a.notes,
      }
    })

    const homebrew = (character.homebrewItems ?? []).map((h: any, index) => {
      const pivot = h.$extras || h
      const itemKind = h.itemType as 'weapon' | 'protection' | 'general' | 'ammunition'
      const typeLabel =
        itemKind === 'weapon'
          ? 'Arma'
          : itemKind === 'protection'
            ? 'Armadura'
            : itemKind === 'ammunition'
              ? 'Munição'
              : 'Consumível'

      return {
        id: h.id, // Usando o ID do item original para remoção via character_id + homebrew_item_id
        homebrewId: h.id,
        name: h.name,
        desc: h.description || '',
        qty: pivot.pivot_quantity ?? 1,
        weight: `${h.spaces} Espaços`,
        spaces: h.spaces || 0,
        type: typeLabel,
        itemKind,
        isHomebrew: true,
        status: pivot.pivot_status,
        rejectionReason: pivot.pivot_rejection_reason,
        uniqueId: `homebrew-${h.id}-${index}`,
        damage: h.damage,
        damageType: h.damageType,
        critical: h.critical,
        criticalMultiplier: h.criticalMultiplier,
        range: h.range,
        weaponType: h.weaponType,
        equipped: false,
      }
    })

    const allItems = [...weapons, ...protections, ...generalItems, ...ammunitions, ...homebrew]

    return allItems
  }, [
    inventoryWeapons,
    inventoryProtections,
    inventoryGeneralItems,
    inventoryAmmunitions,
    character.homebrewItems,
    favoriteWeaponName,
    favoriteWeaponCategoryReduction,
  ])

  const skillItemBonuses = useMemo(() => {
    const bonuses: Record<string, { total: number; sources: { name: string; value: number }[] }> = {}
    
    const addBonus = (skill: string, value: number, name: string) => {
      const key = skill.toLowerCase()
      if (!bonuses[key]) bonuses[key] = { total: 0, sources: [] }
      bonuses[key].total += value
      bonuses[key].sources.push({ name, value })
    }

    character.homebrewItems?.forEach((item: any) => {
      if (item.skillBonusName && item.skillBonusValue) {
        addBonus(item.skillBonusName, item.skillBonusValue, item.name)
      }
    })

    inventoryGeneralItems?.forEach((item: any) => {
      // Bônus fixo
      if (!item.skillBonusIsChoosable && item.skillBonusName && item.skillBonusValue) {
        addBonus(item.skillBonusName, item.skillBonusValue, item.name)
      }
      // Bônus escolhível
      if (item.skillBonusIsChoosable && item.chosenSkillBonusName && item.chosenSkillBonusValue) {
        addBonus(item.chosenSkillBonusName, item.chosenSkillBonusValue, item.name)
      }
    })

    return bonuses
  }, [character.homebrewItems, inventoryGeneralItems])

  // Calcular consumo por categoria (moved here after inventory declaration)
  const categoryConsumption = useMemo(() => {
    const consumption: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 }

    inventory.forEach((item) => {
      const cat = item.calculatedCategory !== undefined && item.calculatedCategory !== null 
        ? item.calculatedCategory 
        : item.category
      console.log('[CAT] item:', item.name, 'calculatedCategory:', item.calculatedCategory, 'category:', item.category, 'usando cat:', cat)
      if (cat && cat > 0) {
        // Na Regra de Ordem Paranormal, cada item de categoria I ocupa 1 slot de Categoria I.
        consumption[cat] = (consumption[cat] || 0) + (item.qty || 1)
      }
    })

    return consumption
  }, [inventory])

  // Lógica de Capacidade de Carga (Ordem Paranormal)
  const inventoryCapacity = useMemo(() => {
    const strength = character.attributes?.strength || 0
    const intellect = character.attributes?.intellect || 0

    // Inventário Otimizado (Técnico)
    const hasInventarioOtimizado =
      character.trail?.name === 'Técnico' && (character as any).nex >= 10

    // Inventário Organizado (Poder Geral - assumindo que pode estar em classAbilities)
    const hasInventarioOrganizado = character.classAbilities?.some(
      (a) => a.classAbility?.name === 'Inventário Organizado'
    )

    let baseStrength = strength
    if (hasInventarioOtimizado) {
      baseStrength += intellect
    }

    // Limite base: Força * 5. Se Força 0 ou menor, limite é 2.
    let limit = baseStrength > 0 ? baseStrength * 5 : 2

    // Bônus de Inventário Organizado (soma Intelecto ao limite final)
    if (hasInventarioOrganizado) {
      limit += intellect
    }

    const totalUsed = inventory.reduce((acc, item) => acc + (item.spaces || 0) * item.qty, 0)
    const maxCapacity = limit * 2
    const isOverloaded = totalUsed > limit

    return {
      used: totalUsed,
      limit,
      maxCapacity,
      isOverloaded,
      percentage: Math.min((totalUsed / limit) * 100, 100),
      overloadPercentage:
        totalUsed > limit ? Math.min(((totalUsed - limit) / limit) * 100, 100) : 0,
    }
  }, [character, inventory])

  // Sync modifyingWeapon with inventory updates so modal reacts in real-time
  useEffect(() => {
    if (modifyingWeapon) {
      const updatedWeapon = inventory.find((i) => i.id === modifyingWeapon.id && i.type === 'Arma')
      if (updatedWeapon) {
        setModifyingWeapon(updatedWeapon)
      }
    }
  }, [inventory])

  const removeItem = (itemId: number) => {
    if (!confirm('Tem certeza que deseja remover este item?')) return
    console.log('Removendo item:', itemId, 'do personagem:', character.id)
    axios
      .delete(`/characters/${character.id}/items/${itemId}`)
      .then(() => {
        setExpandedItemId(null)
        // @ts-ignore
        router.reload({ preserveScroll: true, preserveState: true })
      })
      .catch((error) => {
        console.error('Erro ao remover item:', error)
        console.error('Resposta do servidor:', error.response?.data)
        addToast({ title: 'Erro', description: 'Erro ao remover item. Tente novamente.', color: 'danger', timeout: 4000 })
      })
  }

  const toggleEquipItem = (itemId: number, currentEquipped: boolean) => {
    axios
      .patch(`/characters/${character.id}/items/${itemId}/equip`, { equipped: !currentEquipped })
      .then(() => {
        // @ts-ignore
        router.reload({ preserveScroll: true, preserveState: true })
      })
      .catch((error) => {
        console.error('Erro ao equipar/desequipar item:', error)
        addToast({ title: 'Erro', description: 'Erro ao atualizar item. Tente novamente.', color: 'danger', timeout: 4000 })
      })
  }

  const attributesData = [
    { subject: 'FOR', A: strength, fullMark: 10 },
    { subject: 'AGI', A: agility, fullMark: 10 },
    { subject: 'INT', A: intellect, fullMark: 10 },
    { subject: 'VIG', A: vigor, fullMark: 10 },
    { subject: 'PRE', A: presence, fullMark: 10 },
  ]

  const attributeInputs = [
    { label: 'FOR', val: strength, set: setStrength, icon: Dumbbell, color: 'text-red-400' },
    { label: 'AGI', val: agility, set: setAgility, icon: Wind, color: 'text-emerald-400' },
    { label: 'INT', val: intellect, set: setIntellect, icon: Brain, color: 'text-purple-400' },
    { label: 'VIG', val: vigor, set: setVigor, icon: Heart, color: 'text-rose-400' },
    { label: 'PRE', val: presence, set: setPresence, icon: Ghost, color: 'text-cyan-400' },
  ]

  // HP status based on current and max HP
  const hpStatus =
    hp === 0 ? 'Morto' : hp === maxHp ? 'Saudável' : hp <= maxHp * 0.5 ? 'Machucado' : 'Ferido'
  const hpStatusColor =
    hp === 0
      ? 'bg-slate-800/10 text-slate-400 border-slate-700/30'
      : hp === maxHp
        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
        : hp <= maxHp * 0.5
          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
          : 'bg-orange-500/10 text-orange-400 border-orange-500/30'

  const handleRollSkill = (
    skill: string,
    attrVal: number,
    trainingBonus: number,
    label: string,
    providedExtraDice?: string[]
  ) => {
    // Detecta buffs de habilidade que se aplicam a esta perícia
    const skillAttr = SKILL_ATTR[skill] ?? ''
    const relevantBuffs = activeAbilityBuffs.filter((b) => {
      if (b.abilityName === 'Eclético') return false // Tratado separadamente
      if (!b.effects.bonus) return false
      if (b.effects.duration !== 'next_test' && b.effects.duration !== 'scene')
        return false
      if (b.effects.exclude_skills?.includes(skill)) return false
      const target = b.effects.skill_bonus_target
      const attrTarget = b.effects.skill_bonus_attr
      if (target) {
        if (Array.isArray(target)) return target.includes(skill)
        return target === skill
      }
      if (attrTarget) {
        if (Array.isArray(attrTarget)) return attrTarget.includes(skillAttr)
        return attrTarget === skillAttr
      }
      return false
    })

    // Bônus do Eclético: +5 (+10/+15 com Engenhosidade) se não treinado
    const ecleticoBuff = activeAbilityBuffs.find((b) => b.abilityName === 'Eclético')
    let ecleticoBonusValue = 0
    if (ecleticoBuff && trainingBonus === 0) {
      ecleticoBonusValue = ecleticoBuff.effects.bonus || 5
    }

    const extraBonus = relevantBuffs.reduce((s, b) => s + (b.effects.bonus ?? 0), 0)

    // Bônus de Dados (ex: Perito)
    const peritoBuffs = activeAbilityBuffs.filter((b) => {
      if (b.abilityName !== 'Perito') return false
      if (b.effects.duration !== 'next_test') return false
      const target = b.effects.skill_bonus_target
      return target === skill
    })
    const extraDice = [
      ...peritoBuffs.map((b) => b.effects.bonus_dice).filter(Boolean),
      ...(providedExtraDice || []),
    ]

    // Coleta todos os buffs a serem consumidos (duração next_test)
    const buffsToConsume = [...relevantBuffs, ...peritoBuffs]
    if (ecleticoBuff) buffsToConsume.push(ecleticoBuff)

    if (buffsToConsume.length > 0) {
      setActiveAbilityBuffs((prev) =>
        prev.filter(
          (b) =>
            !buffsToConsume.some((bc) => bc.id === b.id) ||
            b.effects.duration !== 'next_test'
        )
      )
    }

    diceTrayRef.current?.openDiceTray()
    diceTrayRef.current?.rollDice(
      20,
      attrVal,
      ecleticoBuff && trainingBonus === 0 ? `${label} (Eclético)` : label,
      'highest',
      trainingBonus + extraBonus + ecleticoBonusValue,
      extraDice
    )
  }

  return (
    <div className="flex bg-[#09090b] h-screen overflow-hidden text-slate-100 font-sans selection:bg-blue-500/30">
      <div className="flex-1 overflow-y-auto custom-scrollbar relative pb-24">
        <Head title={`${character.name} - Escudo do Mestre`} />

      {/* Top Bar / Navigation */}
      <div className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <LinkIcon href="/">
              <Button isIconOnly variant="light" className="text-zinc-400 hover:text-white">
                <User size={20} />
              </Button>
            </LinkIcon>
            <div>
              <h1
                className="font-bold text-white text-lg leading-tight cursor-pointer hover:text-blue-400 transition-colors flex items-center gap-1 group"
                onClick={() => openEditModal(4)}
              >
                {character.name}
                <Edit3 size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </h1>
              <div className="text-xs text-zinc-500 flex items-center gap-2">
                <span
                  className="uppercase tracking-wider cursor-pointer hover:text-blue-400 transition-colors"
                  onClick={() => openEditModal(3)}
                >
                  {character.class?.name || 'Classe Desconhecida'}
                </span>
                <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                <span
                  className="uppercase tracking-wider cursor-pointer hover:text-blue-400 transition-colors"
                  onClick={() => openEditModal(2)}
                >
                  {character.origin?.name || 'Origem Desconhecida'}
                </span>
                <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                <span
                  className="text-blue-400 font-bold cursor-pointer hover:text-blue-300 transition-colors"
                  onClick={() => openEditModal(1)}
                >
                  {character.nex}% NEX
                </span>
                {character.affinity && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                      {character.affinity}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              isIconOnly
              size="sm"
              variant="flat"
              className="bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
              onPress={() => setIsRollHistoryOpen(true)}
              title="Histórico de Rolagens da Campanha"
            >
              <Dices size={18} />
            </Button>
          </div>
        </div>
      </div>

      {/* Affinity selection banner */}
      {character.nex >= 50 && !character.affinity && (
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-4">
          <button
            onClick={() => setIsAffinityModalOpen(true)}
            className="w-full flex items-center justify-between gap-4 rounded-xl border border-amber-500/40 bg-amber-500/5 px-5 py-4 text-left transition-all hover:border-amber-500/70 hover:bg-amber-500/10"
          >
            <div>
              <p className="text-sm font-bold text-amber-400 uppercase tracking-wider">
                NEX 50% atingido — Escolha sua Afinidade
              </p>
              <p className="mt-0.5 text-xs text-amber-400/60">
                Clique para vincular seu personagem permanentemente a um elemento do outro lado.
              </p>
            </div>
            <span className="shrink-0 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-black">
              Escolher
            </span>
          </button>
        </div>
      )}

      {/* Banner de Pedido de Iniciativa */}
      {pendingReaction && pendingReaction.rollType === 'Iniciativa' && (
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-4">
          <div
            className="w-full flex items-center justify-between gap-4 rounded-xl border border-orange-500/40 bg-orange-500/5 px-5 py-4 text-left transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-lg text-orange-400">
                <Swords size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-orange-400 uppercase tracking-wider">
                  ⚔️ Combate iniciado — Role sua Iniciativa
                </p>
                <p className="mt-0.5 text-xs text-orange-400/60">
                  Clique na perícia Iniciativa para rolar e entrar na ordem de turno
                </p>
              </div>
            </div>
            <button
              onClick={() => setPendingReaction(null)}
              className="shrink-0 rounded-lg bg-orange-500 px-4 py-2 text-xs font-bold text-black hover:bg-orange-400 transition-colors"
            >
              Dispensar
            </button>
          </div>
        </div>
      )}

      {/* Banner: É o seu turno! */}
      {isMyTurn && (
        <div
          className="sticky top-16 z-40 animate-pulse cursor-pointer"
          onClick={() => setIsMyTurn(false)}
        >
          <div className="bg-red-600 border-b-2 border-red-400 px-4 py-2.5 flex items-center justify-center gap-3">
            <span className="text-2xl">⚔️</span>
            <p className="text-white font-black text-sm uppercase tracking-widest">
              É o seu turno!
            </p>
            <span className="text-2xl">⚔️</span>
          </div>
        </div>
      )}

      <div className="flex flex-row gap-6 max-w-7xl mx-auto p-4 md:p-8">
        {/* COLUNA ESQUERDA (Skills & Inventory) */}
        <div className="flex-1 min-w-0 flex flex-col gap-6">
          {/* SKILLS SECTION */}
          {(() => {
            const hasDiscreta = (inventoryWeapons || []).some((w: any) =>
              w.equipped && (w.modifications || []).some((m: any) => m.name === 'Discreta')
            )
            return (
              <SkillsCard
                trainedSkills={trainedSkills}
                veteranSkills={veteranSkills}
                expertSkills={expertSkills}
                skillFilter={skillFilter}
                isLearningSkills={isLearningSkills}
                isSavingSkills={isSavingSkills}
                showSkillInfo={showSkillInfo}
                availableSkillsToChoose={availableSkillsToChoose}
                totalVeteranSkillsAllowed={totalVeteranSkillsAllowed}
                totalExpertSkillsAllowed={totalExpertSkillsAllowed}
                originSkillsFromOrigin={originSkillsFromOrigin}
                classMandatorySkills={classMandatorySkills}
                classSkillPools={classSkillPools}
                characterNex={character.nex}
                attrMap={{ FOR: strength, AGI: agility, INT: intellect, VIG: vigor, PRE: presence }}
                itemBonuses={skillItemBonuses}
                hasDiscreta={hasDiscreta}
                onFilterChange={setSkillFilter}
                onToggleLearning={() => setIsLearningSkills(true)}
                onSaveSkills={saveSkills}
                onToggleSkill={toggleSkillTraining}
                onSkillContextMenu={handleSkillContextMenu}
                onRollSkill={handleRollSkill}
                onToggleShowSkillInfo={() => setShowSkillInfo((prev) => !prev)}
              />
            )
          })()}

          {/* TABS SECTION */}
          <CharacterTabsCard
            activeCombatActions={activeCombatActions}
            onRollCombatAction={handleRollCombatAction}
            onDeactivateCombatAction={handleDeactivateCombatAction}
            inventory={inventory}
            inventoryCapacity={inventoryCapacity}
            categoryConsumption={categoryConsumption}
            rank={rank}
            isUpdatingRank={isUpdatingRank}
            expandedItemId={expandedItemId}
            inventoryWeapons={inventoryWeapons}
            combatParticipantId={activeCombatParticipantId}
            onDropItem={handleDropInventoryItem}
            onPickupItem={handlePickupItem}
            roomItems={roomItems}
            onAddItem={onAddItemModalOpen}
            onRankChange={setRank}
            onModifyWeapon={(item) => {
              setModifyingWeapon(item)
              onModifyWeaponModalOpen()
            }}
            onModifyAmmunition={(item) => {
              setModifyingAmmunition(item)
              onModifyAmmunitionModalOpen()
            }}
            onRemoveItem={removeItem}
            onEquipItem={toggleEquipItem}
            onExpandItem={setExpandedItemId}
            characterRituals={character.rituals || []}
            isOcultista={isOcultista}
            characterAffinity={character.affinity}
            onLearnRitual={() => setIsRitualSelectOpen(true)}
            onRemoveRitual={removeRitual}
            nex={character.nex}
            agility={agility}
            presence={presence}
            strength={strength}
            peritoPeSpending={peritoPeSpending}
            maxPeritoPe={maxPeritoPe}
              onRollWeapon={(w: { 
                id?: number; 
                name: string; 
                range: string; 
                damage: string; 
                critical: string; 
                criticalMultiplier: string;
                isThrowable?: boolean;
                isThrow?: boolean;
                isExtraAttack?: boolean;
                extraAttackPeCost?: number;
                modifications?: any[]
              }) => {

              const isMelee = w.range === 'Corpo a corpo'
              const wType = isMelee ? 'melee' : 'ranged'

              // --- BÔNUS DE MODIFICAÇÕES PERMANENTES ---
              const modAttackBonus = ((w as any).modifications || []).reduce((s: number, m: any) => s + (m.attackBonus ?? 0), 0)
              const modDamageBonus = ((w as any).modifications || []).reduce((s: number, m: any) => {
                const val = m.damageBonus ?? m.damage_bonus
                if (!val) return s
                const str = String(val).trim()
                // Ignora se contiver 'd' (é dado, não flat)
                if (str.toLowerCase().includes('d')) return s
                return s + (parseInt(str.replace('+', '')) || 0)
              }, 0)
              const modCritBonus = (w.modifications || []).reduce((s: number, m: any) => {
                const legacyBonus = m.criticalBonus ?? m.critical_bonus ?? 0
                const spBonus = m.specialProperties?.threatMarginBonus 
                  ?? m.special_properties?.threatMarginBonus 
                  ?? 0
                return s + legacyBonus + spBonus
              }, 0)

              const modExtraDice = ((w as any).modifications || [])
                .map((m: any) => {
                  // Tenta special_properties primeiro
                  const spDamage = m.specialProperties?.extraDamage ?? m.special_properties?.extraDamage
                  if (spDamage) return spDamage

                  // Fallback legado
                  const val = String(m.damageBonus ?? m.damage_bonus ?? '').trim()
                  if (val.toLowerCase().includes('d')) return val.replace('+', '')
                  return null
                })
                .filter(Boolean) as string[]

              const modCritMultiplierBonus = (w.modifications || []).reduce((s: number, m: any) => {
                // Tenta camelCase, snake_case e dentro de specialProperties
                const val = m.criticalMultiplierBonus 
                  ?? m.critical_multiplier_bonus
                  ?? m.specialProperties?.criticalMultiplierBonus
                  ?? m.special_properties?.critical_multiplier_bonus
                  ?? ''
                const str = String(val).trim()
                if (!str) return s
                return s + (parseInt(str.replace(/[^0-9-]/g, '')) || 0)
              }, 0)



              const hasCalibreGrosso = ((w as any).modifications || []).some(
                (m: any) => m.name === 'Calibre Grosso'
              )

              // --- BÔNUS DE HABILIDADES ATIVAS (já existente) ---
              const combatBuffs = activeAbilityBuffs.filter((b) => {
                if (b.effects.duration !== 'next_attack' && b.effects.duration !== 'scene')
                  return false
                const wt = b.effects.weapon_type
                if (wt && wt !== 'all' && wt !== wType) return false
                return (
                  (b.effects.attack_bonus ?? 0) > 0 ||
                  (b.effects.damage_bonus ?? 0) > 0 ||
                  (b.effects.threat_range_bonus ?? 0) > 0
                )
              })
              const extraAttackBonus = combatBuffs.reduce(
                (s, b) => s + (b.effects.attack_bonus ?? 0),
                0
              )
              const extraDamageBonus = combatBuffs.reduce(
                (s, b) => s + (b.effects.damage_bonus ?? 0),
                0
              )
              const extraCritBonus = combatBuffs.reduce(
                (s, b) => s + (b.effects.threat_range_bonus ?? 0),
                0
              )

              // --- BÔNUS DE RITUAIS (usando ref para evitar stale closure) ---
              const ritualBuffs = activeRitualBuffsRef.current.filter((b) => {
                if (!b.buffDuration) return false
                const wType = w.range === 'Corpo a corpo' ? 'melee' : 'ranged'
                if (b.weaponType && b.weaponType !== 'all' && b.weaponType !== wType) return false
                const weaponId = (w as any).id?.toString() || w.name
                if (b.targetWeaponId && b.targetWeaponId.toString() !== weaponId) return false
                return true
              })
              const ritualAttackBonus = ritualBuffs.reduce((s, b) => s + (b.weaponAttackBonus ?? 0), 0)
              const ritualDamageBonus = ritualBuffs.reduce((s, b) => s + (b.weaponDamageBonus ?? 0), 0)
              const ritualCritBonus = ritualBuffs.reduce((s, b) => s + (b.weaponThreatRangeBonus ?? 0), 0)
              const ritualCritMultiplier = ritualBuffs.reduce((s, b) => s + (b.weaponCritMultiplierBonus ?? 0), 0)
              const ritualDamageStep = ritualBuffs.reduce((s, b) => s + (b.weaponDamageStepBonus ?? 0), 0)

              console.log('[ROLL-WEAPON] activeRitualBuffs:', JSON.stringify(activeRitualBuffsRef.current))
              console.log('[ROLL-WEAPON] weaponId:', (w as any).id?.toString() || w.name)
              console.log('[ROLL-WEAPON] ritualBuffs filtrados:', JSON.stringify(ritualBuffs))
              console.log('[ROLL-WEAPON] ritualAttackBonus:', ritualAttackBonus)
              const ritualExtraDice = ritualBuffs.map(b => 
                b.weaponExtraDamageDice 
                  ? `${b.weaponExtraDamageDice}${b.weaponExtraDamageElement ? ' ' + b.weaponExtraDamageElement : ''}`
                  : null
              ).filter(Boolean) as string[]

              const finalDamage = applyStepIncrease(w.damage, (hasCalibreGrosso ? 1 : 0) + ritualDamageStep)

              // --- LÓGICA DE ARREMESSO (EMPUXO) ---
              const NATURALLY_THROWABLE = ['Faca', 'Machadinha', 'Lança']
              const isNaturallyThrowable = NATURALLY_THROWABLE.some(
                (name) => w.name.toLowerCase().includes(name.toLowerCase())
              )
              const hasEmpuxo = (w.modifications || []).some((m: any) => m.name === 'Empuxo')
              const throwExtraDice: string[] = []
              if (w.isThrow && hasEmpuxo && isNaturallyThrowable) {
                // "2d6" -> "1d6"
                const diceMatch = w.damage.match(/d(\d+)/i)
                if (diceMatch) {
                  throwExtraDice.push(`1d${diceMatch[1]}`)
                }
              }


              // Consome buffs de duração 'next_attack' após a rolagem (Habilidades e Rituais)
              if (combatBuffs.length > 0 || ritualBuffs.some(b => b.buffDuration === 'next_attack')) {
                setActiveAbilityBuffs((prev) =>
                  prev.filter(
                    (b) =>
                      !combatBuffs.find((cb) => cb.id === b.id) ||
                      b.effects.duration !== 'next_attack'
                  )
                )
                setActiveRitualBuffs((prev) => 
                  prev.filter(
                    (b) => 
                      !ritualBuffs.find(rb => rb.id === b.id) ||
                      b.buffDuration !== 'next_attack'
                  )
                )
              }

              // --- TOTAIS ---
              diceTrayRef.current?.openDiceTray()

              const baseCritMultiplier = parseInt(
                (w.criticalMultiplier || 'x2').replace(/[^0-9]/g, '') || '2'
              )



              const modIgnoresRD = (w.modifications || []).some((m: any) => 
                m.specialProperties?.ignoresRD === true ||
                m.special_properties?.ignoresRD === true
              )

              const modConvertsDamageType = (w.modifications || [])
                .map((m: any) => m.specialProperties?.convertsDamageType ?? m.special_properties?.convertsDamageType)
                .find(Boolean) ?? null

              diceTrayRef.current?.rollWeapon(
                {
                  name: w.name,
                  range: w.range,
                  damage: finalDamage,
                  critical: w.critical || '20',
                  criticalMultiplier: `x${baseCritMultiplier + modCritMultiplierBonus + ritualCritMultiplier}`,
                  extraAttackBonus: extraAttackBonus + modAttackBonus + ritualAttackBonus,
                  extraDamageBonus: extraDamageBonus + modDamageBonus + ritualDamageBonus,
                  extraCritBonus: extraCritBonus + modCritBonus + ritualCritBonus,
                  extraDamageDice: [...ritualExtraDice, ...throwExtraDice, ...modExtraDice],
                  ignoresRD: modIgnoresRD,
                  convertsDamageType: modConvertsDamageType,
                  isExtraAttack: w.isExtraAttack
                },
                strength,
                agility,
                character.skills
              )
            }}
            onPeritoSpendChange={(skill, value) =>
              setPeritoPeSpending({ ...peritoPeSpending, [skill]: value })
            }
            classAbilities={character.classAbilities || []}
            paranormalPowers={character.paranormalPowers || []}
            currentTrailAbilities={currentTrailAbilities}
            futureTrailAbilities={futureTrailAbilities}
            characterTrail={character.trail}
            chosenClassAbilities={chosenClassAbilities}
            maxClassAbilities={maxClassAbilities}
            canChooseMore={canChooseMore}
            availableAbilities={availableAbilities}
            hasNoTrail={hasNoTrail}
            classTrails={classTrails}
            expandedSections={expandedSections}
            hasRitualPotente={hasRitualPotente}
            hasCamuflarOcultismo={hasCamuflarOcultismo}
            hasEngenhosidade={hasEngenhosidade}
            intellect={intellect}
            peritoSkills={peritoSkills}
            peritoBonus={peritoBonus}
            isTrailPowersOpen={isTrailPowersOpen}
            ritualPrediletoConfig={ritualPrediletoConfig}
            usarCamuflar={usarCamuflar}
            calcPeAjustado={calcPeAjustado}
            onToggleSection={toggleSection as any}
            onTrailPowersOpenChange={onTrailPowersOpenChange}
            onOpenTrailModal={onTrailModalOpen}
            onOpenAbilitySelect={onAbilitySelectOpen}
            onOpenAbilityConfig={openAbilityConfig}
            onRemoveAbility={(charId, abilityId) => {
              if (confirm('Tem certeza que deseja remover esta habilidade?'))
                router.delete(`/characters/${charId}/abilities/${abilityId}`, {
                  preserveState: true,
                  preserveScroll: true,
                })
            }}
            onRemoveParanormalPower={removeParanormalPower}
            onSetUsarCamuflar={setUsarCamuflar}
            // Trail config props
            trailConfig={trailConfig}
            favoriteWeaponName={favoriteWeaponName}
            useFlagelo={useFlagelo}
            useLaminaMaldita={useLaminaMaldita}
            useOcultismoForAttacks={useOcultismoForAttacks}
            onToggleFlagelo={toggleFlagelo}
            onToggleLaminaMaldita={toggleLaminaMaldita}
            onToggleOcultismoForAttacks={toggleOcultismoForAttacks}
            onOpenTrailConfigModal={onTrailConfigModalOpen}
            characterId={character.id}
            originAbilityName={character.origin?.abilityName}
            originAbilityDescription={character.origin?.abilityDescription}
            originAbilities={originAbilities}
            pe={pe}
            ocultismoDegree={ocultismoDegree}
            onDeductPe={handleDeductPe}
            onDeductSan={handleDeductSan}
            onDeductPermSan={handleDeductPermSan}
            activeRitualBuffs={activeRitualBuffs}
            activeAbilityBuffs={activeAbilityBuffs}
            abilityUsesThisScene={abilityUsesThisScene}
            onActivateAbility={handleActivateAbility}
            onClearAbilityBuff={clearAbilityBuff}
            onResetSceneUses={resetSceneUses}
            onRollSkill={handleRollSkill}
            onRollRitual={(params) => {
              diceTrayRef.current?.openDiceTray()
              const buff = getRitualBuff(params.name, params.version ?? 'base')
              
              // Se for buff de próximo ataque ou de cena, rola só o teste de Ocultismo (sem dados de dano)
              // O buff só é aplicado se o teste for bem-sucedido (via onRitualBuffSuccess)
              if (buff?.buffDuration === 'next_attack' || buff?.buffDuration === 'scene') {
                diceTrayRef.current?.rollRitual({ 
                  ...params, 
                  damageDice: undefined, // Remove os dados de dano da rolagem
                  isHeal: false,
                  healByDamageFactor: 0,
                })
                return
              }
              
              const isHeal = !!(buff?.healDice || buff?.healHalfDamage)
              const healByDamageFactor = buff?.healByDamageFactor ?? 0

              diceTrayRef.current?.rollRitual({ ...params, isHeal, healByDamageFactor })
            }}
            onRitualBuffSuccess={handleRitualBuffSuccess}
            onRitualActionSuccess={handleRitualAction}
            characterSkills={character.skills || []}
            attrMap={{
              FOR: strength,
              AGI: agility,
              INT: intellect,
              VIG: vigor,
              PRE: presence,
            }}
          />
        </div>

        {/* COLUNA DIREITA (Attributes & Stats) */}
        <div className="w-[350px] flex-shrink-0 space-y-6">
          {/* ATTRIBUTES SECTION */}
          <AttributesDiceTrayCard
            ref={diceTrayRef}
            strength={strength}
            agility={agility}
            intellect={intellect}
            vigor={vigor}
            presence={presence}
            onStrengthChange={setStrength}
            onAgilityChange={setAgility}
            onIntellectChange={setIntellect}
            onVigorChange={setVigor}
            onPresenceChange={setPresence}
            isMundano={isMundano}
            baseAttrPoints={baseAttrPoints}
            maxAttrValue={maxAttrValue}
            attributeBonusFromNex={attributeBonusFromNex}
            initialAttrs={initialAttrs}
            isSaving={isSaving}
            onSaveAttributes={() => {
              setIsSaving(true)
              router.put(`/characters/${character.id}/attributes`, {
                strength,
                agility,
                intellect,
                vigor,
                presence,
              }, {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => setIsSaving(false),
              })
            }}
            onNewRoll={handleNewRoll}
            dddiceApiKey={import.meta.env.VITE_DDDICE_API_KEY as string | undefined}
            dddiceRoomSlug={
              (character.campaigns?.[0]?.dddiceRoomSlug as string | undefined) ||
              (import.meta.env.VITE_DDDICE_ROOM_SLUG as string | undefined)
            }
            activeAbilityBuffs={activeAbilityBuffs}
            abilityEffects={abilityEffects}
            activeRitualBuffs={activeRitualBuffs}
            onHealByDamage={handleHealByDamage}
            onWeaponDamageResult={handleWeaponDamageResult}
          />

          {/* COMBAT DEFENSES */}
          <CombatDefensesCard
            agility={agility}
            characterSkills={character.skills}
            inventoryProtections={inventoryProtections}
            ritualDefenseBonus={ritualDefenseBonus}
            ritualDodgeBonus={ritualDodgeBonus}
            activeRitualBuffs={activeRitualBuffs}
            onRemoveRitualBuff={removeRitualBuff}
            onUpdateRitualBuff={updateRitualBuff}
            onClearAllBuffs={clearAllRitualBuffs}
            tempHp={tempHp}
            onSetTempHp={setTempHp}
            tempPe={tempPe}
            onSetTempPe={setTempPe}
            abilityEffects={abilityEffects}
            activeAbilityBuffs={activeAbilityBuffs}
            onRemoveAbilityBuff={(buffId) => setActiveAbilityBuffs(prev => prev.filter(b => b.id !== buffId))}
          />

          {/* VITALS STACK */}
          <Card className="bg-zinc-900 border border-zinc-800 shadow-none rounded-xl">
            <CardBody className="p-5 space-y-6">
              {/* HP */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-red-500 uppercase text-xs font-bold tracking-widest">
                  <div className="flex items-center gap-2">
                    <Heart size={14} /> PV
                  </div>
                  <Chip size="sm" variant="flat" className={`${hpStatusColor} h-6`}>
                    {hpStatus}
                  </Chip>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <label className="font-semibold">Dano Recebido:</label>
                  <input
                    type="number"
                    value={damageToHp}
                    onChange={(e) => setDamageToHp(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && applyDamageHp()}
                    className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 font-bold text-white w-20"
                    min="0"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">{hp}</span>
                    {tempHp > 0 && (
                      <span className="text-lg font-black text-cyan-400">+{tempHp}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    {/* Barra customizada: vermelha (HP real) + azul (HP temporário) */}
                    {/* O tempHp preenche o gap entre hp e maxHp primeiro; só extrapola se hp+tempHp > maxHp */}
                    {(() => {
                      const effectiveTotal = hp + tempHp
                      const barMax = Math.max(maxHp, effectiveTotal)
                      return (
                        <div className="relative h-3 rounded-full bg-zinc-950 border border-zinc-800 overflow-hidden shadow-inner">
                          {/* Segmento vermelho — HP real */}
                          <div
                            className="absolute inset-y-0 left-0 transition-all duration-300 shadow-[0_0_10px_rgba(239,68,68,0.3)]"
                            style={{ width: `${(hp / barMax) * 100}%`, backgroundColor: '#EF4444' }}
                          />
                          {/* Segmento azul — HP temporário (emplilhado após o vermelho) */}
                          {tempHp > 0 && (
                            <div
                              className="absolute inset-y-0 transition-all duration-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                              style={{
                                left: `${(hp / barMax) * 100}%`,
                                width: `${(tempHp / barMax) * 100}%`,
                                backgroundColor: '#06B6D4'
                              }}
                            />
                          )}
                        </div>
                      )
                    })()}
                  </div>
                  <span className="text-sm text-zinc-500 font-bold">
                    {hp + tempHp > maxHp ? hp + tempHp : maxHp}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-xs text-zinc-400">
                  <Button
                    size="sm"
                    variant="flat"
                    className="bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 h-9 font-bold"
                    onPress={() => takeDamage(1)}
                  >
                    -1
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    className="bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 h-9 font-bold"
                    onPress={() => takeDamage(5)}
                  >
                    -5
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    className="bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 h-9 font-bold"
                    onPress={() => setHp(Math.min(maxHp, hp + 1))}
                  >
                    +1
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    className="bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 h-9 font-bold"
                    onPress={() => setHp(Math.min(maxHp, hp + 5))}
                  >
                    +5
                  </Button>
                </div>
              </div>

              <Divider className="bg-zinc-800" />

              {/* PE */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-amber-400 uppercase text-xs font-bold tracking-widest">
                  <div className="flex items-center gap-2">
                    <Zap size={14} /> PE
                  </div>
                  <button
                    onClick={() => setPe(maxPe)}
                    className="text-[10px] text-zinc-500 hover:text-white flex items-center gap-1 uppercase font-bold tracking-wider transition-colors"
                  >
                    <RotateCcw size={12} /> Resetar
                  </button>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <label className="font-semibold">PE Gasto:</label>
                  <input
                    type="number"
                    value={damageToPe}
                    onChange={(e) => setDamageToPe(String(Math.max(0, Number(e.target.value))))}
                    onKeyDown={(e) => e.key === 'Enter' && applyDamagePe()}
                    className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 font-bold text-white w-20"
                    min="0"
                  />
                  <span className="ml-1 flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-[11px]">
                    {Math.floor(character.nex / 5)} PE/turno
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">{pe}</span>
                    {tempPe > 0 && (
                      <span className="text-lg font-black text-cyan-400">+{tempPe}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    {(() => {
                      const effectiveTotal = pe + tempPe
                      const barMax = Math.max(maxPe, effectiveTotal)
                      return (
                        <div className="relative h-3 rounded-full bg-zinc-950 border border-zinc-800 overflow-hidden shadow-inner">
                          {/* Segmento amarelo — PE real */}
                          <div
                            className="absolute inset-y-0 left-0 transition-all duration-300 shadow-[0_0_10px_rgba(251,191,36,0.3)]"
                            style={{ width: `${(pe / barMax) * 100}%`, backgroundColor: '#F59E0B' }}
                          />
                          {/* Segmento azul — PE temporário */}
                          {tempPe > 0 && (
                            <div
                              className="absolute inset-y-0 transition-all duration-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                              style={{
                                left: `${(pe / barMax) * 100}%`,
                                width: `${(tempPe / barMax) * 100}%`,
                                backgroundColor: '#06B6D4'
                              }}
                            />
                          )}
                        </div>
                      )
                    })()}
                  </div>
                  <span className="text-sm text-zinc-500 font-bold">
                    {pe + tempPe > maxPe ? pe + tempPe : maxPe}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="flat"
                    className="bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 h-9 font-bold"
                    onPress={() => takePeDamage(1)}
                  >
                    -1
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    className="bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 h-9 font-bold"
                    onPress={() => takePeDamage(5)}
                  >
                    -5
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    className="bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 h-9 font-bold"
                    onPress={() => setPe(Math.min(maxPe, pe + 1))}
                  >
                    +1
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    className="bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 h-9 font-bold"
                    onPress={() => setPe(Math.min(maxPe, pe + 5))}
                  >
                    +5
                  </Button>
                </div>
              </div>

              <Divider className="bg-zinc-800" />

              {/* SANITY */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-purple-400 uppercase text-xs font-bold tracking-widest">
                  <div className="flex items-center gap-2">
                    <Brain size={14} /> Sanidade
                  </div>
                  <div className="flex items-center gap-2 text-zinc-500 text-[10px]">
                    <input type="checkbox" className="h-2.5 w-2.5 rounded accent-purple-500" />
                    <span className="uppercase font-bold">Insano</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <label className="font-semibold">Dano Mental Recebido:</label>
                  <input
                    type="number"
                    value={damageToSan}
                    onChange={(e) => setDamageToSan(String(Math.max(0, Number(e.target.value))))}
                    onKeyDown={(e) => e.key === 'Enter' && applyDamageSan()}
                    className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 font-bold text-white w-20"
                    min="0"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-black text-white">{san}</span>
                  <div className="flex-1">
                    <div className="h-3 w-full rounded-full overflow-hidden shadow-inner" style={{ backgroundColor: '#09090b', border: '1px solid #27272a' }}>
                        <div 
                           className="h-full transition-all duration-300 ease-out shadow-[0_0_10px_rgba(168,85,247,0.3)]" 
                           style={{ 
                             width: `${Math.min(100, Math.max(0, (san / (maxSan || 1)) * 100))}%`, 
                             backgroundColor: '#A855F7'
                           }} 
                        />
                    </div>
                  </div>
                  <span className="text-sm text-zinc-500 font-bold">{maxSan}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-xs text-zinc-400">
                  <Button
                    size="sm"
                    variant="flat"
                    className="bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 h-9 font-bold"
                    onPress={() => setSan(Math.max(0, san - 1))}
                  >
                    -1
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    className="bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 h-9 font-bold"
                    onPress={() => setSan(Math.max(0, san - 5))}
                  >
                    -5
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    className="bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 h-9 font-bold"
                    onPress={() => setSan(Math.min(maxSan, san + 1))}
                  >
                    +1
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    className="bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 h-9 font-bold"
                    onPress={() => setSan(Math.min(maxSan, san + 5))}
                  >
                    +5
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Edit Character Modal */}
      <AnimatePresence>
        {isEditOpen && (
          <CreateCharacterModal
            classes={classes}
            origins={origins}
            onClose={onEditOpenChange}
            editData={{
              characterId: character.id,
              initialNex: editNex,
              initialClassId: editClassId,
              initialOriginId: editOriginId,
              initialName: editName,
              initialStep: editStep,
            }}
          />
        )}
      </AnimatePresence>

      {/* Ability Configuration Modal */}
      <BaseModal
        isOpen={isAbilityConfigOpen}
        onClose={onAbilityConfigOpenChange}
        maxWidth="max-w-xl"
        title={`Configurar ${configuringAbility?.classAbility?.name ?? ''}`}
        footer={
          <>
            <button
              onClick={onAbilityConfigOpenChange}
              className="px-5 py-2 rounded-md font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={saveAbilityConfig}
              disabled={
                isConfiguringAbility ||
                (configuringAbility?.classAbility?.name === 'Perito' && selectedSkills.length !== 2)
              }
              className="flex items-center gap-2 px-5 py-2 rounded-md font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConfiguringAbility ? 'Salvando...' : 'Salvar Configuração'}
            </button>
          </>
        }
      >
        {configuringAbility?.classAbility?.name === 'Perito' && (
          <div className="space-y-4">
            <p className="text-sm text-zinc-400">
              Selecione exatamente 2 perícias para esta habilidade.{' '}
              <span className="text-red-400">Luta e Pontaria não são permitidas.</span>
            </p>

            <div className="space-y-2">
              <p className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                Perícias Disponíveis:
              </p>
              <div className="flex flex-wrap gap-2">
                {availableSkills.map((skill) => (
                  <Button
                    key={skill}
                    size="sm"
                    onPress={() => toggleSkillSelection(skill)}
                    className={`font-semibold ${
                      selectedSkills.includes(skill)
                        ? 'bg-amber-500 text-white border-amber-400'
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-amber-500 hover:text-amber-400'
                    } border`}
                  >
                    {selectedSkills.includes(skill) && '? '}
                    {skill}
                  </Button>
                ))}
              </div>
            </div>

            {selectedSkills.length > 0 && (
              <div className="bg-zinc-950/50 p-3 rounded border border-amber-500/30">
                <p className="text-xs font-bold text-amber-400 mb-2">
                  Selecionadas ({selectedSkills.length}/2):
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedSkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-amber-500/20 border border-amber-500/40 rounded text-amber-300 text-xs font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* -- Ritual Predileto: escolha um ritual -- */}
        {configuringAbility?.classAbility?.name === 'Ritual Predileto' && (
          <div className="space-y-4">
            <p className="text-sm text-zinc-400">
              Escolha um ritual que você conhece. O custo desse ritual será reduzido em{' '}
              <span className="text-emerald-400 font-bold">–1 PE</span>.
            </p>
            {character.rituals && character.rituals.length > 0 ? (
              <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar pr-1">
                {character.rituals.map((cr, idx) => {
                  const r = cr.ritual
                  const elementColor =
                    {
                      Conhecimento: 'border-amber-500/40 hover:border-amber-500',
                      Energia: 'border-purple-500/40 hover:border-purple-500',
                      Morte: 'border-zinc-500/40 hover:border-zinc-500',
                      Sangue: 'border-red-500/40 hover:border-red-500',
                    }[r?.element || ''] || 'border-zinc-700 hover:border-zinc-500'
                  const isSelected = selectedRitual === r?.name
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedRitual(r?.name || '')}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        isSelected
                          ? 'bg-blue-500/20 border-blue-500 ring-1 ring-blue-500/50'
                          : `bg-zinc-950/50 ${elementColor}`
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isSelected && <span className="text-blue-400 font-black">?</span>}
                        <span className="font-bold text-white text-sm">{r?.name}</span>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase">
                          {r?.element}
                        </span>
                        <span className="text-[10px] text-zinc-500">{r?.circle}º Círculo</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            ) : (
              <p className="text-sm text-zinc-500 italic">Nenhum ritual aprendido ainda.</p>
            )}
            {selectedRitual && (
              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-xs text-blue-400 font-bold">
                  Selecionado: <span className="text-white">{selectedRitual}</span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* -- Mestre em Elemento / Especialista em Elemento: escolha o elemento -- */}
        {(configuringAbility?.classAbility?.name === 'Mestre em Elemento' ||
          configuringAbility?.classAbility?.name === 'Especialista em Elemento') && (
          <div className="space-y-4">
            <p className="text-sm text-zinc-400">
              {configuringAbility?.classAbility?.name === 'Mestre em Elemento'
                ? 'Escolha um elemento. O custo dos seus rituais desse elemento será reduzido em –1 PE.'
                : 'Escolha um elemento. A DT para resistir aos seus rituais desse elemento aumenta em +2.'}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Conhecimento', color: 'amber', icon: '??' },
                { name: 'Energia', color: 'purple', icon: '?' },
                { name: 'Morte', color: 'zinc', icon: '??' },
                { name: 'Sangue', color: 'red', icon: '??' },
              ].map((el) => {
                const isSelected = selectedElement === el.name
                const colorMap: Record<string, string> = {
                  amber: 'bg-amber-500/20 border-amber-500 text-amber-300',
                  purple: 'bg-purple-500/20 border-purple-500 text-purple-300',
                  zinc: 'bg-zinc-500/20 border-zinc-400 text-zinc-300',
                  red: 'bg-red-500/20 border-red-500 text-red-300',
                }
                const inactiveMap: Record<string, string> = {
                  amber:
                    'border-amber-500/30 hover:border-amber-500/60 text-amber-400/60 hover:text-amber-400',
                  purple:
                    'border-purple-500/30 hover:border-purple-500/60 text-purple-400/60 hover:text-purple-400',
                  zinc: 'border-zinc-500/30 hover:border-zinc-500/60 text-zinc-400/60 hover:text-zinc-400',
                  red: 'border-red-500/30 hover:border-red-500/60 text-red-400/60 hover:text-red-400',
                }
                return (
                  <button
                    key={el.name}
                    onClick={() => setSelectedElement(el.name)}
                    className={`p-4 rounded-lg border-2 transition-all font-bold text-sm flex items-center gap-2 ${
                      isSelected ? colorMap[el.color] : `bg-zinc-950/50 ${inactiveMap[el.color]}`
                    }`}
                  >
                    <span>{el.icon}</span>
                    {el.name}
                    {isSelected && <span className="ml-auto">?</span>}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </BaseModal>

      {/* Trail Config Modal — A Favorita (escolher arma) */}
      <BaseModal
        isOpen={isTrailConfigModalOpen}
        onClose={onTrailConfigModalOpenChange}
        maxWidth="max-w-xl"
        title="A Favorita — Escolher Arma"
        footer={
          <>
            <button
              onClick={onTrailConfigModalOpenChange}
              className="px-5 py-2 rounded-md font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={saveTrailConfigModal}
              disabled={isSavingTrailConfig || !selectedFavoriteWeapon}
              className="flex items-center gap-2 px-5 py-2 rounded-md font-medium bg-red-600 hover:bg-red-500 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSavingTrailConfig ? 'Salvando...' : 'Confirmar Arma Favorita'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-zinc-400">
            Escolha uma arma do seu inventário para ser sua favorita. A{' '}
            <span className="text-red-400 font-bold">categoria é reduzida em I</span> e conforme
            avança de NEX, ganha bônus adicionais (Técnica Secreta, Técnica Sublime, Máquina de
            Matar).
          </p>
          {inventoryWeapons.length > 0 ? (
            <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar pr-1">
              {inventoryWeapons.map((w: any, idx: number) => {
                const isSelected = selectedFavoriteWeapon === w.name
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedFavoriteWeapon(w.name)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-red-500/20 border-red-500 ring-1 ring-red-500/50'
                        : 'bg-zinc-950/50 border-zinc-700 hover:border-red-500/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isSelected && <span className="text-red-400 font-black text-lg">★</span>}
                      <div>
                        <span className="font-bold text-white text-sm">{w.name}</span>
                        <div className="flex gap-2 mt-0.5">
                          {w.damage && (
                            <span className="text-[10px] text-zinc-400">{w.damage}</span>
                          )}
                          {w.weaponType && (
                            <span className="text-[10px] text-zinc-500 uppercase">
                              {w.weaponType}
                            </span>
                          )}
                          {w.range && <span className="text-[10px] text-zinc-500">{w.range}</span>}
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          ) : (
            <p className="text-sm text-zinc-500 italic">
              Nenhuma arma no inventário. Adicione armas primeiro.
            </p>
          )}
          {selectedFavoriteWeapon && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-xs text-red-400 font-bold">
                Arma Favorita: <span className="text-white">{selectedFavoriteWeapon}</span>
              </p>
            </div>
          )}
        </div>
      </BaseModal>

      {/* Skill Menu Modal */}
      <BaseModal
        isOpen={isSkillMenuOpen}
        onClose={onSkillMenuOpenChange}
        title={selectedSkillName ?? ''}
        description="Ações disponíveis para esta perícia"
      >
        {selectedSkillName && skillDescriptions[selectedSkillName] ? (
          <div className="space-y-4">
            {skillDescriptions[selectedSkillName].map((action, idx) => (
              <div
                key={idx}
                className="p-4 bg-zinc-950/50 rounded-lg border border-cyan-500/30 hover:border-cyan-500/50 transition-all"
              >
                <h3 className="font-bold text-cyan-300 mb-2">{action.title}</h3>
                <p className="text-sm text-zinc-300 leading-relaxed">{action.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-zinc-400">
            Nenhuma ação disponível para esta perícia
          </div>
        )}
      </BaseModal>

      {/* Class Ability Selection Modal */}
      <BaseModal
        isOpen={isAbilitySelectOpen}
        onClose={() => {
          onAbilitySelectOpenChange()
          setAbilitySearch('')
        }}
        title="Escolher Habilidade de Classe"
        description={`Escolhidas: ${chosenClassAbilities}/${maxClassAbilities}`}
        maxWidth="max-w-3xl"
      >
        <div className="flex flex-col h-full -mt-6 -mx-6">
          {/* Barra de busca sticky */}
          <div className="sticky -top-6 bg-[#18181b] pt-6 px-6 pb-4 z-20 border-b border-zinc-800/80">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-zinc-500" />
              </div>
              <input
                type="text"
                placeholder="Buscar habilidade por nome ou descrição..."
                value={abilitySearch}
                onChange={(e) => setAbilitySearch(e.target.value)}
                className="w-full bg-[#141417] border border-zinc-800 text-white rounded-lg pl-11 pr-4 py-3 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="flex-1 space-y-4 px-6 pb-2 pt-4">
            {(() => {
              const filtered = availableAbilities.filter(
                (a) =>
                  a.name.toLowerCase().includes(abilitySearch.toLowerCase()) ||
                  (a.description || '').toLowerCase().includes(abilitySearch.toLowerCase())
              )
              return filtered.length > 0 ? (
                filtered.map((ability) => {
                  // Construir badge de custo a partir dos effects
                  const eff =
                    typeof ability.effects === 'string'
                      ? JSON.parse(ability.effects || '{}')
                      : ability.effects || {}
                  const costParts: string[] = []
                  if (eff.action) costParts.push(eff.action)
                  if (eff.pe_cost) costParts.push(`${eff.pe_cost} PE`)
                  if (!costParts.length) costParts.push('Passiva')
                  const costLabel = costParts.join(' • ')

                  return (
                    <div
                      key={ability.id}
                      className="group bg-[#1a1a21] border border-zinc-800/80 rounded-lg p-5 hover:border-zinc-700 transition-all duration-200"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className="text-yellow-500 font-bold text-lg tracking-wide">
                              {ability.name}
                            </h3>
                            <span className="px-2.5 py-0.5 rounded-full bg-zinc-800/80 text-zinc-400 text-xs font-semibold border border-zinc-700/50">
                              {costLabel}
                            </span>
                            {eff.nex && (
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/30">
                                NEX {eff.nex}
                              </span>
                            )}
                          </div>
                          {ability.description && (
                            <p className="text-zinc-400 text-sm leading-relaxed">
                              {ability.description}
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => addClassAbility(ability.id)}
                          disabled={isAddingAbility}
                          className="shrink-0 mt-2 sm:mt-0 bg-zinc-800 hover:bg-yellow-500 hover:text-white text-zinc-300 px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-colors border border-zinc-700 hover:border-yellow-400 w-full sm:w-auto disabled:opacity-50 disabled:cursor-wait"
                        >
                          <Plus className="w-4 h-4" />
                          Adicionar
                        </button>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-16 px-4">
                  <Search className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-zinc-300 mb-1">
                    Nenhuma habilidade encontrada
                  </h3>
                  <p className="text-zinc-500 text-sm">
                    Tente buscar por outro termo ou limpe a pesquisa.
                  </p>
                  {abilitySearch && (
                    <button
                      onClick={() => setAbilitySearch('')}
                      className="mt-4 text-yellow-500 hover:text-yellow-400 text-sm font-medium"
                    >
                      Limpar busca
                    </button>
                  )}
                </div>
              )
            })()}
          </div>
        </div>
      </BaseModal>

      {/* Trail Selection Modal */}
      <TrailSelectModal
        isOpen={isTrailModalOpen}
        trails={classTrails}
        onClose={onTrailModalOpenChange}
        onConfirm={(trailId) => selectTrail(trailId)}
      />

      {/* Add Item Modal */}
      <AddItemModal
        isOpen={isAddItemModalOpen}
        onClose={onAddItemModalOpenChange}
        catalogWeapons={catalogWeapons}
        catalogProtections={catalogProtections}
        catalogGeneralItems={catalogGeneralItems}
        catalogCursedItems={catalogCursedItems}
        catalogAmmunitions={catalogAmmunitions}
        catalogHomebrewItems={catalogHomebrewItems}
        inventory={inventory}
        characterHomebrewIds={character.homebrewItems?.map(h => h.id) ?? []}
        onRemoveItem={removeItem}
        explosiveDt={10 + Math.floor(character.nex / 5) + agility}
        onAdd={addItemToCharacter}
        onAddHomebrew={(homebrewItemId) =>
          router.post(
            `/characters/${character.id}/homebrew-items/add-existing`,
            { homebrewItemId },
            { preserveScroll: true }
          )
        }
      />

      {/* Transcend Choice Modal */}
      <BaseModal
        isOpen={isTranscendChoiceOpen}
        onClose={() => setIsTranscendChoiceOpen(false)}
        maxWidth="max-w-sm"
        title="Transcender"
        description="Escolha como deseja transcender"
      >
        <div className="grid grid-cols-1 gap-4">
          <button
            className="h-24 text-xl font-bold bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/10 transition-all border border-blue-500/30 rounded-xl"
            onClick={() => {
              setIsTranscendChoiceOpen(false)
              setIsParanormalSelectOpen(true)
            }}
          >
            Aprender Poder Paranormal
          </button>
          <button
            className="h-24 text-xl font-bold bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 shadow-lg shadow-purple-500/10 transition-all border border-purple-500/30 rounded-xl"
            onClick={() => {
              setIsTranscendChoiceOpen(false)
              setIsRitualSelectOpen(true)
            }}
          >
            Aprender Ritual
          </button>
        </div>
      </BaseModal>

      {/* Paranormal Power Selection Modal */}
      <ParanormalPowerModal
        isOpen={isParanormalSelectOpen}
        onClose={() => setIsParanormalSelectOpen(false)}
        powers={catalogParanormalPowers}
        acquiredPowerIds={(character.paranormalPowers ?? []).map((p: any) => p.paranormalPowerId)}
        isLoading={isAddingAbility}
        onConfirm={(powerId) => addParanormalPower(powerId)}
      />

      {/* Affinity Selection Modal */}
      <AffinityModal
        isOpen={isAffinityModalOpen}
        onClose={() => setIsAffinityModalOpen(false)}
        isLoading={isAffinityLoading}
        onConfirm={selectAffinity}
      />

      {/* Modal de seleção e aprendizado de rituais */}
      <RitualSelectModal
        isOpen={isRitualSelectOpen}
        onClose={() => setIsRitualSelectOpen(false)}
        rituals={(catalogRituals ?? []).slice().sort((a, b) => a.circle - b.circle)}
        acquiredRitualIds={(character.rituals ?? []).map((r: any) => r.ritualId)}
        circuloMaximo={circuloMaximo}
        creditosRestantes={creditosRestantes}
        creditosGanhos={creditosGanhos}
        characterAffinity={character.affinity}
        isLoading={isAddingAbility}
        onConfirm={(id) => addRitual(id)}
      />

      <ModificationModal
        isOpen={isModifyWeaponModalOpen}
        onOpenChange={(open) => {
          if (!open) setIsTempRitual(false)
          onModifyWeaponModalOpenChange()
        }}
        item={modifyingWeapon}
        itemType="Weapon"
        catalog={catalogWeaponModifications}
        isUpdating={isUpdatingModifications}
        onToggle={toggleModification}
        canApplyModification={canApplyModification}
        isTempRitual={isTempRitual}
        onTempModificationChosen={handleTempModificationChosen}
      />

      {/* Modal de Modificação de Munição */}
      <BaseModal
        isOpen={isModifyAmmunitionModalOpen}
        onClose={onModifyAmmunitionModalOpenChange}
        maxWidth="max-w-xl"
        height="h-[90vh]"
        title={
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
              <Target size={20} />
            </div>
            <div>
              <div className="text-xl font-bold text-white">Modificar {modifyingAmmunition?.name}</div>
              <div className="text-xs text-zinc-500">Melhorias e Maldiçöes</div>
            </div>
          </div>
        }
        footer={
          <button
            onClick={onModifyAmmunitionModalOpenChange}
            className="ml-auto px-5 py-2 rounded-md font-medium text-red-400 hover:bg-red-500/10 transition-colors text-sm"
          >
            Fechar
          </button>
        }
      >
        <div className="space-y-5">
          {/* Modificações Atuais */}
          <div>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
              Modificações Atuais
            </p>
            <div className="flex flex-wrap gap-1.5">
              {modifyingAmmunition?.modifications && modifyingAmmunition.modifications.length > 0 ? (
                modifyingAmmunition.modifications.map((mod: any) => {
                  const isCurse = mod.type === 'Maldição'
                  const elemClasses: Record<string, string> = {
                    Sangue: 'bg-red-500/10 text-red-300 border-red-500/30',
                    Morte: 'bg-zinc-500/10 text-zinc-300 border-zinc-500/30',
                    Energia: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
                    Conhecimento: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
                  }
                  const cls = isCurse
                    ? elemClasses[mod.element] || 'bg-red-500/10 text-red-300 border-red-500/30'
                    : 'bg-blue-500/10 text-blue-300 border-blue-500/20'
                  return (
                    <button
                      key={mod.id}
                      onClick={() =>
                        toggleAmmunitionModification(modifyingAmmunition.id, mod.modificationId, 'remove')
                      }
                      title="Clique para remover"
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold transition-all hover:opacity-70 ${cls}`}
                    >
                      {mod.name}
                      <span className="text-[10px] opacity-60">&times;</span>
                    </button>
                  )
                })
              ) : (
                <span className="text-sm text-zinc-600 italic">Nenhuma modificação aplicada.</span>
              )}
            </div>
          </div>

          <div className="h-px bg-zinc-800" />

          {/* Catálogo de Melhorias */}
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Catálogo de Melhorias</p>
          </div>

          {/* Grade de modificações */}
          <div className="space-y-2">
            {(catalogWeaponModifications || [])
              .filter((m: any) => m.type === 'Melhoria de Munição')
              .map((mod) => {
                const isActive = modifyingAmmunition?.modifications?.some(
                  (m: any) => m.modificationId === mod.id
                )
                const validation = !isActive
                  ? canApplyAmmunitionModification(modifyingAmmunition, mod.category)
                  : { allowed: true }
                const isBlocked = !isActive && !validation.allowed
                return (
                  <button
                    key={mod.id}
                    disabled={isBlocked}
                    onClick={
                      isBlocked
                        ? undefined
                        : () =>
                            toggleAmmunitionModification(
                              modifyingAmmunition!.id,
                              mod.id,
                              isActive ? 'remove' : 'add'
                            )
                    }
                    title={isBlocked ? validation.reason : undefined}
                    className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all ${
                      isBlocked
                        ? 'opacity-40 cursor-not-allowed bg-zinc-950/30 border-zinc-800'
                        : isActive
                          ? 'bg-blue-500/20 border-blue-500 ring-1 ring-blue-500/40'
                          : 'bg-zinc-950/50 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={`font-semibold text-sm ${isActive ? 'text-blue-300' : 'text-zinc-200'}`}
                      >
                        {mod.name}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-zinc-800/80 border border-zinc-700 text-zinc-400 shrink-0">
                        +{mod.category} CAT
                      </span>
                    </div>
                    {mod.description && (
                      <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed line-clamp-2">
                        {mod.description}
                      </p>
                    )}
                    <div className="mt-1.5 flex items-center justify-between">
                      <span
                        className={`text-[9px] uppercase font-bold ${isBlocked ? 'text-red-500' : isActive ? 'text-blue-400' : 'text-zinc-600'}`}
                      >
                        {isBlocked ? validation.reason : 'MELHORIA DE MUNIÇÃO'}
                      </span>
                      {isActive && <Check size={11} className="text-blue-400" />}
                    </div>
                  </button>
                )
              })}
          </div>
        </div>
      </BaseModal>

      {/* Modal de Buff de Ritual */}
      {pendingRitualBuff && (
        <RitualBuffModal
          isOpen={isRitualBuffModalOpen}
          onClose={() => {
            setIsRitualBuffModalOpen(false)
            setPendingRitualBuff(null)
          }}
          ritualName={pendingRitualBuff.ritualName}
          version={pendingRitualBuff.version}
          buff={pendingRitualBuff.buff}
          weapons={inventoryWeapons?.map(w => ({ id: w.id.toString(), name: w.name, range: w.range }))}
          onApplyToSelf={(buff, chosenAttr, chosenWeapon, chosenElement) => {
            if (buff.tempModification) {
              const weapon = inventoryWeapons.find(w => w.id.toString() === chosenWeapon)
              if (weapon) {
                setModifyingWeapon(weapon)
                setIsTempRitual(true)
                onModifyWeaponModalOpen()
              }
            } else {
              applyRitualBuffToSelf(buff, chosenAttr, chosenWeapon, chosenElement)
            }
            setIsRitualBuffModalOpen(false)
            setPendingRitualBuff(null)
          }}
          onApplyToAlly={async () => {
            console.log('[ALLY-BUFF] 1. onApplyToAlly chamado')
            console.log('[ALLY-BUFF] 2. pendingRitualBuff:', JSON.stringify(pendingRitualBuff))

            if (!pendingRitualBuff) {
              console.log('[ALLY-BUFF] ERRO: pendingRitualBuff é null')
              return
            }

            setPendingAllyBuff(pendingRitualBuff)
            console.log('[ALLY-BUFF] 3. pendingAllyBuff definido:', JSON.stringify(pendingRitualBuff))
            setIsRitualBuffModalOpen(false)

            console.log('[ALLY-BUFF] 4. Chamando endpoint:', `/api/campaigns/${campaignId}/characters`)
            try {
              const { data } = await axios.post(`/api/campaigns/${campaignId}/characters`, {
                excludeCharacterId: character.id,
              })
              console.log('[ALLY-BUFF] 5. Aliados retornados:', JSON.stringify(data))
              console.log('[ALLY-BUFF] 6. Primeiro aliado weapons:', JSON.stringify(data[0]?.weapons))

              setCampaignCharacters(data)
              setAllyBuffModalOpen(true)
              console.log('[ALLY-BUFF] 7. Modal de aliados aberto')
            } catch (err) {
              console.error('[Buff] Erro ao carregar aliados:', err)
              addToast({ title: 'Erro', description: 'Não foi possível carregar aliados.', color: 'danger' })
            }
          }}
        />
      )}

      <AllyBuffModal
        open={allyBuffModalOpen}
        allies={campaignCharacters}
        buff={pendingAllyBuff?.buff}
        casterName={character.name}
        onConfirm={handleAllyBuffConfirm}
        onClose={() => {
          setAllyBuffModalOpen(false)
          setPendingAllyBuff(null)
          setSelectedAlly(null)
        }}
      />

      <DotTargetModal
        open={dotTargetModalOpen}
        participants={combatParticipants.filter(p => p.characterId !== character.id)}
        onConfirm={handleDotTargetConfirm}
        onClose={() => setDotTargetModalOpen(false)}
      />

      <DotRollModal
        open={dotRollModalOpen}
        targets={dotRollTargets}
        onRoll={handleDotRoll}
        onClose={() => {
          setDotRollModalOpen(false)
          setDotRollTargets([])
        }}
      />
      </div>

      {/* Modal de Confirmação de Limpeza de Histórico */}
      <BaseModal
        isOpen={isConfirmClearOpen}
        onClose={() => setIsConfirmClearOpen(false)}
        title="Limpar Histórico Pessoal"
        description="Deseja limpar o seu histórico de rolagens? Isso ocultará as rolagens atuais apenas para você. Outros jogadores continuarão vendo as rolagens da campanha."
        footer={
          <div className="flex gap-2 w-full justify-end">
            <Button
              variant="flat"
              onPress={() => setIsConfirmClearOpen(false)}
              className="text-zinc-400"
            >
              Cancelar
            </Button>
            <Button
              color="danger"
              onPress={confirmClearHistory}
              className="font-bold"
            >
              Limpar Histórico
            </Button>
          </div>
        }
      />

      {/* Roll History Sidebar */}
      <RollHistorySidebar
        isOpen={isRollHistoryOpen}
        onClose={() => setIsRollHistoryOpen(false)}
        rolls={campaignRolls}
        onClear={handleClearHistory}
        onDeleteRoll={handleDeleteRoll}
      />

      {/* Modal de Reação de Combate */}
      <BaseModal
        isOpen={Boolean(pendingReaction && pendingReaction.rollType !== 'Iniciativa')}
        onClose={() => setPendingReaction(null)}
        title={
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚔️</span> Você está sendo atacado!
          </div>
        }
        description={
          pendingReaction && (
            <span>
              <span className="text-orange-500 font-bold">{pendingReaction.attackerName}</span> está realizando um ataque contra você. Como você deseja reagir?
            </span>
          )
        }
        maxWidth="max-w-md"
      >
        <div className="flex flex-col gap-3">
          <button
            onClick={() => handleReaction('block')}
            className="w-full py-3 rounded-lg font-bold transition-all border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 flex items-center justify-center gap-2"
          >
            🛡️ Bloquear
          </button>
          <button
            onClick={() => handleReaction('dodge')}
            className="w-full py-3 rounded-lg font-bold transition-all border border-green-500/30 bg-green-500/10 hover:bg-green-500/20 text-green-400 flex items-center justify-center gap-2"
          >
            💨 Esquivar
          </button>
          <button
            onClick={() => handleReaction('counter')}
            className="w-full py-3 rounded-lg font-bold transition-all border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center gap-2"
          >
            ⚔️ Contra-atacar
          </button>
        </div>
      </BaseModal>
    </div>
  )
}
