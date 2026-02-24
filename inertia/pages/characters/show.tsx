import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Progress,
  Tab,
  Tabs,
  Chip,
  Divider,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Slider,
  Input,
} from '@heroui/react'
import { Head, Link, router, usePage } from '@inertiajs/react'
import axios from 'axios'
import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getOriginIcon } from '../../utils/originIcons'
import { skillDescriptions } from '../../utils/skillDescriptions'
import {
  Shield,
  Zap,
  Activity,
  Trash2,
  Plus,
  Filter,
  Dices,
  Dumbbell,
  Brain,
  Wind,
  Heart,
  Ghost,
  User,
  Menu,
  RotateCcw,
  Save,
  Check,
  Edit3,
  ChevronDown,
  Sparkles,
  Sword,
} from 'lucide-react'
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts'

interface Origin {
  id: number
  name: string
  description: string
  trainedSkills: string[] | string | null
  abilityName: string | null
  abilityDescription: string | null
}

interface CharacterClass {
  id: number
  name: string
  description: string
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
  type: string
  description: string | null
  damageBonus?: string | null
  spaces: number
  damageTypeOverride?: string | null
  criticalBonus?: number | null
  criticalMultiplierBonus?: string | null
  weaponTypeRestriction?: string | null
}

interface CharacterProps {
  character: {
    id: number
    name: string
    nex: number
    rank?: string
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
    catalogAmmunitions = [],
    trailProgressions = [],
    catalogRituals = [],
  } = ({ ...initialProps, ...pageProps } as CharacterProps)

  // Normalize classTrails: backend may send camelCase (classTrails) or snake_case (class_trails)
  const classTrails: Trail[] =
    initialProps.classTrails ?? pageProps.classTrails ?? pageProps.class_trails ?? []

  const catalogParanormalPowers: ParanormalPower[] = catalogParanormalPowersProp || []

  console.log('inventoryWeapons RAW:', JSON.stringify(inventoryWeapons, null, 2))

  // Personagem sem trilha: considerar trailId ou trail_id (serialização pode vir em snake_case)
  const characterTrailId = character.trailId ?? (character as { trail_id?: number | null }).trail_id
  const hasNoTrail = characterTrailId == null || characterTrailId === undefined

  // Collapsible sections state
  const [expandedSections, setExpandedSections] = useState({
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

  // Damage taken inputs
  const [damageToHp, setDamageToHp] = useState('')
  const [damageToPe, setDamageToPe] = useState('')
  const [damageToSan, setDamageToSan] = useState('')

  // Defense and Dodge bonuses
  const [defenseEquipBonus, setDefenseEquipBonus] = useState(0)
  const [dodgeReflexBonus, setDodgeReflexBonus] = useState(0)

  // Edit modal state
  const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure()
  const [editStep, setEditStep] = useState(1)
  const [editNex, setEditNex] = useState(character.nex)
  const [editClassId, setEditClassId] = useState<number | null>(character.class?.id || null)
  const [editOriginId, setEditOriginId] = useState<number | null>(character.origin?.id || null)
  const [editName, setEditName] = useState(character.name)
  const [focusedOrigin, setFocusedOrigin] = useState<Origin | null>(null)
  const [originSearch, setOriginSearch] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [isAddingAbility, setIsAddingAbility] = useState(false)
  const [isTranscendChoiceOpen, setIsTranscendChoiceOpen] = useState(false)
  const [isParanormalSelectOpen, setIsParanormalSelectOpen] = useState(false)
  const [isRitualSelectOpen, setIsRitualSelectOpen] = useState(false)
  const [lastTranscendAbilityId, setLastTranscendAbilityId] = useState<number | null>(null)

  // Ritual filters state
  const [ritualSearch, setRitualSearch] = useState('')
  const [elementFilter, setElementFilter] = useState('Todos')
  const [circleFilter, setCircleFilter] = useState('Todos')



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
  const [expandedItemKey, setExpandedItemKey] = useState<string | null>(null)
  const toggleItemExpanded = (key: string) => {
    setExpandedItemKey((prev) => (prev === key ? null : key))
  }

  // Filtered and sorted rituals
  const filteredRituals = useMemo(() => {
    if (!catalogRituals) return []

    return catalogRituals
      .filter((ritual) => {
        const matchesSearch = ritual.name.toLowerCase().includes(ritualSearch.toLowerCase())
        const matchesElement =
          elementFilter === 'Todos' ||
          (ritual.element && ritual.element.toUpperCase().includes(elementFilter.toUpperCase()))
        const matchesCircle = circleFilter === 'Todos' || ritual.circle.toString() === circleFilter

        return matchesSearch && matchesElement && matchesCircle
      })
      .sort((a, b) => a.circle - b.circle) // Order by circle (ascending)
  }, [catalogRituals, ritualSearch, elementFilter, circleFilter])

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
    Recruta: { 1: 2, 2: 0, 3: 0, 4: 0 },
    Operador: { 1: 3, 2: 1, 3: 0, 4: 0 },
    'Agente Especial': { 1: 3, 2: 2, 3: 1, 4: 0 },
    'Oficial de Operações': { 1: 5, 2: 3, 3: 2, 4: 1 },
    'Agente de Elite': { 1: 5, 2: 5, 3: 3, 4: 2 },
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

  // Function to format ability descriptions with paragraph breaks
  const formatAbilityDescription = (text: string | null) => {
    if (!text) return []
    const sentences = text.split(/(?<=[.!?])\s+/)
    const paragraphs = []
    for (let i = 0; i < sentences.length; i += 3) {
      paragraphs.push(sentences.slice(i, i + 3).join(' '))
    }
    return paragraphs
  }

  const openEditModal = (step: number) => {
    setEditStep(step)
    setEditNex(character.nex)
    setEditClassId(character.class?.id || null)
    setEditOriginId(character.origin?.id || null)
    setEditName(character.name)
    setFocusedOrigin(null)
    setOriginSearch('')
    onEditOpen()
  }

  const handleEditNextStep = () => {
    if (editStep === 3) setOriginSearch('')
    setEditStep(editStep + 1)
  }

  const handleEditSelectClass = (classId: number) => {
    setEditClassId(classId)
    handleEditNextStep()
  }

  const confirmEditOrigin = (originId: number) => {
    setEditOriginId(originId)
    setFocusedOrigin(null)
    handleEditNextStep()
  }

  const submitEditCharacter = () => {
    setIsUpdating(true)
    router.put(
      `/characters/${character.id}`,
      {
        nex: editNex,
        classId: editClassId,
        originId: editOriginId,
        name: editName,
      },
      {
        onSuccess: () => {
          onEditOpenChange()
          setIsUpdating(false)
        },
        onError: (errors) => {
          console.error('Character update failed:', errors)
          setIsUpdating(false)
        },
      }
    )
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

    onAbilityConfigOpen()
  }

  const saveAbilityConfig = async () => {
    if (!configuringAbility) return

    // Validate for Perito
    if (configuringAbility.classAbility?.name === 'Perito' && selectedSkills.length !== 2) {
      alert('Por favor, selecione exatamente 2 perícias para Perito')
      return
    }

    setIsConfiguringAbility(true)
    router.put(
      `/characters/${character.id}/abilities/${configuringAbility.id}`,
      {
        selectedSkills: selectedSkills,
      },
      {
        onSuccess: () => {
          setIsConfiguringAbility(false)
          onAbilityConfigOpenChange()
        },
        onError: (errors) => {
          console.error('Ability configuration failed:', errors)
          setIsConfiguringAbility(false)
        },
      }
    )
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
    quantity?: number
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
        alert(
          `Limite de Categoria ${categoryLabels[itemCategory]} atingido para a patente ${rank}!\nLimite: ${limit} | Atual: ${currentConsumption}`
        )
        return
      }
    }

    // Validar limite máximo (não pode passar do dobro do limite)
    if (inventoryCapacity.used + totalAddedSpaces > inventoryCapacity.maxCapacity) {
      alert(
        `Limite de carga excedido! Você só pode carregar até ${inventoryCapacity.maxCapacity} espaços (o dobro do seu limite de ${inventoryCapacity.limit}).`
      )
      return
    }

    router.post(
      `/characters/${character.id}/items`,
      { type, itemId, quantity: qty },
      {
        onSuccess: () => {
          onAddItemModalOpenChange()
        },
        onError: (errors) => {
          console.error('Erro ao adicionar item:', errors)
          alert('Erro ao adicionar item. Verifique se o item existe e tente novamente.')
        },
      }
    )
  }

  const selectTrail = (trailId: number) => {
    router.put(
      `/characters/${character.id}/trail`,
      { trailId },
      {
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
        onSuccess: () => {
          setIsAddingAbility(false)
          setIsParanormalSelectOpen(false) // Close the specific modal
          setLastTranscendAbilityId(null)
        },
        onError: () => setIsAddingAbility(false),
      }
    )
  }

  const removeParanormalPower = (powerId: number) => {
    if (!confirm('Tem certeza que deseja remover este poder paranormal?')) return
    router.delete(`/characters/${character.id}/paranormal-powers/${powerId}`)
  }

  const addRitual = (ritualId: number) => {
    setIsAddingAbility(true)
    router.post(
      `/characters/${character.id}/rituals`,
      { ritualId, transcendAbilityId: lastTranscendAbilityId },
      {
        onSuccess: () => {
          setIsAddingAbility(false)
          setIsRitualSelectOpen(false) // Close the specific modal
          setLastTranscendAbilityId(null)
        },
        onError: () => setIsAddingAbility(false),
      }
    )
  }

  const removeRitual = (ritualId: number) => {
    if (!confirm('Tem certeza que deseja remover este ritual?')) return
    router.delete(`/characters/${character.id}/rituals/${ritualId}`)
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
  const [isSaving, setIsSaving] = useState(false)

  // Calculate Reflexos bonus automatically from trained skills
  const reflexosBonus = useMemo(() => {
    const reflexosSkill = character.skills?.find((cs: any) => cs.skill?.name === 'Reflexos')
    if (!reflexosSkill) return 0
    // Treinado (5) = +5, Veterano (10) = +10, Expert (15) = +15
    const degree = reflexosSkill.trainingDegree || 0
    if (degree >= 15) return 15
    if (degree >= 10) return 10
    if (degree >= 5) return 5
    return 0
  }, [character.skills])

  // Calculate Defense and Dodge dynamically
  // Defesa = 10 + Agilidade + Equipamentos
  // Esquiva = 10 + Equipamentos + Agilidade + Reflexos
  const { defense, dodge } = useMemo(
    () => ({
      defense: 10 + agility + defenseEquipBonus,
      dodge: 10 + defenseEquipBonus + agility + reflexosBonus + dodgeReflexBonus,
    }),
    [agility, defenseEquipBonus, reflexosBonus, dodgeReflexBonus]
  )

  // Calculate max HP, PE, and Sanity dynamically based on class, NEX, and attributes
  // Formula: base + level * attribute + (level - 1) * perLevel
  // Level = NEX / 5
  const { maxHp, maxPe, maxSan } = useMemo(() => {
    const level = Math.floor(character.nex / 5)

    // HP calculation: baseHp + level * vigor + (level - 1) * hpPerLevel
    const baseHp = classInfo?.baseHp || 20
    const hpPerLevel = classInfo?.hpPerLevel || 4
    const calculatedMaxHp = baseHp + level * vigor + (level - 1) * hpPerLevel

    // PE calculation: basePe + level * presence + (level - 1) * pePerLevel
    const basePe = classInfo?.basePe || 2
    const pePerLevel = classInfo?.pePerLevel || 2
    const calculatedMaxPe = basePe + level * presence + (level - 1) * pePerLevel

    // Sanity calculation: baseSanity + (level - 1) * sanityPerLevel
    const baseSanity = classInfo?.baseSanity || 12
    const sanityPerLevel = classInfo?.sanityPerLevel || 3
    const calculatedMaxSan = baseSanity + (level - 1) * sanityPerLevel

    return {
      maxHp: calculatedMaxHp,
      maxPe: calculatedMaxPe,
      maxSan: calculatedMaxSan,
    }
  }, [character.nex, vigor, presence, classInfo])

  // Filter trail progressions by current NEX
  const { currentTrailAbilities, futureTrailAbilities } = useMemo(() => {
    const current = trailProgressions.filter((prog) => prog.nex <= character.nex)
    const future = trailProgressions.filter((prog) => prog.nex > character.nex)
    return { currentTrailAbilities: current, futureTrailAbilities: future }
  }, [trailProgressions, character.nex])

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

  // Apply damage to HP based on damage input
  const applyDamageHp = () => {
    const appliedDamage = Math.max(0, Number(damageToHp) || 0)
    setHp((prevHp) => Math.max(0, prevHp - appliedDamage))
    setDamageToHp('')
  }

  // Apply damage to PE based on damage input
  const applyDamagePe = () => {
    const appliedDamage = Math.max(0, Number(damageToPe) || 0)
    setPe((prevPe) => Math.max(0, prevPe - appliedDamage))
    setDamageToPe('')
  }

  // Apply damage to Sanity based on damage input
  const applyDamageSan = () => {
    const appliedDamage = Math.max(0, Number(damageToSan) || 0)
    setSan((prevSan) => Math.max(0, prevSan - appliedDamage))
    setDamageToSan('')
  }

  // Calculate available points: 4 base + NEX bonus + 1 for each attribute at 0
  // All attributes start at 1 (base). Points spent = value above 1. Reducing to 0 gives +1 bonus.
  const { usedPoints, availablePoints } = useMemo(() => {
    const attrs = [strength, agility, intellect, vigor, presence]
    const base = 4 + attributeBonusFromNex
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

  // Save attributes function
  const saveAttributes = () => {
    setIsSaving(true)
    router.put(
      `/characters/${character.id}/attributes`,
      {
        strength,
        agility,
        intellect,
        vigor,
        presence,
      },
      {
        preserveScroll: true,
        onFinish: () => setIsSaving(false),
      }
    )
  }

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
          ? 1
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
  const baseVeteranSkills =
    character.class?.name === 'Especialista'
      ? 5
      : character.class?.name === 'Ocultista'
        ? 3
        : character.class?.name === 'Combatente'
          ? 2
          : 0
  const totalVeteranSkillsAllowed = character.nex >= 35 ? baseVeteranSkills + intellect : 0

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

  const [trainedSkills, setTrainedSkills] = useState<string[]>(initialTrainedSkills)
  const [veteranSkills, setVeteranSkills] = useState<string[]>(initialVeteranSkills)
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
      },
      {
        onError: (errors) => {
          console.error('Skill save failed:', errors)
          setIsSavingSkills(false)
        },
      }
    )
  }

  const toggleSkillTraining = (skillName: string) => {
    if (!isLearningSkills) return

    const isTrained = trainedSkills.includes(skillName)
    const isVeteran = veteranSkills.includes(skillName)
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
        // If can't make veteran, try to untrain
        if (!isLocked) {
          if (skillPool) {
            const poolChosenCount = getPoolChosenCount(skillPool)
            // Can untrain if more than required in pool
            if (poolChosenCount > skillPool.required) {
              setTrainedSkills((prev) => prev.filter((s) => s !== skillName))
            }
            // If exactly at required, can swap with another from same pool
            else if (poolChosenCount === skillPool.required) {
              // Allow swap by checking if clicking would select another
              // For now, don't untrain - user must click another to swap
            }
          } else {
            setTrainedSkills((prev) => prev.filter((s) => s !== skillName))
          }
        }
      }
    } else if (!isLocked) {
      // Veteran (or Trained but NEX < 35) -> Untrain completely
      if (skillPool) {
        const poolChosenCount = getPoolChosenCount(skillPool)
        if (poolChosenCount > skillPool.required) {
          // Extra skill from pool, can remove freely
          setVeteranSkills((prev) => prev.filter((s) => s !== skillName))
          setTrainedSkills((prev) => prev.filter((s) => s !== skillName))
        } else {
          // At minimum required or below - just untrain, user will need to pick again
          setVeteranSkills((prev) => prev.filter((s) => s !== skillName))
          setTrainedSkills((prev) => prev.filter((s) => s !== skillName))
        }
      } else {
        setVeteranSkills((prev) => prev.filter((s) => s !== skillName))
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
    { name: 'Vontade', attr: 'PRE' },
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
    critical?: string | null
    criticalMultiplier?: string | null
    range?: string | null
    weaponType?: string | null
    uniqueId: string
    spaces: number
  }[] = useMemo(() => {
    const weapons = inventoryWeapons.map((w, index) => ({
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
      critical: w.critical,
      criticalMultiplier: w.criticalMultiplier,
      range: w.range,
      weaponType: w.weaponType,
      uniqueId: `weapon-${w.id}-${index}`,
    }))

    const protections = inventoryProtections.map((p, index) => ({
      id: p.id,
      protectionId: p.protectionId,
      name: p.name,
      desc: p.description || '',
      qty: p.quantity ?? 1,
      weight: `${p.spaces} Espaços`,
      spaces: p.spaces || 0,
      type: 'Armadura',
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
      uniqueId: `general-${g.id}-${index}`,
    }))

    const allItems = [...weapons, ...protections, ...generalItems]
    console.log('Todos os itens do inventário:', allItems)
    return allItems
  }, [inventoryWeapons, inventoryProtections, inventoryGeneralItems])

  // Calcular consumo por categoria (moved here after inventory declaration)
  const categoryConsumption = useMemo(() => {
    const consumption: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 }

    inventory.forEach((item) => {
      if (item.category && item.category > 0) {
        // Na Regra de Ordem Paranormal, cada item de categoria I ocupa 1 slot de Categoria I.
        consumption[item.category] = (consumption[item.category] || 0) + (item.qty || 1)
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
      overloadPercentage: totalUsed > limit ? Math.min(((totalUsed - limit) / limit) * 100, 100) : 0,
    }
  }, [character, inventory])

  const removeItem = (itemId: number) => {
    if (!confirm('Tem certeza que deseja remover este item?')) return
    console.log('Removendo item:', itemId, 'do personagem:', character.id)
    axios
      .delete(`/characters/${character.id}/items/${itemId}`)
      .then(() => {
        setExpandedItemId(null)
        // @ts-ignore
        router.reload({ preserveScroll: true })
      })
      .catch((error) => {
        console.error('Erro ao remover item:', error)
        console.error('Resposta do servidor:', error.response?.data)
        alert('Erro ao remover item. Tente novamente.')
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

  return (
    <div className="min-h-screen bg-black text-slate-100 font-sans selection:bg-blue-500/30">
      <Head title={`${character.name} - Escudo do Mestre`} />

      {/* Top Bar / Navigation */}
      <div className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button isIconOnly variant="light" className="text-zinc-400 hover:text-white">
                <User size={20} />
              </Button>
            </Link>
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
                  onClick={() => openEditModal(2)}
                >
                  {character.class?.name || 'Classe Desconhecida'}
                </span>
                <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                <span
                  className="uppercase tracking-wider cursor-pointer hover:text-blue-400 transition-colors"
                  onClick={() => openEditModal(3)}
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
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="flat" className="bg-zinc-800 text-zinc-300">
              <Menu size={16} />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-row gap-6 max-w-7xl mx-auto p-4 md:p-8">
        {/* COLUNA ESQUERDA (Skills & Inventory) */}
        <div className="flex-1 min-w-0 flex flex-col gap-6">
          {/* SKILLS SECTION */}
          <Card className="bg-zinc-900 border border-zinc-800 shadow-none">
            <CardHeader className="flex flex-col items-start justify-between pb-2 border-b border-zinc-800/50 gap-2">
              <div className="flex w-full items-center justify-between">
                <div className="text-lg font-bold flex items-center gap-2 text-zinc-100">
                  Perícias & Proficiências
                </div>
                <div className="flex gap-2">
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        size="sm"
                        variant="bordered"
                        className="border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600"
                      >
                        <Filter size={14} className="mr-1" />
                        {skillFilter === 'Todos' ? 'Filtrar' : skillFilter}
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      aria-label="Filtrar Perícias"
                      onAction={(key) => setSkillFilter(key as string)}
                      className="bg-zinc-900 border border-zinc-800 text-zinc-300"
                    >
                      <DropdownItem key="Todos">Todos os Atributos</DropdownItem>
                      <DropdownItem key="FOR">Força (FOR)</DropdownItem>
                      <DropdownItem key="AGI">Agilidade (AGI)</DropdownItem>
                      <DropdownItem key="INT">Intelecto (INT)</DropdownItem>
                      <DropdownItem key="VIG">Vigor (VIG)</DropdownItem>
                      <DropdownItem key="PRE">Presença (PRE)</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                  {isLearningSkills ? (
                    <Button
                      size="sm"
                      color="success"
                      className="font-bold text-white"
                      isLoading={isSavingSkills}
                      onPress={saveSkills}
                    >
                      <Save size={14} className="mr-1" />
                      Salvar Perícias
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      color="primary"
                      className="font-bold"
                      onPress={() => setIsLearningSkills(true)}
                    >
                      <Plus size={14} className="mr-1" />
                      Aprender Perícia
                    </Button>
                  )}
                </div>
              </div>
              {/* Calculate paid skills count for visibility check */}
              {(() => {
                const allPoolSkills = classSkillPools.flatMap((p) => p.skills)
                const regularSkills = trainedSkills.filter(
                  (skill) =>
                    !originSkillsFromOrigin.includes(skill) &&
                    !classMandatorySkills.includes(skill) &&
                    !allPoolSkills.includes(skill)
                )
                const extraPoolSkills = classSkillPools.reduce((sum, pool) => {
                  const count = trainedSkills.filter((s) => pool.skills.includes(s)).length
                  return sum + Math.max(0, count - pool.required)
                }, 0)
                const paidCount = regularSkills.length + extraPoolSkills
                const remainingSkills = Math.max(0, availableSkillsToChoose - paidCount)
                const hasExtraInfo =
                  originProvidedSkills > 0 ||
                  classMandatorySkills.length > 0 ||
                  classSkillPools.length > 0

                return (
                  <div className="w-full h-[32px] relative">
                    <div className="absolute inset-0">
                      <div className="text-xs text-zinc-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-md w-full flex items-center justify-between h-full">
                        <span>
                          Você pode escolher{' '}
                          <strong className="text-blue-400">{remainingSkills}</strong>{' '}
                          {remainingSkills === 1 ? 'perícia' : 'perícias'} livremente
                          {showSkillInfo && (
                            <>
                              {originProvidedSkills > 0 && (
                                <span className="text-zinc-500">
                                  {' '}
                                  + {originProvidedSkills} da origem
                                </span>
                              )}
                              {classMandatorySkills.length > 0 && (
                                <span className="text-amber-400">
                                  {' '}
                                  + {classMandatorySkills.join(', ')} (classe)
                                </span>
                              )}
                              {classSkillPools.length > 0 && (
                                <span className="text-cyan-400">
                                  , escolha entre{' '}
                                  {classSkillPools
                                    .map((p) => p.skills.join(' ou '))
                                    .join(' e escolha entre ')}
                                </span>
                              )}
                            </>
                          )}
                          .
                          {character.nex >= 35 && (
                            <span className="ml-4 border-l border-blue-500/30 pl-4">
                              E{' '}
                              <strong className="text-purple-400">
                                {totalVeteranSkillsAllowed - veteranSkills.length}
                              </strong>{' '}
                              para Veterano (+10).
                            </span>
                          )}
                        </span>
                        {hasExtraInfo && (
                          <span
                            className="text-zinc-500 hover:text-zinc-300 cursor-pointer hidden md:inline transition-colors"
                            onClick={() => setShowSkillInfo(!showSkillInfo)}
                          >
                            {showSkillInfo ? 'Ocultar detalhes' : 'Ver detalhes'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })()}
            </CardHeader>
            <CardBody className="p-4">
              <div className="grid grid-cols-7 gap-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                {allSkills
                  .filter((skill) => skillFilter === 'Todos' || skill.attr === skillFilter)
                  .map((skill, index) => {
                    const isTrained = trainedSkills.includes(skill.name)
                    const isVeteran = veteranSkills.includes(skill.name)
                    const isFromOrigin = originSkillsFromOrigin.includes(skill.name)
                    const isClassMandatory = classMandatorySkills.includes(skill.name)
                    const isLocked = isFromOrigin || isClassMandatory
                    const skillPool = classSkillPools.find((pool) =>
                      pool.skills.includes(skill.name)
                    )
                    const isClassPool = !!skillPool

                    // Check if this pool already has the required choice made
                    let isPoolComplete = false
                    let isPoolExtra = false
                    if (skillPool) {
                      const poolSkillsChosen = trainedSkills.filter((s) =>
                        skillPool.skills.includes(s)
                      )
                      isPoolComplete = poolSkillsChosen.length >= skillPool.required
                      if (isTrained) {
                        const thisSkillIndex = poolSkillsChosen.indexOf(skill.name)
                        // Skills beyond the required count are "extras"
                        isPoolExtra = thisSkillIndex >= skillPool.required
                      }
                    }

                    // Only show cyan highlight if pool is not complete yet
                    const showPoolHighlight = isClassPool && !isPoolComplete

                    return (
                      <Button
                        key={index}
                        variant={isTrained ? 'flat' : 'flat'}
                        color={isVeteran ? 'secondary' : isTrained ? 'primary' : 'default'}
                        onPress={() =>
                          isLearningSkills && !isLocked ? toggleSkillTraining(skill.name) : null
                        }
                        onContextMenu={(e) => handleSkillContextMenu(skill.name, e)}
                        className={`h-auto py-2 flex flex-col items-center justify-center gap-1 rounded-lg transition-all ${isLearningSkills && !isLocked
                          ? 'cursor-pointer hover:scale-105'
                          : isLocked && isTrained
                            ? 'cursor-not-allowed opacity-75'
                            : ''
                          } ${!isTrained
                            ? showPoolHighlight
                              ? 'bg-cyan-900/30 border border-cyan-700/50 text-cyan-400 hover:text-white hover:bg-cyan-900/50 hover:border-cyan-600'
                              : 'bg-zinc-800/50 border border-zinc-700/50 text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-zinc-600'
                            : isVeteran
                              ? 'border border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.3)] bg-purple-500/20 text-purple-100'
                              : isClassMandatory
                                ? 'border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)] bg-amber-500/10'
                                : isClassPool && !isPoolExtra
                                  ? 'border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)] bg-cyan-500/10'
                                  : 'border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                          }`}
                        title={
                          isFromOrigin && isTrained
                            ? 'Perícia fornecida pela origem (não pode remover)'
                            : isClassMandatory && isTrained
                              ? 'Perícia obrigatória da classe (não pode remover)'
                              : showPoolHighlight
                                ? `Escolha obrigatória: ${skillPool?.name} (grátis)`
                                : isClassPool && isPoolExtra
                                  ? 'Escolha extra (custa 1 ponto)'
                                  : ''
                        }
                      >
                        <span className="text-xs font-bold truncate w-full text-center">
                          {skill.name}
                        </span>
                        <div className="flex items-center gap-1 text-[10px]">
                          <span className="opacity-70">{skill.attr}</span>
                          {isVeteran ? (
                            <span className="font-bold text-purple-400">+10</span>
                          ) : isTrained ? (
                            <span className="font-bold text-blue-400">+5</span>
                          ) : null}
                        </div>
                      </Button>
                    )
                  })}
              </div>
            </CardBody>
          </Card>

          {/* INVENTORY SECTION */}
          <Card className="bg-zinc-900 border border-zinc-800 shadow-none flex-1 flex flex-col">
            <Tabs
              aria-label="Inventário"
              variant="underlined"
              classNames={{
                base: 'w-full',
                tabList:
                  'gap-6 w-full relative rounded-none p-0 px-6 border-b border-zinc-800 custom-scrollbar',
                cursor: 'w-full bg-orange-500',
                tab: 'max-w-fit px-0 h-14',
                tabContent: 'group-data-[selected=true]:text-orange-500 text-zinc-400 font-bold',
                panel: 'p-0',
              }}
            >
              <Tab
                key="inventory"
                title={
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    <span>Inventário</span>
                  </div>
                }
              >
                <div className="p-5">
                  {/* Inventory Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-orange-500/20 rounded text-orange-500">
                        <div className="w-4 h-4 border-2 border-orange-500 rounded-sm"></div>
                      </div>
                      <h3 className="text-lg font-bold text-zinc-100">Inventário</h3>
                    </div>
                    <Button
                      size="sm"
                      className="bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700"
                      onPress={onAddItemModalOpen}
                    >
                      <Plus size={14} className="mr-2" /> Adicionar Item
                    </Button>
                  </div>

                  {/* Weight Bar + Rank Selection */}
                  <div className="flex flex-col gap-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-500">⚖️</span>
                        <span
                          className={`text-xs ${inventoryCapacity.isOverloaded ? 'font-bold text-amber-500' : 'text-zinc-400'}`}
                        >
                          {inventoryCapacity.used} / {inventoryCapacity.limit} Espaços
                        </span>
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-zinc-800">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${inventoryCapacity.used > inventoryCapacity.maxCapacity
                              ? 'bg-red-500'
                              : inventoryCapacity.isOverloaded
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                              }`}
                            style={{
                              width: `${Math.min((inventoryCapacity.used / inventoryCapacity.limit) * 100, 100)}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold text-zinc-500">
                          Patente:
                        </span>
                        <Dropdown>
                          <DropdownTrigger>
                            <Button
                              size="sm"
                              variant="flat"
                              className="bg-zinc-800 text-orange-400 font-bold border border-zinc-700 h-7 px-2"
                              isLoading={isUpdatingRank}
                            >
                              {rank} <ChevronDown size={14} className="ml-1" />
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu
                            aria-label="Selecionar Patente"
                            onAction={(key) => setRank(key as string)}
                            selectedKeys={[rank]}
                            selectionMode="single"
                            className="bg-zinc-900 border border-zinc-800"
                          >
                            {RANK_OPTIONS.map((opt) => (
                              <DropdownItem
                                key={opt}
                                className={rank === opt ? 'text-orange-400 font-bold' : ''}
                              >
                                {opt}
                              </DropdownItem>
                            ))}
                          </DropdownMenu>
                        </Dropdown>
                      </div>
                    </div>

                    {/* Category Limits Display */}
                    <div className="flex items-center flex-wrap gap-2">
                      {[1, 2, 3, 4].map((cat) => {
                        const used = categoryConsumption[cat] || 0
                        const limit = RANK_LIMITS[rank]?.[cat] ?? 0
                        const isFull = used >= limit && limit > 0
                        const isEmpty = limit === 0

                        return (
                          <Chip
                            key={cat}
                            size="sm"
                            variant="dot"
                            color={isEmpty ? 'default' : isFull ? 'danger' : 'primary'}
                            className={`bg-zinc-800/50 border-zinc-700 ${isEmpty ? 'opacity-40' : ''}`}
                            classNames={{
                              content: 'font-bold text-[10px]',
                            }}
                          >
                            CAT {categoryLabels[cat]}: {used}/{limit}
                          </Chip>
                        )
                      })}
                    </div>

                    {inventoryCapacity.isOverloaded && (
                      <div className="flex items-center gap-1.5 rounded-md bg-amber-500/10 px-2 py-1 text-[10px] text-amber-500 border border-amber-500/20">
                        <span className="animate-pulse font-bold">⚠️ SOBRECARGA:</span>
                        <span>–5 em Defesa e Testes (Deslocamento Reduzido)</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <select className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1 text-xs text-zinc-300">
                          <option>Todos os Tipos</option>
                          <option>Arma</option>
                          <option>Armadura</option>
                          <option>Consumível</option>
                          <option>Diversos</option>
                        </select>
                        <button className="flex items-center gap-1 rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1 text-xs text-zinc-400 hover:text-white">
                          ↑ Nome
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 overflow-y-auto custom-scrollbar">
                    {inventory.map((item) => {
                      const isExpanded = expandedItemId === item.uniqueId
                      const getIconForItem = () => {
                        if (item.type === 'Arma') {
                          return <Sword size={18} />
                        }
                        if (item.type === 'Armadura') {
                          return <Shield size={18} />
                        }
                        if (item.type === 'Consumível') {
                          return <Zap size={18} />
                        }
                        return <Activity size={18} />
                      }
                      const getIconColors = () => {
                        if (item.type === 'Arma') {
                          return 'bg-orange-500/10 border-orange-500/20 text-orange-400'
                        }
                        if (item.type === 'Armadura') {
                          return 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                        }
                        if (item.type === 'Consumível') {
                          return 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                        }
                        return 'bg-orange-500/10 border-orange-500/20 text-orange-400'
                      }
                      const categoryLabels: Record<number, string> = {
                        0: '0',
                        1: 'I',
                        2: 'II',
                        3: 'III',
                        4: 'IV',
                      }
                      return (
                        <div
                          key={item.uniqueId}
                          className="rounded-lg border border-zinc-800 bg-zinc-950/50 hover:bg-zinc-950 transition-all overflow-hidden"
                        >
                          <div
                            onClick={() => setExpandedItemId(isExpanded ? null : item.uniqueId)}
                            className="flex items-center justify-between p-3 cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-2.5 rounded-lg border ${getIconColors()}`}>
                                {getIconForItem()}
                              </div>
                              <div>
                                <div className="font-semibold text-zinc-200 text-sm">
                                  {item.name}
                                </div>
                                <div className="text-[11px] text-zinc-500">{item.desc}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-zinc-500">x{item.qty}</span>
                              <span className="text-xs text-zinc-500">{item.weight}</span>
                              <span className="px-2 py-0.5 rounded border border-zinc-700 bg-zinc-800 text-zinc-400 text-xs">
                                {item.type === 'Equipamento' ? 'Equip' : item.type}
                              </span>
                              {!isExpanded && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    removeItem(item.id)
                                  }}
                                  className="text-zinc-600 hover:text-red-400 transition-colors"
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                              <ChevronDown
                                size={14}
                                className={`text-zinc-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                              />
                            </div>
                          </div>
                          {isExpanded && item.type === 'Arma' && (
                            <div className="px-3 pb-3 pt-0 border-t border-zinc-800/50 mt-1">
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                                <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-2">
                                  <p className="text-[9px] uppercase tracking-wider text-orange-400/90 font-bold">
                                    Dano
                                  </p>
                                  <p className="text-sm font-bold text-orange-300 mt-0.5">
                                    {item.damage ?? '—'}
                                    {item.damageType ? (
                                      <span className="text-xs font-normal text-orange-200/90">
                                        {' '}
                                        ({item.damageType})
                                      </span>
                                    ) : null}
                                  </p>
                                </div>
                                <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-2">
                                  <p className="text-[9px] uppercase tracking-wider text-orange-400/90 font-bold">
                                    Categoria
                                  </p>
                                  <p className="text-sm font-bold text-orange-300 mt-0.5">
                                    {(item.category != null && item.category > 0)
                                      ? (categoryLabels[item.category] ?? item.category)
                                      : '0'}
                                  </p>
                                </div>
                                <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-2">
                                  <p className="text-[9px] uppercase tracking-wider text-orange-400/90 font-bold">
                                    Alcance
                                  </p>
                                  <p className="text-sm font-bold text-orange-300 mt-0.5">
                                    {item.range ?? '—'}
                                  </p>
                                </div>
                                <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-2">
                                  <p className="text-[9px] uppercase tracking-wider text-orange-400/90 font-bold">
                                    Margem de Crítico
                                  </p>
                                  <p className="text-sm font-bold text-orange-300 mt-0.5">
                                    {item.critical ?? '—'}
                                  </p>
                                </div>
                                <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-2">
                                  <p className="text-[9px] uppercase tracking-wider text-orange-400/90 font-bold">
                                    Multiplicador
                                  </p>
                                  <p className="text-sm font-bold text-orange-300 mt-0.5">
                                    {item.criticalMultiplier ?? '—'}
                                  </p>
                                </div>
                              </div>
                              <div className="flex justify-end mt-2 mb-2">
                                <button
                                  className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    removeItem(item.id)
                                  }}
                                >
                                  <Trash2 size={12} /> Remover item
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </Tab>
              <Tab
                key="rituals"
                title={
                  <div className="flex items-center space-x-2">
                    <span>🔥 Rituais</span>
                  </div>
                }
              >
                <div className="p-6">
                  {/* Rituals Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-red-500/20 rounded text-red-500">
                        <div className="w-4 h-4 border-2 border-red-500 rounded-sm"></div>
                      </div>
                      <h3 className="text-lg font-bold text-zinc-100">Rituais</h3>
                    </div>
                    <Button
                      size="sm"
                      className="bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700"
                      onPress={() => setIsRitualSelectOpen(true)}
                    >
                      <Plus size={14} className="mr-2" /> Aprender Ritual
                    </Button>
                  </div>

                  {/* Rituals List */}
                  <div className="space-y-4 overflow-y-auto custom-scrollbar">
                    {character.rituals && character.rituals.length > 0 ? (
                      character.rituals.map((charRitual: any) => {
                        const ritual = charRitual.ritual
                        if (!ritual) return null

                        const elementColor = (({
                          CONHECIMENTO: 'text-amber-400',
                          ENERGIA: 'text-purple-400',
                          MORTE: 'text-zinc-400',
                          SANGUE: 'text-red-400',
                          MEDO: 'text-white p-0.5 bg-zinc-800 rounded border border-white/20',
                        } as Record<string, string>)[(ritual.element || '').toUpperCase()]) || 'text-zinc-400'

                        return (
                          <Card
                            key={charRitual.id}
                            className="bg-zinc-950/50 border border-zinc-800 hover:border-zinc-700 transition-all"
                          >
                            <CardBody className="space-y-3">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-bold text-zinc-100">{ritual.name}</h3>
                                    <Chip size="sm" variant="flat" className="bg-zinc-900 text-zinc-400">
                                      {ritual.circle}º Círculo
                                    </Chip>
                                  </div>
                                  <p className={`text-xs font-bold uppercase ${elementColor} mt-1`}>
                                    {ritual.element}
                                  </p>
                                </div>
                                <Button
                                  isIconOnly
                                  size="sm"
                                  variant="light"
                                  color="danger"
                                  className="opacity-50 hover:opacity-100"
                                  onPress={() => removeRitual(ritual.id)}
                                >
                                  <Trash2 size={14} />
                                </Button>
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-zinc-500 uppercase font-bold bg-zinc-900/50 p-2 rounded">
                                <div>
                                  <span className="text-zinc-600 block">Execução</span> {ritual.execution}
                                </div>
                                <div>
                                  <span className="text-zinc-600 block">Alcance</span> {ritual.range}
                                </div>
                                <div>
                                  <span className="text-zinc-600 block">Duração</span> {ritual.duration}
                                </div>
                                {ritual.resistance && (
                                  <div>
                                    <span className="text-zinc-600 block">Resistência</span> {ritual.resistance}
                                  </div>
                                )}
                              </div>

                              {ritual.description && (
                                <p className="text-sm text-zinc-300 italic leading-relaxed">
                                  {ritual.description}
                                </p>
                              )}

                              {(ritual.discente || ritual.verdadeiro) && (
                                <div className="space-y-2 mt-2 pt-2 border-t border-zinc-800/50 text-xs text-zinc-400">
                                  {ritual.discente && (
                                    <div>
                                      <span className="text-blue-400 font-bold uppercase mr-1">Discente:</span>
                                      {ritual.discente}
                                    </div>
                                  )}
                                  {ritual.verdadeiro && (
                                    <div>
                                      <span className="text-purple-400 font-bold uppercase mr-1">Verdadeiro:</span>
                                      {ritual.verdadeiro}
                                    </div>
                                  )}
                                </div>
                              )}
                            </CardBody>
                          </Card>
                        )
                      })
                    ) : (
                      <div className="text-zinc-500 text-center italic py-12 bg-zinc-950/20 rounded-xl border border-dashed border-zinc-800">
                        Nenhum ritual aprendido. Use o botão acima para adicionar.
                      </div>
                    )}
                  </div>
                </div>
              </Tab>
              <Tab
                key="combat"
                title={
                  <div className="flex items-center space-x-2">
                    <span>⚔️ Combate</span>
                  </div>
                }
              >
                <div className="p-6">
                  {/* Combat Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-red-600/20 rounded text-red-500">
                        <div className="w-4 h-4 border-2 border-red-600 rounded-sm"></div>
                      </div>
                      <h3 className="text-lg font-bold text-zinc-100">Combate</h3>
                    </div>
                    <Button
                      size="sm"
                      className="bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700"
                    >
                      <Plus size={14} className="mr-2" /> Adicionar Atalho
                    </Button>
                  </div>

                  {/* Combat List */}
                  <div className="space-y-6 overflow-y-auto custom-scrollbar">
                    {/* HABILIDADES DE COMBATE DA CLASSE */}
                    {character.classAbilities && character.classAbilities.length > 0 ? (
                      <div>
                        <h4 className="font-bold text-red-400 text-sm uppercase tracking-wider mb-3">
                          Habilidades de Combate
                        </h4>
                        <div className="space-y-2">
                          {character.classAbilities.map((ability, idx) => (
                            <div key={idx}>
                              {/* Perito: Show configured skills for rolling */}
                              {ability.classAbility?.name === 'Perito' &&
                                ability.config?.selectedSkills ? (
                                <div className="space-y-3">
                                  {ability.config.selectedSkills.map((skillName: string) => {
                                    const currentPe = peritoPeSpending[skillName] || 2
                                    const diceBonus =
                                      currentPe === 2
                                        ? '1d6'
                                        : currentPe === 3
                                          ? '1d8'
                                          : currentPe === 4
                                            ? '1d10'
                                            : '1d12'

                                    return (
                                      <div
                                        key={skillName}
                                        className="p-4 bg-zinc-950/50 rounded-lg border border-red-500/30 space-y-3"
                                      >
                                        <div className="flex items-center justify-between">
                                          <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                              <h5 className="font-semibold text-red-300">
                                                {ability.classAbility?.name} - {skillName}
                                              </h5>
                                              <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">
                                                {currentPe} PE = +{diceBonus}
                                              </span>
                                            </div>
                                          </div>
                                          <Button
                                            isIconOnly
                                            size="sm"
                                            className="ml-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40"
                                          >
                                            <Dices size={14} />
                                          </Button>
                                        </div>

                                        {/* PE Cost Slider - Only show if NEX > 5 and max PE > 2 */}
                                        {character.nex > 5 && maxPeritoPe > 2 && (
                                          <div className="space-y-2">
                                            <div className="flex items-center justify-between text-xs">
                                              <span className="text-zinc-400">Gastar PE:</span>
                                              <span className="text-red-400 font-bold">
                                                {currentPe} PE
                                              </span>
                                            </div>
                                            <input
                                              type="range"
                                              min={2}
                                              max={maxPeritoPe}
                                              step={1}
                                              value={currentPe}
                                              onChange={(e) => {
                                                setPeritoPeSpending({
                                                  ...peritoPeSpending,
                                                  [skillName]: parseInt(e.target.value),
                                                })
                                              }}
                                              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-500"
                                            />
                                            <div className="flex justify-between text-xs text-zinc-500 px-1">
                                              <span>2</span>
                                              <span>{maxPeritoPe}</span>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )
                                  })}
                                </div>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-zinc-500 text-center italic py-8">
                        Nenhuma habilidade de combate disponível.
                      </div>
                    )}
                  </div>
                </div>
              </Tab>
              <Tab
                key="skills"
                title={
                  <div className="flex items-center space-x-2">
                    <span>⚡ Habilidades</span>
                  </div>
                }
              >
                <div className="p-6">
                  {/* Skills Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-amber-500/20 rounded text-amber-500">
                        <div className="w-4 h-4 border-2 border-amber-500 rounded-sm"></div>
                      </div>
                      <h3 className="text-lg font-bold text-zinc-100">Habilidades</h3>
                      <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-500/40 rounded text-amber-300 text-xs font-bold">
                        {chosenClassAbilities}/{maxClassAbilities}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {character.trailId && futureTrailAbilities.length > 0 && (
                        <Dropdown isOpen={isTrailPowersOpen} onOpenChange={onTrailPowersOpenChange}>
                          <DropdownTrigger>
                            <Button
                              size="sm"
                              className="bg-purple-800 hover:bg-purple-700 text-white border border-purple-700"
                            >
                              <Sparkles size={14} className="mr-2" /> Poderes de Trilha
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu
                            aria-label="Trail powers"
                            className="max-h-96 overflow-y-auto"
                            classNames={{
                              base: 'bg-zinc-900 border border-zinc-800',
                              list: 'bg-zinc-900',
                            }}
                          >
                            {futureTrailAbilities.map((prog) => (
                              <DropdownItem
                                key={prog.id}
                                textValue={prog.title}
                                className="px-3 py-2 data-[hover=true]:bg-zinc-800"
                              >
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <h5 className="font-semibold text-purple-300">{prog.title}</h5>
                                    <span className="px-1.5 py-0.5 bg-purple-500/20 border border-purple-500/40 rounded text-purple-300 text-xs font-bold">
                                      NEX {prog.nex}%
                                    </span>
                                  </div>
                                  {prog.description && (
                                    <p className="text-zinc-400 text-xs leading-relaxed">
                                      {prog.description}
                                    </p>
                                  )}
                                </div>
                              </DropdownItem>
                            ))}
                          </DropdownMenu>
                        </Dropdown>
                      )}

                      {/* Trail selection button for characters with no trail and eligible class trails */}
                      {hasNoTrail && classTrails.length > 0 && (
                        <Button
                          size="sm"
                          className="bg-purple-700 hover:bg-purple-800 text-white border border-purple-700"
                          onPress={onTrailModalOpen}
                        >
                          <Sparkles size={14} className="mr-2" /> Escolher Trilha
                        </Button>
                      )}
                      <Button
                        size="sm"
                        className="bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700"
                        onPress={onAbilitySelectOpen}
                        isDisabled={!canChooseMore || availableAbilities.length === 0}
                      >
                        <Plus size={14} className="mr-2" /> Adicionar Habilidade
                      </Button>
                    </div>
                  </div>

                  {/* Skills List */}
                  <div className="space-y-6 overflow-y-auto custom-scrollbar">
                    {/* HABILIDADES OBRIGATÓRIAS DA CLASSE */}
                    {(() => {
                      const mandatoryAbilities =
                        character.classAbilities?.filter((ability) => {
                          const effects =
                            typeof ability.classAbility?.effects === 'string'
                              ? JSON.parse(ability.classAbility?.effects || '{}')
                              : ability.classAbility?.effects || {}
                          return effects.mandatory === true
                        }) || []

                      return mandatoryAbilities.length > 0 ? (
                        <div>
                          <button
                            onClick={() => toggleSection('classAbilities')}
                            className="w-full flex items-center gap-2 mb-3 hover:opacity-75 transition-opacity"
                          >
                            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                            <h4 className="font-bold text-amber-400 text-sm uppercase tracking-wider flex-1 text-left">
                              Obrigatórias da Classe
                            </h4>
                            <motion.div
                              animate={{ rotate: expandedSections.classAbilities ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown size={16} className="text-amber-400" />
                            </motion.div>
                          </button>
                          <AnimatePresence>
                            {expandedSections.classAbilities && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-2"
                              >
                                {mandatoryAbilities.map((ability, idx) => (
                                  <div
                                    key={idx}
                                    className="p-3 bg-zinc-950/50 hover:bg-zinc-950 rounded-lg border border-amber-500/30 hover:border-amber-500/50 transition-all"
                                  >
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                          <h5 className="font-semibold text-amber-300">
                                            {ability.classAbility?.name}
                                          </h5>
                                          {ability.classAbility?.name === 'Perito' &&
                                            ability.config?.selectedSkills && (
                                              <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/40 rounded text-emerald-300 text-xs font-bold">
                                                ✓ Configurada
                                              </span>
                                            )}
                                        </div>
                                        <p className="text-zinc-400 text-xs leading-relaxed mt-1">
                                          {ability.classAbility?.description}
                                        </p>
                                        {ability.classAbility?.name === 'Perito' &&
                                          ability.config?.selectedSkills && (
                                            <p className="text-zinc-500 text-xs mt-2">
                                              <span className="text-amber-400">Perícias:</span>{' '}
                                              {ability.config.selectedSkills.join(', ')}
                                            </p>
                                          )}
                                      </div>
                                      {ability.classAbility?.name === 'Perito' && (
                                        <Button
                                          isIconOnly
                                          size="sm"
                                          className="ml-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40"
                                          onPress={() => openAbilityConfig(ability)}
                                        >
                                          <Edit3 size={14} />
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : null
                    })()}

                    {/* HABILIDADES ESCOLHIDAS */}
                    {(() => {
                      const chosenAbilities =
                        character.classAbilities?.filter((ability) => {
                          const effects =
                            typeof ability.classAbility?.effects === 'string'
                              ? JSON.parse(ability.classAbility?.effects || '{}')
                              : ability.classAbility?.effects || {}
                          return effects.mandatory !== true
                        }) || []

                      return (
                        <div>
                          <button
                            onClick={() => toggleSection('chosenAbilities')}
                            className="w-full flex items-center gap-2 mb-3 hover:opacity-75 transition-opacity"
                          >
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <h4 className="font-bold text-blue-400 text-sm uppercase tracking-wider flex-1 text-left">
                              Habilidades Escolhidas
                            </h4>
                            <motion.div
                              animate={{ rotate: expandedSections.chosenAbilities ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown size={16} className="text-blue-400" />
                            </motion.div>
                          </button>
                          <AnimatePresence>
                            {expandedSections.chosenAbilities && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-2"
                              >
                                {chosenAbilities.length > 0 ? (
                                  chosenAbilities.map((ability, idx) => (
                                    <div
                                      key={idx}
                                      className="p-3 bg-zinc-950/50 hover:bg-zinc-950 rounded-lg border border-blue-500/30 hover:border-blue-500/50 transition-all"
                                    >
                                      <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-1">
                                            <h5 className="font-semibold text-blue-300">
                                              {ability.classAbility?.name}
                                            </h5>
                                            {ability.classAbility?.effects?.nex && (
                                              <span className="px-1.5 py-0.5 bg-blue-500/20 border border-blue-500/40 rounded text-blue-300 text-xs font-bold">
                                                NEX {ability.classAbility.effects.nex}
                                              </span>
                                            )}
                                          </div>
                                          <p className="text-zinc-400 text-xs leading-relaxed mt-1">
                                            {ability.classAbility?.description}
                                          </p>
                                        </div>
                                        <div className="flex items-center gap-2 ml-2">
                                          {ability.classAbility?.name === 'Perito' && (
                                            <Button
                                              isIconOnly
                                              size="sm"
                                              className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/40"
                                              onPress={() => openAbilityConfig(ability)}
                                            >
                                              <Edit3 size={14} />
                                            </Button>
                                          )}
                                          <Button
                                            isIconOnly
                                            size="sm"
                                            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40"
                                            onPress={() => {
                                              if (
                                                confirm(
                                                  'Tem certeza que deseja remover esta habilidade?'
                                                )
                                              ) {
                                                router.delete(
                                                  `/characters/${character.id}/abilities/${ability.classAbilityId}`
                                                )
                                              }
                                            }}
                                          >
                                            <Trash2 size={14} />
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="p-3 bg-zinc-950/30 rounded-lg border border-zinc-700/30 text-zinc-500 text-xs italic text-center">
                                    Nenhuma habilidade escolhida. Use o botão "Adicionar Habilidade"
                                    acima.
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )
                    })()}

                    {character.paranormalPowers && character.paranormalPowers.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-zinc-800">
                        <button
                          onClick={() => toggleSection('paranormalPowers')}
                          className="w-full flex items-center gap-2 mb-3 hover:opacity-75 transition-opacity"
                        >
                          <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse"></div>
                          <h4 className="font-bold text-purple-400 text-sm uppercase tracking-wider flex-1 text-left">
                            Poderes Paranormais
                          </h4>
                          <motion.div
                            animate={{ rotate: expandedSections.paranormalPowers ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown size={16} className="text-purple-400" />
                          </motion.div>
                        </button>
                        <AnimatePresence>
                          {expandedSections.paranormalPowers && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="space-y-4"
                            >
                              {character.paranormalPowers.map((power, idx) => {
                                const p = power.paranormalPower
                                const elementColor = {
                                  Conhecimento: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
                                  Energia: 'bg-purple-500/10 border-purple-500/30 text-purple-300',
                                  Morte: 'bg-zinc-500/10 border-zinc-500/30 text-zinc-300',
                                  Sangue: 'bg-red-500/10 border-red-500/30 text-red-300',
                                  Varia: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
                                }[p?.element || ''] || 'bg-zinc-500/10 border-zinc-500/30 text-zinc-300'

                                return (
                                  <div
                                    key={idx}
                                    className={`p-4 rounded-lg border flex flex-col gap-3 transition-all hover:bg-zinc-950/80 ${elementColor}`}
                                  >
                                    <div className="flex items-start justify-between">
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <h5 className="font-bold text-base">{p?.name}</h5>
                                          <span className="text-[10px] font-black uppercase tracking-widest opacity-70">
                                            {p?.element}
                                          </span>
                                        </div>
                                        {p?.requirements && (
                                          <p className="text-[10px] opacity-60 uppercase mt-0.5">
                                            Requisito: {p.requirements}
                                          </p>
                                        )}
                                      </div>
                                      <Button
                                        isIconOnly
                                        size="sm"
                                        variant="light"
                                        className="text-current opacity-40 hover:opacity-100"
                                        onPress={() => p?.id && removeParanormalPower(p.id)}
                                      >
                                        <Trash2 size={14} />
                                      </Button>
                                    </div>

                                    {p?.description && (
                                      <p className="text-xs leading-relaxed opacity-90 italic">
                                        {p.description}
                                      </p>
                                    )}

                                    <div className="flex flex-col gap-2 pt-2 border-t border-current/20">
                                      {p?.effects?.main && (
                                        <div>
                                          <p className="text-[9px] font-black uppercase opacity-60 mb-1">
                                            Efeito
                                          </p>
                                          <p className="text-xs leading-relaxed opacity-100">
                                            {p.effects.main}
                                          </p>
                                        </div>
                                      )}
                                      {p?.effects?.affinity && (
                                        <div className="bg-white/5 p-2 rounded border border-white/10 mt-1">
                                          <p className="text-[9px] font-black uppercase text-white/50 mb-1">
                                            Afinidade
                                          </p>
                                          <p className="text-xs leading-relaxed text-white/80">
                                            {p.effects.affinity}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {character.rituals && character.rituals.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-zinc-800">
                        <button
                          onClick={() => toggleSection('rituals')}
                          className="w-full flex items-center gap-2 mb-3 hover:opacity-75 transition-opacity"
                        >
                          <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
                          <h4 className="font-bold text-blue-400 text-sm uppercase tracking-wider flex-1 text-left">
                            Rituais Aprendidos
                          </h4>
                          <motion.div
                            animate={{ rotate: expandedSections.rituals ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown size={16} className="text-blue-400" />
                          </motion.div>
                        </button>
                        <AnimatePresence>
                          {expandedSections.rituals && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="space-y-4"
                            >
                              {character.rituals.map((characterRitual, idx) => {
                                const r = characterRitual.ritual
                                const elementColor = {
                                  Conhecimento: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
                                  Energia: 'bg-purple-500/10 border-purple-500/30 text-purple-300',
                                  Morte: 'bg-zinc-500/10 border-zinc-500/30 text-zinc-300',
                                  Sangue: 'bg-red-500/10 border-red-500/30 text-red-300',
                                }[r?.element || ''] || 'bg-zinc-500/10 border-zinc-500/30 text-zinc-300'

                                return (
                                  <div
                                    key={idx}
                                    className={`p-4 rounded-lg border flex flex-col gap-3 transition-all hover:bg-zinc-950/80 ${elementColor}`}
                                  >
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                          <h5 className="font-bold text-base">{r?.name}</h5>
                                          <Chip
                                            size="sm"
                                            variant="flat"
                                            className="bg-black/20 text-current border-current/20"
                                          >
                                            {r?.circle}º Círculo
                                          </Chip>
                                          <span className="text-[10px] font-black uppercase tracking-widest opacity-70">
                                            {r?.element}
                                          </span>
                                        </div>
                                      </div>
                                      <Button
                                        isIconOnly
                                        size="sm"
                                        variant="light"
                                        className="text-current opacity-40 hover:opacity-100"
                                        onPress={() => r?.id && removeRitual(r.id)}
                                      >
                                        <Trash2 size={14} />
                                      </Button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] uppercase font-bold opacity-70">
                                      <div>
                                        <span className="opacity-50">Execução:</span> {r?.execution}
                                      </div>
                                      <div>
                                        <span className="opacity-50">Alcance:</span> {r?.range}
                                      </div>
                                      <div>
                                        <span className="opacity-50">Alvo:</span> {r?.target}
                                      </div>
                                      <div>
                                        <span className="opacity-50">Duração:</span> {r?.duration}
                                      </div>
                                    </div>

                                    {r?.description && (
                                      <p className="text-xs leading-relaxed opacity-90 italic border-t border-current/10 pt-2">
                                        {r.description}
                                      </p>
                                    )}
                                  </div>
                                )
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {/* HABILIDADES DE TRILHA */}
                    {character.trail &&
                      currentTrailAbilities &&
                      currentTrailAbilities.length > 0 && (
                        <div>
                          <button
                            onClick={() => toggleSection('trailAbilities')}
                            className="w-full flex items-center gap-2 mb-3 hover:opacity-75 transition-opacity"
                          >
                            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                            <h4 className="font-bold text-purple-400 text-sm uppercase tracking-wider flex-1 text-left">
                              Trilha: {character.trail.name}
                            </h4>
                            <motion.div
                              animate={{ rotate: expandedSections.trailAbilities ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown size={16} className="text-purple-400" />
                            </motion.div>
                          </button>
                          <AnimatePresence>
                            {expandedSections.trailAbilities && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-2"
                              >
                                {currentTrailAbilities.map((progression, idx) => (
                                  <div
                                    key={idx}
                                    className="p-3 bg-zinc-950/50 hover:bg-zinc-950 rounded-lg border border-purple-500/30 hover:border-purple-500/50 transition-all"
                                  >
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                          <h5 className="font-semibold text-purple-300">
                                            {progression.title}
                                          </h5>
                                          <span className="px-1.5 py-0.5 bg-purple-500/20 border border-purple-500/40 rounded text-purple-300 text-xs font-bold">
                                            NEX {progression.nex}%
                                          </span>
                                        </div>
                                        {progression.description && (
                                          <p className="text-zinc-400 text-xs leading-relaxed mt-1">
                                            {progression.description}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}

                    {/* PODERES PARANORMAIS */}
                    {(() => {
                      const paranormalPowers =
                        character.classAbilities?.filter(
                          (ability) => ability.classAbility?.name === 'Transcender'
                        ) || []

                      return (
                        <div>
                          <button
                            onClick={() => toggleSection('acquiredAbilities')}
                            className="w-full flex items-center gap-2 mb-3 hover:opacity-75 transition-opacity"
                          >
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <h4 className="font-bold text-red-400 text-sm uppercase tracking-wider flex-1 text-left">
                              Habilidades de Transcender ({paranormalPowers.length})
                            </h4>
                            <motion.div
                              animate={{ rotate: expandedSections.acquiredAbilities ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown size={16} className="text-red-400" />
                            </motion.div>
                          </button>
                          <AnimatePresence>
                            {expandedSections.acquiredAbilities && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-3"
                              >
                                {paranormalPowers.length > 0 ? (
                                  paranormalPowers.map((ability, idx) => (
                                    <div
                                      key={idx}
                                      className="p-3 bg-zinc-950/50 hover:bg-zinc-950 rounded-lg border border-red-500/30 hover:border-red-500/50 transition-all"
                                    >
                                      <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-1">
                                            <h5 className="font-semibold text-red-300">
                                              {ability.classAbility?.name}
                                            </h5>
                                            {ability.classAbility?.effects?.nex && (
                                              <span className="px-1.5 py-0.5 bg-red-500/20 border border-red-500/40 rounded text-red-300 text-xs font-bold">
                                                NEX {ability.classAbility.effects.nex}
                                              </span>
                                            )}
                                            {(() => {
                                              const count = paranormalPowers.filter(
                                                (p) => p.classAbility?.name === 'Transcender'
                                              ).length
                                              return count > 1 ? (
                                                <span className="px-1.5 py-0.5 bg-red-500/20 border border-red-500/40 rounded text-red-300 text-xs font-bold">
                                                  x{count}
                                                </span>
                                              ) : null
                                            })()}
                                          </div>
                                          <p className="text-zinc-400 text-xs leading-relaxed mt-1">
                                            {ability.classAbility?.description}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="p-3 bg-zinc-950/30 rounded-lg border border-zinc-700/30 text-zinc-500 text-xs italic text-center">
                                    Nenhum poder paranormal adquirido ainda
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )
                    })()}
                  </div>
                </div>
              </Tab>
            </Tabs>
          </Card>
        </div>

        {/* COLUNA DIREITA (Attributes & Stats) */}
        <div className="w-[350px] flex-shrink-0 space-y-6">
          {/* ATTRIBUTES SECTION */}
          <Card className="bg-zinc-900 border border-zinc-800 shadow-none">
            <CardHeader className="pb-2 flex justify-between items-center border-b border-zinc-800/50">
              <div className="text-lg font-bold text-zinc-100">Atributos</div>
              <div className="flex items-center gap-2">
                <Chip
                  size="sm"
                  className={`border ${availablePoints > 0 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : availablePoints < 0 ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'}`}
                >
                  {availablePoints} pts
                </Chip>
                {hasChanges && (
                  <Button
                    size="sm"
                    color="primary"
                    isLoading={isSaving}
                    onPress={saveAttributes}
                    isDisabled={availablePoints < 0}
                    className="font-bold"
                  >
                    <Save size={14} className="mr-1" />
                    Salvar
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardBody>
              {/* Points explanation */}
              <div className="text-xs text-zinc-500 mb-3 bg-zinc-950/50 p-2 rounded border border-zinc-800">
                <span className="text-zinc-400">4 pontos base</span>
                {attributeBonusFromNex > 0 && (
                  <span className="text-blue-400"> +{attributeBonusFromNex} (NEX)</span>
                )}
                {[strength, agility, intellect, vigor, presence].filter((v) => v === 0).length >
                  0 && (
                    <span className="text-emerald-400">
                      {' '}
                      +{
                        [strength, agility, intellect, vigor, presence].filter((v) => v === 0).length
                      }{' '}
                      (atributos em 0)
                    </span>
                  )}
                <span className="text-zinc-600"> | Usado: {usedPoints}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="w-[180px] h-[180px]">
                  <ResponsiveContainer width={180} height={180}>
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={attributesData}>
                      <PolarGrid stroke="#3f3f46" />
                      <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: '#a1a1aa', fontSize: 11, fontWeight: 'bold' }}
                      />
                      <Radar
                        name="Atributos"
                        dataKey="A"
                        stroke="#f97316"
                        strokeWidth={2}
                        fill="#f97316"
                        fillOpacity={0.2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Attribute Inputs Side Panel */}
                <div className="space-y-3 min-w-[120px]">
                  {attributeInputs.map((attr) => (
                    <div key={attr.label} className="flex items-center gap-3">
                      <div className={`p-1.5 rounded bg-zinc-950 ${attr.color}`}>
                        <attr.icon size={12} />
                      </div>
                      <span className="text-xs font-bold text-zinc-400 w-6">{attr.label}</span>
                      <div className="flex items-center bg-zinc-950 rounded border border-zinc-800">
                        <button
                          onClick={() => attr.set(Math.max(0, attr.val - 1))}
                          className="px-1.5 py-0.5 text-zinc-600 hover:text-white hover:bg-zinc-800 rounded-l transition-colors"
                        >
                          -
                        </button>
                        <span
                          className={`text-xs w-5 text-center font-mono ${attr.val === 0 ? 'text-emerald-400' : ''}`}
                        >
                          {attr.val}
                        </span>
                        <button
                          onClick={() => attr.set(Math.min(5, attr.val + 1))}
                          disabled={availablePoints <= 0}
                          className={`px-1.5 py-0.5 rounded-r transition-colors ${availablePoints <= 0 ? 'text-zinc-700 cursor-not-allowed' : 'text-zinc-600 hover:text-white hover:bg-zinc-800'}`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>

          {/* COMBAT DEFENSES */}
          <Card className="bg-zinc-900 border border-zinc-800 shadow-none">
            <CardHeader className="pb-2 flex justify-between items-center">
              <div className="text-sm font-bold text-zinc-200">Defesas de Combate</div>
              <div className="flex items-center gap-1 text-orange-500 text-xs font-bold uppercase tracking-wider">
                <Shield size={12} /> Armadura Leve
              </div>
            </CardHeader>
            <CardBody className="pt-0 pb-4 flex flex-col gap-4">
              {/* Defenses Display */}
              <div className="flex gap-4">
                <div className="flex-1 bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex items-center justify-between group cursor-help transition-colors hover:border-zinc-700">
                  <div>
                    <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">
                      Defesa
                    </div>
                    <div className="text-[10px] text-zinc-600">
                      10 + AGI ({agility}) + Equip ({defenseEquipBonus})
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-white group-hover:text-blue-400 transition-colors">
                    {defense}
                  </div>
                </div>
                <div className="flex-1 bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex items-center justify-between group cursor-help transition-colors hover:border-zinc-700">
                  <div>
                    <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">
                      Esquiva
                    </div>
                    <div className="text-[10px] text-zinc-600">
                      10 + Equip ({defenseEquipBonus}) + AGI ({agility}) + Reflexos ({reflexosBonus}
                      ){dodgeReflexBonus > 0 ? ` + Bônus (+${dodgeReflexBonus})` : ''}
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-orange-500 group-hover:text-amber-400 transition-colors">
                    {dodge}
                  </div>
                </div>
              </div>

              {/* Bonus Controls */}
              <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 space-y-3">
                <div className="flex items-center gap-3">
                  <label className="text-xs font-bold text-zinc-400 min-w-fit">
                    Bônus Equipamentos
                  </label>
                  <input
                    type="number"
                    value={defenseEquipBonus}
                    onChange={(e) => setDefenseEquipBonus(parseInt(e.target.value) || 0)}
                    min={-5}
                    max={10}
                    className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm text-white font-bold text-center"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-xs font-bold text-zinc-400 min-w-fit">
                    Bônus Adicional
                  </label>
                  <input
                    type="number"
                    value={dodgeReflexBonus}
                    onChange={(e) => setDodgeReflexBonus(parseInt(e.target.value) || 0)}
                    min={-5}
                    max={10}
                    className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm text-white font-bold text-center"
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* VITALS STACK */}
          <Card className="bg-zinc-900 border border-zinc-800 shadow-none">
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
                  <span className="text-4xl font-black text-white">{hp}</span>
                  <div className="flex-1">
                    <Progress
                      aria-label="PV"
                      value={(hp / maxHp) * 100}
                      className="h-3"
                      classNames={{
                        indicator: 'bg-gradient-to-r from-red-500 to-rose-500',
                        track: 'bg-zinc-950 border border-zinc-800',
                      }}
                    />
                  </div>
                  <span className="text-sm text-zinc-500 font-bold">{maxHp}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-xs text-zinc-400">
                  <Button
                    size="sm"
                    variant="flat"
                    className="bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 h-9 font-bold"
                    onPress={() => setHp(Math.max(0, hp - 1))}
                  >
                    -1
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    className="bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 h-9 font-bold"
                    onPress={() => setHp(Math.max(0, hp - 5))}
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
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-black text-white">{pe}</span>
                  <div className="flex-1">
                    <Progress
                      aria-label="PE"
                      value={(pe / maxPe) * 100}
                      className="h-3"
                      classNames={{
                        indicator: 'bg-gradient-to-r from-amber-400 to-yellow-400',
                        track: 'bg-zinc-950 border border-zinc-800',
                      }}
                    />
                  </div>
                  <span className="text-sm text-zinc-500 font-bold">{maxPe}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="flat"
                    className="bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 h-9 font-bold"
                    onPress={() => setPe(Math.max(0, pe - 1))}
                  >
                    -1
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    className="bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 h-9 font-bold"
                    onPress={() => setPe(Math.max(0, pe - 5))}
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
                    <Progress
                      aria-label="Sanidade"
                      value={(san / maxSan) * 100}
                      className="h-3"
                      classNames={{
                        indicator: 'bg-gradient-to-r from-purple-400 to-fuchsia-400',
                        track: 'bg-zinc-950 border border-zinc-800',
                      }}
                    />
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
      <Modal
        isOpen={isEditOpen}
        onOpenChange={onEditOpenChange}
        size="3xl"
        scrollBehavior="inside"
        classNames={{
          base: 'bg-zinc-900 border border-zinc-800',
          header: 'border-b border-zinc-800',
          body: 'py-6',
          footer: 'border-t border-zinc-800',
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-xl font-bold text-white">
                  {editStep === 1 && 'Editar NEX'}
                  {editStep === 2 && 'Editar Classe'}
                  {editStep === 3 && 'Editar Origem'}
                  {editStep === 4 && 'Editar Nome'}
                </h2>
                <div className="flex gap-2 mt-2">
                  {[1, 2, 3, 4].map((s) => (
                    <div
                      key={s}
                      className={`h-1 flex-1 rounded ${s <= editStep ? 'bg-blue-500' : 'bg-zinc-700'} cursor-pointer transition-colors`}
                      onClick={() => setEditStep(s)}
                    />
                  ))}
                </div>
              </ModalHeader>
              <ModalBody>
                {/* Step 1: NEX */}
                {editStep === 1 && (
                  <div className="flex flex-col gap-6 items-center justify-center py-4">
                    <h3 className="text-xl font-bold text-white">
                      Nível de Exposição Paranormal (NEX)
                    </h3>
                    <p className="text-gray-400 text-center text-sm mb-4">
                      Determine o quão exposto ao paranormal seu agente já foi.
                    </p>
                    <Slider
                      label="NEX"
                      step={1}
                      maxValue={99}
                      minValue={5}
                      value={editNex}
                      onChange={(v) => {
                        let val = Array.isArray(v) ? v[0] : v
                        if (val > 95) {
                          val = 99
                        } else {
                          val = Math.round(val / 5) * 5
                        }
                        setEditNex(val)
                      }}
                      className="max-w-md w-full"
                      color="primary"
                      size="lg"
                      classNames={{
                        track: 'bg-zinc-800 h-2',
                        filler: 'bg-blue-500',
                        thumb: 'bg-blue-500',
                      }}
                    />
                    <div className="text-4xl font-bold text-blue-500 mt-4">{editNex}%</div>
                  </div>
                )}

                {/* Step 2: Class */}
                {editStep === 2 && (
                  <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-bold text-white mb-2">Escolha sua Classe</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {classes.map((c) => (
                        <Card
                          key={c.id}
                          isPressable
                          onPress={() => handleEditSelectClass(c.id)}
                          className={`bg-zinc-900 border hover:border-blue-500 hover:bg-zinc-800 transition-all p-4 ${editClassId === c.id ? 'border-blue-500 bg-zinc-800' : 'border-zinc-700'}`}
                        >
                          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                            <h4 className="font-bold text-large text-white">{c.name}</h4>
                          </CardHeader>
                          <CardBody className="overflow-visible py-2">
                            <p className="text-tiny text-gray-400">{c.description}</p>
                          </CardBody>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Origin */}
                {editStep === 3 &&
                  (() => {
                    const filteredOrigins = origins.filter(
                      (origin) =>
                        origin.name.toLowerCase().includes(originSearch.toLowerCase()) ||
                        origin.description.toLowerCase().includes(originSearch.toLowerCase())
                    )

                    return (
                      <div className="relative h-[60vh] w-full flex flex-col">
                        <h3 className="text-xl font-bold text-white mb-4">Escolha sua Origem</h3>

                        {/* Search Bar */}
                        <div className="mb-4 w-full">
                          <Input
                            isClearable
                            placeholder="Pesquisar origem..."
                            value={originSearch}
                            onValueChange={setOriginSearch}
                            className="w-full"
                            classNames={{
                              input: 'text-white bg-zinc-800 border-zinc-700',
                              inputWrapper:
                                'bg-zinc-800 border border-zinc-700 hover:border-blue-500',
                            }}
                          />
                        </div>

                        {/* Backdrop quando card está expandido */}
                        <AnimatePresence>
                          {focusedOrigin && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              onClick={() => setFocusedOrigin(null)}
                              className="fixed inset-0 bg-black/50 z-20"
                            />
                          )}
                        </AnimatePresence>

                        {/* Grid of Origins */}
                        <motion.div
                          layout
                          className={`grid grid-cols-4 gap-3 flex-1 pr-2 pb-20 content-start ${focusedOrigin ? 'overflow-hidden' : 'overflow-y-auto custom-scrollbar'}`}
                        >
                          {filteredOrigins.length === 0 ? (
                            <div className="col-span-4 text-center py-8">
                              <p className="text-gray-400">Nenhuma origem encontrada</p>
                            </div>
                          ) : (
                            filteredOrigins.map((origin) => {
                              const Icon = getOriginIcon(origin.name)
                              const isFocused = focusedOrigin?.id === origin.id
                              const isSelected = editOriginId === origin.id

                              if (isFocused) return null

                              return (
                                <motion.div
                                  layout
                                  key={origin.id}
                                  onClick={() => setFocusedOrigin(origin)}
                                  className={`
                                                                    cursor-pointer rounded-xl overflow-hidden border bg-zinc-900 flex flex-col group transition-all
                                                                    relative h-32 ${isSelected ? 'border-blue-500' : 'border-zinc-800 hover:border-blue-500'}
                                                                `}
                                >
                                  <motion.div className="bg-zinc-950 flex items-center justify-center p-2 transition-colors w-full h-20 group-hover:bg-zinc-900">
                                    <Icon
                                      size={32}
                                      className={`transition-all duration-500 ${isSelected ? 'text-blue-500' : 'text-zinc-600 group-hover:text-blue-500'}`}
                                    />
                                  </motion.div>
                                  <div className="bg-zinc-800 h-12 px-3 flex items-center justify-between gap-1 border-t border-zinc-700 w-full">
                                    <span className="text-xs font-bold text-gray-300 uppercase tracking-wider truncate group-hover:text-white">
                                      {origin.name}
                                    </span>
                                    <div className="shrink-0 rounded-xl overflow-hidden">
                                      <Button
                                        color="primary"
                                        radius="lg"
                                        size="sm"
                                        className="shadow-lg shadow-blue-500/20 font-bold text-xs min-w-0 px-2 h-7"
                                        startContent={<Check size={12} />}
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          confirmEditOrigin(origin.id)
                                        }}
                                      >
                                        OK
                                      </Button>
                                    </div>
                                  </div>
                                </motion.div>
                              )
                            })
                          )}
                        </motion.div>

                        {/* Expanded Origin Card */}
                        <AnimatePresence>
                          {focusedOrigin &&
                            (() => {
                              const Icon = getOriginIcon(focusedOrigin.name)
                              return (
                                <motion.div
                                  key="expanded-origin"
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.9 }}
                                  transition={{ duration: 0.3 }}
                                  className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] h-auto max-h-[80vh] z-30 rounded-xl overflow-hidden border border-blue-500 bg-zinc-900 shadow-2xl flex flex-col"
                                >
                                  <div className="bg-zinc-950 flex items-center justify-center p-6 border-b border-zinc-700">
                                    <Icon size={64} className="text-blue-500" />
                                  </div>
                                  <div className="px-6 pt-4 pb-2">
                                    <h2 className="text-2xl font-bold text-white">
                                      {focusedOrigin.name}
                                    </h2>
                                  </div>
                                  <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-6">
                                    <div className="space-y-4">
                                      <p className="text-gray-400 text-sm leading-relaxed border-b border-zinc-700 pb-4">
                                        {focusedOrigin.description}
                                      </p>
                                      <div>
                                        <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                          Perícias Treinadas
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                          {(() => {
                                            const skills =
                                              typeof focusedOrigin.trainedSkills === 'string'
                                                ? JSON.parse(focusedOrigin.trainedSkills || '[]')
                                                : focusedOrigin.trainedSkills || []
                                            return skills.map((skillName: string, i: number) => (
                                              <span
                                                key={i}
                                                className="px-2 py-1 bg-zinc-950 rounded text-xs text-gray-300 border border-zinc-700"
                                              >
                                                {skillName}
                                              </span>
                                            ))
                                          })()}
                                        </div>
                                      </div>
                                      {focusedOrigin.abilityName && (
                                        <div>
                                          <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                            Poder da Origem
                                          </h4>
                                          <div className="bg-zinc-950/50 p-4 rounded border border-zinc-700/50">
                                            <strong className="block text-white text-sm mb-3">
                                              {focusedOrigin.abilityName}
                                            </strong>
                                            <div className="text-gray-400 text-xs space-y-3 leading-relaxed">
                                              {formatAbilityDescription(
                                                focusedOrigin.abilityDescription
                                              ).map((paragraph, idx) => (
                                                <p key={idx}>{paragraph}</p>
                                              ))}
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="px-6 py-4 border-t border-zinc-700 bg-zinc-800/50 flex gap-2">
                                    <Button
                                      variant="bordered"
                                      className="flex-1 border-zinc-700 text-zinc-400 hover:text-white"
                                      onPress={() => setFocusedOrigin(null)}
                                    >
                                      Fechar
                                    </Button>
                                    <Button
                                      color="primary"
                                      className="flex-1 font-bold"
                                      startContent={<Check size={18} />}
                                      onClick={() => confirmEditOrigin(focusedOrigin.id)}
                                    >
                                      CONFIRMAR ORIGEM
                                    </Button>
                                  </div>
                                </motion.div>
                              )
                            })()}
                        </AnimatePresence>
                      </div>
                    )
                  })()}

                {/* Step 4: Name */}
                {editStep === 4 && (
                  <div className="flex flex-col gap-6 items-center justify-center py-4">
                    <h3 className="text-xl font-bold text-white">Nome do Agente</h3>
                    <p className="text-gray-400 text-center text-sm mb-4">
                      Edite o nome do seu agente.
                    </p>
                    <Input
                      aria-label="Nome do Agente"
                      placeholder="Ex: Arthur Cervero"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="max-w-md w-full"
                      size="lg"
                      classNames={{
                        input: 'text-white',
                        inputWrapper:
                          'bg-zinc-900 border-zinc-700 hover:border-blue-500 focus-within:!border-blue-500',
                      }}
                    />
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="bordered"
                  onPress={onClose}
                  className="border-zinc-700 text-zinc-400"
                >
                  Cancelar
                </Button>
                <Button
                  color="primary"
                  onPress={submitEditCharacter}
                  isLoading={isUpdating}
                  className="font-bold"
                >
                  Salvar Alterações
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Ability Configuration Modal */}
      <Modal
        isOpen={isAbilityConfigOpen}
        onOpenChange={onAbilityConfigOpenChange}
        size="md"
        classNames={{
          base: 'bg-zinc-900 border border-zinc-800',
          header: 'border-b border-zinc-800',
          body: 'py-6',
          footer: 'border-t border-zinc-800',
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-xl font-bold text-white">
                  Configurar {configuringAbility?.classAbility?.name}
                </h2>
              </ModalHeader>
              <ModalBody>
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
                            className={`font-semibold ${selectedSkills.includes(skill)
                              ? 'bg-amber-500 text-white border-amber-400'
                              : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-amber-500 hover:text-amber-400'
                              } border`}
                          >
                            {selectedSkills.includes(skill) && '✓ '}
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
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="bordered"
                  onPress={onClose}
                  className="border-zinc-700 text-zinc-400"
                >
                  Cancelar
                </Button>
                <Button
                  color="primary"
                  onPress={saveAbilityConfig}
                  isLoading={isConfiguringAbility}
                  isDisabled={
                    configuringAbility?.classAbility?.name === 'Perito' &&
                    selectedSkills.length !== 2
                  }
                  className="font-bold"
                >
                  Salvar Configuração
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Class Ability Selection Modal */}
      <Modal
        isOpen={isSkillMenuOpen}
        onOpenChange={onSkillMenuOpenChange}
        size="2xl"
        classNames={{
          base: 'bg-zinc-900 border border-zinc-800',
          header: 'border-b border-zinc-800',
          body: 'py-6 max-h-[60vh] overflow-y-auto custom-scrollbar',
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-xl font-bold text-white">{selectedSkillName}</h2>
                <p className="text-xs text-zinc-400">Ações disponíveis para esta perícia</p>
              </ModalHeader>
              <ModalBody>
                {selectedSkillName && skillDescriptions[selectedSkillName] ? (
                  <div className="space-y-4">
                    {skillDescriptions[selectedSkillName].map((action, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-zinc-950/50 rounded-lg border border-cyan-500/30 hover:border-cyan-500/50 transition-all"
                      >
                        <h3 className="font-bold text-cyan-300 mb-2">{action.title}</h3>
                        <p className="text-sm text-zinc-300 leading-relaxed">
                          {action.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-zinc-400">
                    Nenhuma ação disponível para esta perícia
                  </div>
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Class Ability Selection Modal */}
      <Modal
        isOpen={isAbilitySelectOpen}
        onOpenChange={onAbilitySelectOpenChange}
        size="2xl"
        classNames={{
          base: 'bg-zinc-900 border border-zinc-800',
          header: 'border-b border-zinc-800',
          body: 'py-6',
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-xl font-bold text-white">Escolher Habilidade de Classe</h2>
                <p className="text-xs text-zinc-400">
                  Escolhidas: {chosenClassAbilities}/{maxClassAbilities}
                </p>
              </ModalHeader>
              <ModalBody>
                <div className="pt-4">
                  {availableAbilities.length > 0 ? (
                    <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                      {availableAbilities.map((ability) => (
                        <Card
                          key={ability.id}
                          isPressable
                          onPress={() => addClassAbility(ability.id)}
                          className="bg-zinc-950 border border-zinc-700 hover:border-amber-500/50 transition-colors cursor-pointer"
                        >
                          <CardBody className="space-y-3">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h3 className="text-lg font-bold text-amber-400">
                                  {ability.name}
                                </h3>
                                {ability.effects?.nex && (
                                  <p className="text-xs text-zinc-400 mt-1">
                                    Requer: NEX {ability.effects.nex}
                                  </p>
                                )}
                              </div>
                            </div>
                            {ability.description && (
                              <p className="text-sm text-zinc-300">{ability.description}</p>
                            )}
                          </CardBody>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-zinc-400">
                      <p className="text-sm">
                        Nenhuma habilidade disponível para escolher no momento
                      </p>
                    </div>
                  )}
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Trail Selection Modal */}
      <Modal
        isOpen={isTrailModalOpen}
        onOpenChange={onTrailModalOpenChange}
        size="2xl"
        classNames={{
          base: 'bg-zinc-900 border border-zinc-800',
          header: 'border-b border-zinc-800',
          body: 'py-6',
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-xl font-bold text-white">Selecionar uma Trilha</h2>
                <p className="text-xs text-zinc-400">Escolha uma trilha para seu personagem</p>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {classTrails.map((trail) => (
                    <Card
                      key={trail.id}
                      isPressable
                      onPress={() => selectTrail(trail.id)}
                      className="bg-zinc-950 border border-zinc-700 hover:border-amber-500/50 transition-colors cursor-pointer"
                    >
                      <CardBody className="space-y-3">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-bold text-amber-400">{trail.name}</h3>
                        </div>

                        {trail.description && (
                          <p className="text-sm text-zinc-300">{trail.description}</p>
                        )}

                        {trail.progression && trail.progression.length > 0 && (
                          <div className="bg-zinc-900/50 p-3 rounded border border-zinc-700/50">
                            <p className="text-xs font-bold text-zinc-400 upppercase tracking-wider mb-2">
                              Progressões:
                            </p>
                            <div className="space-y-2">
                              {trail.progression.map((prog) => (
                                <div key={prog.id} className="text-xs">
                                  <span className="font-bold text-amber-400">NEX {prog.nex}:</span>
                                  <span className="text-zinc-300 ml-2">
                                    {prog.title}
                                    {prog.description && ` - ${prog.description}`}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Add Item Modal - abas por tipo */}
      <Modal
        isOpen={isAddItemModalOpen}
        onOpenChange={onAddItemModalOpenChange}
        size="3xl"
        scrollBehavior="inside"
        classNames={{
          base: 'bg-zinc-900 border border-zinc-800',
          header: 'border-b border-zinc-800',
          body: 'flex-1 flex flex-col max-h-[70vh] min-h-0',
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-xl font-bold text-white">Adicionar Item ao Inventário</h2>
                <p className="text-xs text-zinc-400">
                  Escolha um item por tipo e adicione ao personagem
                </p>
              </ModalHeader>
              <ModalBody>
                <Tabs
                  aria-label="Tipos de item"
                  variant="underlined"
                  classNames={{
                    base: 'w-full',
                    tabList: 'gap-2 border-b border-zinc-800 px-0 sticky top-0 bg-zinc-900 z-10',
                    cursor: 'bg-orange-500',
                    tab: 'text-zinc-400 data-[selected=true]:text-orange-500',
                    panel: 'py-4',
                  }}
                >
                  <Tab
                    key="weapons"
                    title={<span className="flex items-center gap-2">⚔️ Armas</span>}
                  >
                    <div className="space-y-3 pr-2">
                      {catalogWeapons.length === 0 ? (
                        <p className="text-sm text-zinc-500">Nenhuma arma cadastrada.</p>
                      ) : (
                        catalogWeapons.map((item) => {
                          const key = `weapon-${item.id}`
                          const isExpanded = expandedItemKey === key
                          return (
                            <div
                              key={key}
                              role="button"
                              tabIndex={0}
                              onClick={() => toggleItemExpanded(key)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault()
                                  toggleItemExpanded(key)
                                }
                              }}
                              className="cursor-pointer outline-none"
                            >
                              <Card
                                className={`bg-zinc-950 border transition-all ${isExpanded ? 'border-orange-500/60 ring-1 ring-orange-500/30' : 'border-zinc-800'}`}
                              >
                                <CardBody className="py-3 px-4">
                                  <div className="flex flex-row items-start justify-between gap-4">
                                    <div className="min-w-0 flex-1">
                                      <h4 className="font-semibold text-zinc-200">{item.name}</h4>
                                      <p className="text-xs text-zinc-500 mt-0.5">
                                        {item.type} · {item.weaponType ?? ''}
                                        {!isExpanded && (
                                          <>
                                            {' '}
                                            · Dano {item.damage}
                                            {item.damageType ? ` (${item.damageType})` : ''}
                                          </>
                                        )}
                                      </p>
                                      {item.description && (
                                        <p
                                          className={`text-xs text-zinc-400 mt-1 ${isExpanded ? '' : 'line-clamp-2'}`}
                                        >
                                          {item.description}
                                        </p>
                                      )}
                                    </div>
                                    <span onClick={(e) => e.stopPropagation()}>
                                      <Button
                                        size="sm"
                                        className="bg-orange-600 hover:bg-orange-700 text-white shrink-0"
                                        onPress={() => addItemToCharacter('weapon', item.id)}
                                      >
                                        <Plus size={14} className="mr-1" /> Adicionar
                                      </Button>
                                    </span>
                                  </div>
                                  {isExpanded && (
                                    <div className="mt-4 pt-4 border-t border-zinc-800 grid grid-cols-2 sm:grid-cols-3 gap-3">
                                      <div className="bg-orange-500/15 border border-orange-500/40 rounded-lg p-3">
                                        <p className="text-[10px] uppercase tracking-wider text-orange-400/90 font-bold">
                                          Dano
                                        </p>
                                        <p className="text-lg font-bold text-orange-300 mt-0.5">
                                          {item.damage}
                                          {item.damageType ? (
                                            <span className="text-sm font-normal text-orange-200/90">
                                              {' '}
                                              ({item.damageType})
                                            </span>
                                          ) : null}
                                        </p>
                                      </div>
                                      <div className="bg-orange-500/15 border border-orange-500/40 rounded-lg p-3">
                                        <p className="text-[10px] uppercase tracking-wider text-orange-400/90 font-bold">
                                          Categoria
                                        </p>
                                        <p className="text-lg font-bold text-orange-300 mt-0.5">
                                          {categoryLabels[item.category as number] ?? item.category}
                                        </p>
                                      </div>
                                      <div className="bg-orange-500/15 border border-orange-500/40 rounded-lg p-3">
                                        <p className="text-[10px] uppercase tracking-wider text-orange-400/90 font-bold">
                                          Alcance
                                        </p>
                                        <p className="text-lg font-bold text-orange-300 mt-0.5">
                                          {item.range ?? '—'}
                                        </p>
                                      </div>
                                      <div className="bg-orange-500/15 border border-orange-500/40 rounded-lg p-3">
                                        <p className="text-[10px] uppercase tracking-wider text-orange-400/90 font-bold">
                                          Margem de crítico
                                        </p>
                                        <p className="text-lg font-bold text-orange-300 mt-0.5">
                                          {item.critical ?? '—'}
                                        </p>
                                      </div>
                                      <div className="bg-orange-500/15 border border-orange-500/40 rounded-lg p-3">
                                        <p className="text-[10px] uppercase tracking-wider text-orange-400/90 font-bold">
                                          Multiplicador de crítico
                                        </p>
                                        <p className="text-lg font-bold text-orange-300 mt-0.5">
                                          {item.criticalMultiplier ?? '—'}
                                        </p>
                                      </div>
                                      {(item.ammoCapacity != null || item.ammoType) && (
                                        <div className="bg-orange-500/15 border border-orange-500/40 rounded-lg p-3">
                                          <p className="text-[10px] uppercase tracking-wider text-orange-400/90 font-bold">
                                            Munição
                                          </p>
                                          <p className="text-sm font-bold text-orange-300 mt-0.5">
                                            {item.ammoCapacity != null
                                              ? `${item.ammoCapacity}`
                                              : '—'}
                                            {item.ammoType ? ` · ${item.ammoType}` : ''}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </CardBody>
                              </Card>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </Tab>
                  <Tab
                    key="protections"
                    title={<span className="flex items-center gap-2">🛡️ Proteções</span>}
                  >
                    <div className="space-y-3 pr-2">
                      {catalogProtections.length === 0 ? (
                        <p className="text-sm text-zinc-500">Nenhuma proteção cadastrada.</p>
                      ) : (
                        catalogProtections.map((item) => {
                          const key = `protection-${item.id}`
                          const isExpanded = expandedItemKey === key
                          return (
                            <div
                              key={key}
                              role="button"
                              tabIndex={0}
                              onClick={() => toggleItemExpanded(key)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault()
                                  toggleItemExpanded(key)
                                }
                              }}
                              className="cursor-pointer outline-none"
                            >
                              <Card
                                className={`bg-zinc-950 border transition-all ${isExpanded ? 'border-orange-500/60 ring-1 ring-orange-500/30' : 'border-zinc-800'}`}
                              >
                                <CardBody className="py-3 px-4">
                                  <div className="flex flex-row items-start justify-between gap-4">
                                    <div className="min-w-0 flex-1">
                                      <h4 className="font-semibold text-zinc-200">{item.name}</h4>
                                      <p className="text-xs text-zinc-500 mt-0.5">
                                        {item.type}
                                        {!isExpanded && (
                                          <>
                                            {' '}
                                            · Def +{item.defenseBonus}
                                            {item.dodgePenalty !== 0
                                              ? ` · Esquiva ${item.dodgePenalty}`
                                              : ''}
                                          </>
                                        )}
                                      </p>
                                      {item.description && (
                                        <p
                                          className={`text-xs text-zinc-400 mt-1 ${isExpanded ? '' : 'line-clamp-2'}`}
                                        >
                                          {item.description}
                                        </p>
                                      )}
                                    </div>
                                    <span onClick={(e) => e.stopPropagation()}>
                                      <Button
                                        size="sm"
                                        className="bg-orange-600 hover:bg-orange-700 text-white shrink-0"
                                        onPress={() => addItemToCharacter('protection', item.id)}
                                      >
                                        <Plus size={14} className="mr-1" /> Adicionar
                                      </Button>
                                    </span>
                                  </div>
                                  {isExpanded && (
                                    <div className="mt-4 pt-4 border-t border-zinc-800 grid grid-cols-2 sm:grid-cols-3 gap-3">
                                      <div className="bg-orange-500/15 border border-orange-500/40 rounded-lg p-3">
                                        <p className="text-[10px] uppercase tracking-wider text-orange-400/90 font-bold">
                                          Bônus de defesa
                                        </p>
                                        <p className="text-lg font-bold text-orange-300 mt-0.5">
                                          +{item.defenseBonus}
                                        </p>
                                      </div>
                                      <div className="bg-orange-500/15 border border-orange-500/40 rounded-lg p-3">
                                        <p className="text-[10px] uppercase tracking-wider text-orange-400/90 font-bold">
                                          Penalidade de esquiva
                                        </p>
                                        <p className="text-lg font-bold text-orange-300 mt-0.5">
                                          {item.dodgePenalty}
                                        </p>
                                      </div>
                                      <div className="bg-orange-500/15 border border-orange-500/40 rounded-lg p-3">
                                        <p className="text-[10px] uppercase tracking-wider text-orange-400/90 font-bold">
                                          Categoria
                                        </p>
                                        <p className="text-lg font-bold text-orange-300 mt-0.5">
                                          {categoryLabels[item.category as number] ?? item.category}
                                        </p>
                                      </div>
                                      <div className="bg-orange-500/15 border border-orange-500/40 rounded-lg p-3">
                                        <p className="text-[10px] uppercase tracking-wider text-orange-400/90 font-bold">
                                          Tipo
                                        </p>
                                        <p className="text-lg font-bold text-orange-300 mt-0.5">
                                          {item.type}
                                        </p>
                                      </div>
                                      <div className="bg-orange-500/15 border border-orange-500/40 rounded-lg p-3">
                                        <p className="text-[10px] uppercase tracking-wider text-orange-400/90 font-bold">
                                          Espaços
                                        </p>
                                        <p className="text-lg font-bold text-orange-300 mt-0.5">
                                          {item.spaces}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </CardBody>
                              </Card>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </Tab>
                  <Tab
                    key="general"
                    title={<span className="flex items-center gap-2">🎒 Itens Gerais</span>}
                  >
                    <div className="space-y-3 pr-2">
                      {catalogGeneralItems.length === 0 ? (
                        <p className="text-sm text-zinc-500">Nenhum item geral cadastrado.</p>
                      ) : (
                        catalogGeneralItems.map((item) => {
                          const key = `general-${item.id}`
                          const isExpanded = expandedItemKey === key
                          return (
                            <div
                              key={key}
                              role="button"
                              tabIndex={0}
                              onClick={() => toggleItemExpanded(key)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault()
                                  toggleItemExpanded(key)
                                }
                              }}
                              className="cursor-pointer outline-none"
                            >
                              <Card
                                className={`bg-zinc-950 border transition-all ${isExpanded ? 'border-orange-500/60 ring-1 ring-orange-500/30' : 'border-zinc-800'}`}
                              >
                                <CardBody className="py-3 px-4">
                                  <div className="flex flex-row items-start justify-between gap-4">
                                    <div className="min-w-0 flex-1">
                                      <h4 className="font-semibold text-zinc-200">{item.name}</h4>
                                      <p className="text-xs text-zinc-500 mt-0.5">
                                        {item.type ?? 'Diversos'}
                                        {!isExpanded && <> · {item.spaces} espaço(s)</>}
                                      </p>
                                      {item.description && (
                                        <p
                                          className={`text-xs text-zinc-400 mt-1 ${isExpanded ? '' : 'line-clamp-2'}`}
                                        >
                                          {item.description}
                                        </p>
                                      )}
                                    </div>
                                    <span onClick={(e) => e.stopPropagation()}>
                                      <Button
                                        size="sm"
                                        className="bg-orange-600 hover:bg-orange-700 text-white shrink-0"
                                        onPress={() => addItemToCharacter('general', item.id)}
                                      >
                                        <Plus size={14} className="mr-1" /> Adicionar
                                      </Button>
                                    </span>
                                  </div>
                                  {isExpanded && (
                                    <div className="mt-4 pt-4 border-t border-zinc-800 grid grid-cols-2 sm:grid-cols-3 gap-3">
                                      <div className="bg-orange-500/15 border border-orange-500/40 rounded-lg p-3">
                                        <p className="text-[10px] uppercase tracking-wider text-orange-400/90 font-bold">
                                          Categoria
                                        </p>
                                        <p className="text-lg font-bold text-orange-300 mt-0.5">
                                          {categoryLabels[item.category as number] ?? item.category}
                                        </p>
                                      </div>
                                      <div className="bg-orange-500/15 border border-orange-500/40 rounded-lg p-3">
                                        <p className="text-[10px] uppercase tracking-wider text-orange-400/90 font-bold">
                                          Tipo
                                        </p>
                                        <p className="text-lg font-bold text-orange-300 mt-0.5">
                                          {item.type ?? 'Diversos'}
                                        </p>
                                      </div>
                                      <div className="bg-orange-500/15 border border-orange-500/40 rounded-lg p-3">
                                        <p className="text-[10px] uppercase tracking-wider text-orange-400/90 font-bold">
                                          Espaços
                                        </p>
                                        <p className="text-lg font-bold text-orange-300 mt-0.5">
                                          {item.spaces}
                                        </p>
                                      </div>
                                      {item.effects &&
                                        typeof item.effects === 'object' &&
                                        Object.keys(item.effects).length > 0 && (
                                          <div className="bg-orange-500/15 border border-orange-500/40 rounded-lg p-3 col-span-2 sm:col-span-3">
                                            <p className="text-[10px] uppercase tracking-wider text-orange-400/90 font-bold">
                                              Efeitos
                                            </p>
                                            <p className="text-sm text-orange-200/90 mt-0.5">
                                              {JSON.stringify(item.effects)}
                                            </p>
                                          </div>
                                        )}
                                    </div>
                                  )}
                                </CardBody>
                              </Card>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </Tab>
                  <Tab
                    key="cursed"
                    title={<span className="flex items-center gap-2">👁️ Itens Amaldiçoados</span>}
                  >
                    <div className="space-y-3 pr-2">
                      {catalogCursedItems.length === 0 ? (
                        <p className="text-sm text-zinc-500">Nenhum item amaldiçoado cadastrado.</p>
                      ) : (
                        catalogCursedItems.map((item) => {
                          const key = `cursed-${item.id}`
                          const isExpanded = expandedItemKey === key
                          return (
                            <div
                              key={key}
                              role="button"
                              tabIndex={0}
                              onClick={() => toggleItemExpanded(key)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault()
                                  toggleItemExpanded(key)
                                }
                              }}
                              className="cursor-pointer outline-none"
                            >
                              <Card
                                className={`bg-zinc-950 border transition-all ${isExpanded ? 'border-orange-500/60 ring-1 ring-orange-500/30' : 'border-zinc-800'}`}
                              >
                                <CardBody className="py-3 px-4">
                                  <div className="flex flex-row items-start justify-between gap-4">
                                    <div className="min-w-0 flex-1">
                                      <h4 className="font-semibold text-zinc-200">{item.name}</h4>
                                      <p className="text-xs text-zinc-500 mt-0.5">
                                        {item.itemType ?? 'Item'}
                                        {!isExpanded && <> · {item.spaces} espaço(s)</>}
                                      </p>
                                      {item.description && (
                                        <p
                                          className={`text-xs text-zinc-400 mt-1 ${isExpanded ? '' : 'line-clamp-2'}`}
                                        >
                                          {item.description}
                                        </p>
                                      )}
                                    </div>
                                    <span onClick={(e) => e.stopPropagation()}>
                                      <Button
                                        size="sm"
                                        className="bg-orange-600 hover:bg-orange-700 text-white shrink-0"
                                        isDisabled
                                        title="Em breve"
                                      >
                                        <Plus size={14} className="mr-1" /> Em breve
                                      </Button>
                                    </span>
                                  </div>
                                  {isExpanded && (
                                    <div className="mt-4 pt-4 border-t border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                      <div className="bg-orange-500/15 border border-orange-500/40 rounded-lg p-3">
                                        <p className="text-[10px] uppercase tracking-wider text-orange-400/90 font-bold">
                                          Tipo
                                        </p>
                                        <p className="text-lg font-bold text-orange-300 mt-0.5">
                                          {item.itemType ?? '—'}
                                        </p>
                                      </div>
                                      <div className="bg-orange-500/15 border border-orange-500/40 rounded-lg p-3">
                                        <p className="text-[10px] uppercase tracking-wider text-orange-400/90 font-bold">
                                          Espaços
                                        </p>
                                        <p className="text-lg font-bold text-orange-300 mt-0.5">
                                          {item.spaces}
                                        </p>
                                      </div>
                                      {item.benefits && (
                                        <div className="bg-emerald-500/15 border border-emerald-500/40 rounded-lg p-3 sm:col-span-2">
                                          <p className="text-[10px] uppercase tracking-wider text-emerald-400/90 font-bold">
                                            Benefícios
                                          </p>
                                          <p className="text-sm text-zinc-300 mt-0.5">
                                            {typeof item.benefits === 'object'
                                              ? JSON.stringify(item.benefits)
                                              : String(item.benefits)}
                                          </p>
                                        </div>
                                      )}
                                      {item.curses && (
                                        <div className="bg-red-500/15 border border-red-500/40 rounded-lg p-3 sm:col-span-2">
                                          <p className="text-[10px] uppercase tracking-wider text-red-400/90 font-bold">
                                            Maldições
                                          </p>
                                          <p className="text-sm text-zinc-300 mt-0.5">
                                            {typeof item.curses === 'object'
                                              ? JSON.stringify(item.curses)
                                              : String(item.curses)}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </CardBody>
                              </Card>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </Tab>
                  <Tab
                    key="ammunitions"
                    title={<span className="flex items-center gap-2">🔫 Munições</span>}
                  >
                    <div className="space-y-3 pr-2">
                      {catalogAmmunitions.length === 0 ? (
                        <p className="text-sm text-zinc-500">Nenhuma munição cadastrada.</p>
                      ) : (
                        catalogAmmunitions.map((item) => {
                          const key = `ammunition-${item.id}`
                          const isExpanded = expandedItemKey === key
                          return (
                            <div
                              key={key}
                              role="button"
                              tabIndex={0}
                              onClick={() => toggleItemExpanded(key)}
                              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleItemExpanded(key) } }}
                              className="cursor-pointer outline-none"
                            >
                              <Card
                                className={`bg-zinc-950 border transition-all ${isExpanded ? 'border-orange-500/60 ring-1 ring-orange-500/30' : 'border-zinc-800'}`}
                              >
                                <CardBody className="py-3 px-4">
                                  <div className="flex flex-row items-start justify-between gap-4">
                                    <div className="min-w-0 flex-1">
                                      <h4 className="font-semibold text-zinc-200">{item.name}</h4>
                                      <p className="text-xs text-zinc-500 mt-0.5">
                                        {item.type} · Categoria {item.category}
                                        {!isExpanded && (
                                          <> · {item.description || 'Sem descrição'}</>
                                        )}
                                      </p>
                                      {item.description && (
                                        <p className={`text-xs text-zinc-400 mt-1 ${isExpanded ? '' : 'line-clamp-2'}`}>
                                          {item.description}
                                        </p>
                                      )}
                                    </div>
                                    <span onClick={(e) => e.stopPropagation()}>
                                      <Button
                                        size="sm"
                                        className="bg-orange-600 hover:bg-orange-700 text-white shrink-0"
                                        onPress={() => addItemToCharacter('ammunition', item.id)}
                                      >
                                        <Plus size={14} className="mr-1" /> Adicionar
                                      </Button>
                                    </span>
                                  </div>
                                  {isExpanded && (
                                    <div className="mt-4 pt-4 border-t border-zinc-800 grid grid-cols-2 sm:grid-cols-3 gap-3">
                                      <div className="bg-orange-500/15 border border-orange-500/40 rounded-lg p-3">
                                        <p className="text-[10px] uppercase tracking-wider text-orange-400/90 font-bold">Categoria</p>
                                        <p className="text-lg font-bold text-orange-300 mt-0.5">{item.category}</p>
                                      </div>
                                      <div className="bg-orange-500/15 border border-orange-500/40 rounded-lg p-3">
                                        <p className="text-[10px] uppercase tracking-wider text-orange-400/90 font-bold">Tipo</p>
                                        <p className="text-lg font-bold text-orange-300 mt-0.5">{item.type}</p>
                                      </div>
                                      {item.damageBonus && (
                                        <div className="bg-orange-500/15 border border-orange-500/40 rounded-lg p-3">
                                          <p className="text-[10px] uppercase tracking-wider text-orange-400/90 font-bold">Bônus de dano</p>
                                          <p className="text-lg font-bold text-orange-300 mt-0.5">{item.damageBonus}</p>
                                        </div>
                                      )}
                                      {item.damageTypeOverride && (
                                        <div className="bg-orange-500/15 border border-orange-500/40 rounded-lg p-3">
                                          <p className="text-[10px] uppercase tracking-wider text-orange-400/90 font-bold">Tipo de dano</p>
                                          <p className="text-lg font-bold text-orange-300 mt-0.5">{item.damageTypeOverride}</p>
                                        </div>
                                      )}
                                      {item.criticalBonus && (
                                        <div className="bg-orange-500/15 border border-orange-500/40 rounded-lg p-3">
                                          <p className="text-[10px] uppercase tracking-wider text-orange-400/90 font-bold">Bônus de crítico</p>
                                          <p className="text-lg font-bold text-orange-300 mt-0.5">{item.criticalBonus}</p>
                                        </div>
                                      )}
                                      {item.criticalMultiplierBonus && (
                                        <div className="bg-orange-500/15 border border-orange-500/40 rounded-lg p-3">
                                          <p className="text-[10px] uppercase tracking-wider text-orange-400/90 font-bold">Mult. de crítico</p>
                                          <p className="text-lg font-bold text-orange-300 mt-0.5">{item.criticalMultiplierBonus}</p>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </CardBody>
                              </Card>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </Tab>
                </Tabs>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Transcend Choice Modal */}
      <Modal
        isOpen={isTranscendChoiceOpen}
        onOpenChange={() => setIsTranscendChoiceOpen(false)}
        size="md"
        placement="center"
        classNames={{
          base: 'bg-zinc-900 border border-zinc-800',
          header: 'border-b border-zinc-800',
          body: 'py-6',
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-xl font-bold text-white">Transcender</h2>
                <p className="text-xs text-zinc-400">Escolha como deseja transcender</p>
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 gap-4">
                  <Button
                    className="h-24 text-xl font-bold bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/10 transition-all border border-blue-500/30"
                    onPress={() => {
                      setIsTranscendChoiceOpen(false)
                      setIsParanormalSelectOpen(true)
                    }}
                  >
                    Aprender Poder Paranormal
                  </Button>
                  <Button
                    className="h-24 text-xl font-bold bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 shadow-lg shadow-purple-500/10 transition-all border border-purple-500/30"
                    onPress={() => {
                      setIsTranscendChoiceOpen(false)
                      setIsRitualSelectOpen(true)
                    }}
                  >
                    Aprender Ritual
                  </Button>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Paranormal Power Selection Modal (Dedicated) */}
      <Modal
        isOpen={isParanormalSelectOpen}
        onOpenChange={() => setIsParanormalSelectOpen(false)}
        size="2xl"
        placement="center"
        classNames={{
          base: 'bg-zinc-900 border border-zinc-800',
          header: 'border-b border-zinc-800',
          body: 'py-6',
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-xl font-bold text-white">Escolher Poder Paranormal</h2>
                <p className="text-xs text-zinc-400 text-amber-500 font-bold uppercase tracking-tighter">
                  Vínculo com o outro lado
                </p>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                  {catalogParanormalPowers && catalogParanormalPowers.length > 0 ? (
                    catalogParanormalPowers.map((power) => {
                      const isAcquired = character.paranormalPowers?.some(
                        (p: any) => p.paranormalPowerId === power.id
                      )
                      const elementColor = {
                        Conhecimento: 'text-amber-400',
                        Energia: 'text-purple-400',
                        Morte: 'text-zinc-400',
                        Sangue: 'text-red-400',
                        Varia: 'text-blue-400',
                      }[power.element || ''] || 'text-zinc-400'

                      return (
                        <Card
                          key={power.id}
                          isPressable={!isAcquired && !isAddingAbility}
                          onPress={() => !isAcquired && !isAddingAbility && addParanormalPower(power.id)}
                          className={`bg-zinc-950 border border-zinc-700 hover:border-amber-500/50 transition-colors cursor-pointer ${isAcquired ? 'opacity-50 cursor-not-allowed grayscale' : ''} ${isAddingAbility ? 'opacity-70 cursor-wait' : ''}`}
                        >
                          <CardBody className="space-y-3">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="text-lg font-bold text-zinc-100">{power.name}</h3>
                                  {isAcquired && (
                                    <Chip size="sm" color="success" variant="flat">
                                      Adquirido
                                    </Chip>
                                  )}
                                </div>
                                <p className={`text-xs font-bold uppercase ${elementColor}`}>
                                  {power.element}
                                </p>
                                {power.requirements && (
                                  <p className="text-[10px] text-zinc-500 mt-1 uppercase">
                                    Requisito: {power.requirements}
                                  </p>
                                )}
                              </div>
                            </div>
                            {power.description && (
                              <p className="text-sm text-zinc-300 italic">{power.description}</p>
                            )}
                            <div className="space-y-2 bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
                              {power.effects?.main && (
                                <div>
                                  <p className="text-[10px] font-bold text-zinc-500 uppercase">
                                    Efeito:
                                  </p>
                                  <p className="text-xs text-zinc-300">{power.effects.main}</p>
                                </div>
                              )}
                              {power.effects?.affinity && (
                                <div>
                                  <p className="text-[10px] font-bold text-amber-500/70 uppercase">
                                    Afinidade:
                                  </p>
                                  <p className="text-xs text-amber-200/70">
                                    {power.effects.affinity}
                                  </p>
                                </div>
                              )}
                            </div>
                          </CardBody>
                        </Card>
                      )
                    })
                  ) : (
                    <p className="text-center text-zinc-500 py-8">Nenhum poder encontrado</p>
                  )}
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Ritual Selection Modal */}
      <Modal
        isOpen={isRitualSelectOpen}
        onOpenChange={() => setIsRitualSelectOpen(false)}
        size="2xl"
        placement="center"
        classNames={{
          base: 'bg-zinc-900 border border-zinc-800',
          header: 'border-b border-zinc-800',
          body: 'py-6',
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-xl font-bold text-white">Aprender Ritual</h2>
                <p className="text-xs text-zinc-400">Desvende os segredos do ocultismo</p>

                {/* Search and Filters UI */}
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <Input
                    placeholder="Buscar ritual pelo nome..."
                    value={ritualSearch}
                    onValueChange={setRitualSearch}
                    startContent={<Filter size={16} className="text-zinc-500" />}
                    className="flex-1"
                    size="sm"
                    classNames={{
                      inputWrapper: 'bg-zinc-950 border-zinc-800'
                    }}
                  />
                  <div className="flex gap-2">
                    <select
                      value={elementFilter}
                      onChange={(e) => setElementFilter(e.target.value)}
                      className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs rounded-lg p-2 focus:ring-amber-500/50 outline-none"
                    >
                      <option value="Todos">Todos Elementos</option>
                      <option value="Conhecimento">Conhecimento</option>
                      <option value="Energia">Energia</option>
                      <option value="Morte">Morte</option>
                      <option value="Sangue">Sangue</option>
                      <option value="Medo">Medo</option>
                    </select>
                    <select
                      value={circleFilter}
                      onChange={(e) => setCircleFilter(e.target.value)}
                      className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs rounded-lg p-2 focus:ring-amber-500/50 outline-none"
                    >
                      <option value="Todos">Todos Círculos</option>
                      <option value="1">1º Círculo</option>
                      <option value="2">2º Círculo</option>
                      <option value="3">3º Círculo</option>
                      <option value="4">4º Círculo</option>
                    </select>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                  {filteredRituals && filteredRituals.length > 0 ? (
                    filteredRituals.map((ritual) => {
                      const isAcquired = character.rituals?.some(
                        (r: any) => r.ritualId === ritual.id
                      )
                      const elementColor = (({
                        CONHECIMENTO: 'text-amber-400',
                        ENERGIA: 'text-purple-400',
                        MORTE: 'text-zinc-400',
                        SANGUE: 'text-red-400',
                        MEDO: 'text-white p-0.5 bg-zinc-800 rounded border border-white/20',
                      } as Record<string, string>)[(ritual.element || '').toUpperCase()]) || 'text-zinc-400'

                      return (
                        <Card
                          key={ritual.id}
                          isPressable={!isAcquired && !isAddingAbility}
                          onPress={() => !isAcquired && !isAddingAbility && addRitual(ritual.id)}
                          className={`bg-zinc-950 border border-zinc-700 hover:border-amber-500/50 transition-colors cursor-pointer ${isAcquired ? 'opacity-50 cursor-not-allowed grayscale' : ''} ${isAddingAbility ? 'opacity-70 cursor-wait' : ''}`}
                        >
                          <CardBody className="space-y-3">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="text-lg font-bold text-zinc-100">{ritual.name}</h3>
                                  <Chip size="sm" variant="flat" className="bg-zinc-900 text-zinc-400">
                                    {ritual.circle}º Círculo
                                  </Chip>
                                  {isAcquired && (
                                    <Chip size="sm" color="success" variant="flat">
                                      Aprendido
                                    </Chip>
                                  )}
                                </div>
                                <p className={`text-xs font-bold uppercase ${elementColor}`}>
                                  {ritual.element}
                                </p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-[10px] text-zinc-500 uppercase font-bold">
                              <div>
                                <span className="text-zinc-600">Execução:</span> {ritual.execution}
                              </div>
                              <div>
                                <span className="text-zinc-600">Alcance:</span> {ritual.range}
                              </div>
                              <div>
                                <span className="text-zinc-600 text-xs">Duração:</span> {ritual.duration}
                              </div>
                              {ritual.resistance && (
                                <div>
                                  <span className="text-zinc-600 text-xs">Resistência:</span> {ritual.resistance}
                                </div>
                              )}
                            </div>
                            {ritual.description && (
                              <p className="text-sm text-zinc-300 italic">
                                {ritual.description}
                              </p>
                            )}

                            {(ritual.discente || ritual.verdadeiro) && (
                              <div className="space-y-2 mt-2 pt-2 border-t border-zinc-800/50 text-xs">
                                {ritual.discente && (
                                  <div className="text-zinc-400">
                                    <span className="text-blue-400 font-bold uppercase mr-1">Discente:</span>
                                    {ritual.discente}
                                  </div>
                                )}
                                {ritual.verdadeiro && (
                                  <div className="text-zinc-400">
                                    <span className="text-purple-400 font-bold uppercase mr-1">Verdadeiro:</span>
                                    {ritual.verdadeiro}
                                  </div>
                                )}
                              </div>
                            )}
                          </CardBody>
                        </Card>
                      )
                    })
                  ) : (
                    <div className="p-8 text-center text-zinc-500 bg-zinc-950/20 border border-dashed border-zinc-800 rounded-xl">
                      <p>Nenhum ritual encontrado com esses filtros.</p>
                      <button
                        onClick={() => {
                          setRitualSearch('')
                          setElementFilter('Todos')
                          setCircleFilter('Todos')
                        }}
                        className="text-xs text-amber-500 hover:text-amber-400 mt-2 font-bold uppercase"
                      >
                        Limpar Filtros
                      </button>
                    </div>
                  )}
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}
