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
import { Head, Link, router } from '@inertiajs/react'
import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getOriginIcon } from '../../utils/originIcons'
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

interface CharacterProps {
  character: {
    id: number
    name: string
    nex: number
    classId?: number
    originId?: number
    trailId?: number
    trail?: { id: number; name: string }
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
  availableClassAbilities?: Array<{
    id: number
    classId: number
    name: string
    description: string | null
    effects: any
  }>
  totalPowerSlots?: number
  usedPowerSlots?: number
}

export default function CharacterShow({
  character,
  classes,
  origins,
  classTrails = [],
  calculatedStats,
  classInfo,
  attributeBonusFromNex = 0,
  trailProgressions = [],
  availableClassAbilities = [],
  totalPowerSlots = 0,
  usedPowerSlots = 0,
}: CharacterProps) {
  // Collapsible sections state
  const [expandedSections, setExpandedSections] = useState({
    originAbilities: true,
    classAbilities: true,
    trailAbilities: true,
    acquiredAbilities: true,
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Use calculated stats from server or fallback to defaults
  const [hp, setHp] = useState(calculatedStats?.currentHp || 21)
  const [pe, setPe] = useState(calculatedStats?.currentPe || 3)
  const [san, setSan] = useState(calculatedStats?.currentSanity || 12)

  // Damage taken inputs
  const [damageToHp, setDamageToHp] = useState(0)
  const [damageToPe, setDamageToPe] = useState(0)
  const [damageToSan, setDamageToSan] = useState(0)

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

  // Add ability modal state
  const {
    isOpen: isAddAbilityOpen,
    onOpen: onAddAbilityOpen,
    onOpenChange: onAddAbilityOpenChange,
  } = useDisclosure()
  const [selectedAbilityIds, setSelectedAbilityIds] = useState<number[]>([])
  const [isAddingAbilities, setIsAddingAbilities] = useState(false)
  const [abilitySearch, setAbilitySearch] = useState('')

  const remainingPowerSlots = totalPowerSlots - usedPowerSlots

  const filteredAvailableAbilities = useMemo(() => {
    // Filter out already acquired abilities (except repeatable ones like Transcender)
    const acquiredIds = (character.classAbilities || []).map((ca) => ca.classAbilityId)
    let abilities = availableClassAbilities.filter((a) => {
      const effects =
        typeof a.effects === 'string' ? JSON.parse(a.effects || '{}') : a.effects || {}
      if (effects.repeatable) return true // Always show repeatable abilities
      return !acquiredIds.includes(a.id)
    })
    if (abilitySearch.trim()) {
      const search = abilitySearch.trim().toLowerCase()
      abilities = abilities.filter(
        (a) =>
          a.name.toLowerCase().includes(search) ||
          (a.description && a.description.toLowerCase().includes(search))
      )
    }
    return abilities
  }, [availableClassAbilities, character.classAbilities, abilitySearch])

  const toggleAbilitySelection = (abilityId: number) => {
    if (selectedAbilityIds.includes(abilityId)) {
      setSelectedAbilityIds(selectedAbilityIds.filter((id) => id !== abilityId))
    } else {
      if (selectedAbilityIds.length < remainingPowerSlots) {
        setSelectedAbilityIds([...selectedAbilityIds, abilityId])
      }
    }
  }

  const submitAddAbilities = () => {
    if (selectedAbilityIds.length === 0) return
    setIsAddingAbilities(true)
    router.post(
      `/characters/${character.id}/abilities`,
      { abilityIds: selectedAbilityIds },
      {
        onSuccess: () => {
          setIsAddingAbilities(false)
          setSelectedAbilityIds([])
          setAbilitySearch('')
          onAddAbilityOpenChange()
        },
        onError: (errors) => {
          setIsAddingAbilities(false)
          console.error('Add abilities failed:', errors)
        },
      }
    )
  }

  const removeAcquiredAbility = (characterAbilityId: number) => {
    router.delete(`/characters/${character.id}/abilities/${characterAbilityId}`, {
      onError: (errors) => {
        console.error('Remove ability failed:', errors)
      },
    })
  }

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
    let calculatedMaxSan = baseSanity + (level - 1) * sanityPerLevel

    // Transcender: reduce max sanity by sanityPerLevel for each instance
    const transcenderCount = (character.classAbilities || []).filter(
      (ca) => ca.classAbility?.name === 'Transcender'
    ).length
    if (transcenderCount > 0) {
      calculatedMaxSan -= sanityPerLevel * transcenderCount
    }

    return {
      maxHp: calculatedMaxHp,
      maxPe: calculatedMaxPe,
      maxSan: calculatedMaxSan,
    }
  }, [character.nex, vigor, presence, classInfo, character.classAbilities])

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
    // If max decreased and Sanity is above new max, cap it
    else if (san > maxSan) {
      setSan(maxSan)
    }
    setPrevMaxSan(maxSan)
  }, [maxSan])

  // Apply damage to HP based on damage input
  useEffect(() => {
    const baseHp = calculatedStats?.currentHp || 21
    const appliedDamage = Math.max(0, damageToHp)
    const newHp = Math.max(0, baseHp - appliedDamage)
    setHp(newHp)
  }, [damageToHp])

  // Apply damage to PE based on damage input
  useEffect(() => {
    const basePe = calculatedStats?.currentPe || 3
    const appliedDamage = Math.max(0, damageToPe)
    const newPe = Math.max(0, basePe - appliedDamage)
    setPe(newPe)
  }, [damageToPe])

  // Apply damage to Sanity based on damage input
  useEffect(() => {
    const baseSan = calculatedStats?.currentSanity || 12
    const appliedDamage = Math.max(0, damageToSan)
    const newSan = Math.max(0, baseSan - appliedDamage)
    setSan(newSan)
  }, [damageToSan])

  // Calculate available points: 4 base + NEX bonus + 1 for each attribute at 0
  // All attributes start at 1 (base). Points spent = value above 1. Reducing to 0 gives +1 bonus.
  const { totalPoints, usedPoints, availablePoints } = useMemo(() => {
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
  const attrs = { strength, agility, intellect, vigor, presence }

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
  const skills: any[] = []

  const inventory: { name: string; desc: string; qty: number; weight: string; type: string }[] = []

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
                        className={`h-auto py-2 flex flex-col items-center justify-center gap-1 rounded-lg transition-all ${
                          isLearningSkills && !isLocked
                            ? 'cursor-pointer hover:scale-105'
                            : isLocked && isTrained
                              ? 'cursor-not-allowed opacity-75'
                              : ''
                        } ${
                          !isTrained
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
                    >
                      <Plus size={14} className="mr-2" /> Adicionar Item
                    </Button>
                  </div>

                  {/* Weight Bar + Filters */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-500">⚖️</span>
                      <span className="text-xs text-zinc-400">19.2 / 80 kg</span>
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-zinc-800">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{ width: '24%' }}
                        />
                      </div>
                    </div>
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

                  {/* Items List */}
                  <div className="space-y-2 overflow-y-auto custom-scrollbar">
                    {inventory.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 bg-zinc-950/50 hover:bg-zinc-950 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2.5 rounded-lg border ${i === 0 ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : i === 2 ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 'bg-orange-500/10 border-orange-500/20 text-orange-400'}`}
                          >
                            {i === 0 ? (
                              <Activity size={18} />
                            ) : i === 2 ? (
                              <Zap size={18} />
                            ) : (
                              <Zap size={18} />
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-zinc-200 text-sm">{item.name}</div>
                            <div className="text-[11px] text-zinc-500">{item.desc}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-zinc-400">
                          <span className="text-zinc-500">x{item.qty}</span>
                          <span className="text-zinc-500">{item.weight}</span>
                          <span className="px-2 py-0.5 rounded border border-zinc-700 bg-zinc-800 text-zinc-400">
                            {item.type === 'Equipamento' ? 'Equip' : item.type}
                          </span>
                          <button className="text-zinc-600 hover:text-red-400 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
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
                    >
                      <Plus size={14} className="mr-2" /> Aprender Ritual
                    </Button>
                  </div>

                  {/* Rituals List */}
                  <div className="space-y-2 overflow-y-auto custom-scrollbar">
                    <div className="text-zinc-500 text-center italic py-8">
                      Nenhum ritual aprendido.
                    </div>
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
                    </div>
                    <Button
                      size="sm"
                      className="bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700"
                      onPress={() => {
                        setSelectedAbilityIds([])
                        setAbilitySearch('')
                        onAddAbilityOpen()
                      }}
                      isDisabled={remainingPowerSlots <= 0}
                    >
                      <Plus size={14} className="mr-2" /> Adicionar Habilidade
                      {totalPowerSlots > 0 && (
                        <span className="ml-1 text-xs text-zinc-400">
                          ({usedPowerSlots}/{totalPowerSlots})
                        </span>
                      )}
                    </Button>
                  </div>

                  {/* Skills List */}
                  <div className="space-y-6 overflow-y-auto custom-scrollbar">
                    {/* HABILIDADE DE ORIGEM */}
                    {character.origin?.abilityName && (
                      <div>
                        <button
                          onClick={() => toggleSection('originAbilities')}
                          className="w-full flex items-center gap-2 mb-3 hover:opacity-75 transition-opacity"
                        >
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <h4 className="font-bold text-blue-400 text-sm uppercase tracking-wider flex-1 text-left">
                            Habilidade de Origem
                          </h4>
                          <motion.div
                            animate={{ rotate: expandedSections.originAbilities ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown size={16} className="text-blue-400" />
                          </motion.div>
                        </button>
                        <AnimatePresence>
                          {expandedSections.originAbilities && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="space-y-2"
                            >
                              <div className="p-3 bg-zinc-950/50 hover:bg-zinc-950 rounded-lg border border-blue-500/30 hover:border-blue-500/50 transition-all">
                                <div className="flex items-start">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h5 className="font-semibold text-blue-300">
                                        {character.origin.abilityName}
                                      </h5>
                                      <span className="px-1.5 py-0.5 bg-blue-500/20 border border-blue-500/40 rounded text-blue-300 text-xs font-bold">
                                        {character.origin.name}
                                      </span>
                                    </div>
                                    {character.origin.abilityDescription && (
                                      <p className="text-zinc-400 text-xs leading-relaxed mt-1">
                                        {character.origin.abilityDescription}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {/* HABILIDADES OBRIGATÓRIAS DA CLASSE */}
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
                            {character.classAbilities &&
                            character.classAbilities.filter((ca) => {
                              const eff =
                                typeof ca.classAbility?.effects === 'string'
                                  ? JSON.parse(ca.classAbility.effects || '{}')
                                  : ca.classAbility?.effects || {}
                              return eff.mandatory === true
                            }).length > 0 ? (
                              character.classAbilities
                                .filter((ca) => {
                                  const eff =
                                    typeof ca.classAbility?.effects === 'string'
                                      ? JSON.parse(ca.classAbility.effects || '{}')
                                      : ca.classAbility?.effects || {}
                                  return eff.mandatory === true
                                })
                                .map((ability, idx) => (
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
                                ))
                            ) : (
                              <div className="p-3 bg-zinc-950/30 rounded-lg border border-zinc-700/30 text-zinc-500 text-xs italic text-center">
                                Nenhuma habilidade obrigatória
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* HABILIDADES DE TRILHA */}
                    {character.trail && trailProgressions && trailProgressions.length > 0 && (
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
                              {trailProgressions.map((progression, idx) => (
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

                    {/* HABILIDADES ADQUIRIDAS */}
                    <div>
                      <button
                        onClick={() => toggleSection('acquiredAbilities')}
                        className="w-full flex items-center gap-2 mb-3 hover:opacity-75 transition-opacity"
                      >
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <h4 className="font-bold text-emerald-400 text-sm uppercase tracking-wider flex-1 text-left">
                          Adquiridas
                        </h4>
                        <motion.div
                          animate={{ rotate: expandedSections.acquiredAbilities ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown size={16} className="text-emerald-400" />
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
                            {!character.trail ? (
                              <Button
                                fullWidth
                                color="primary"
                                className="font-bold"
                                onPress={onTrailModalOpen}
                              >
                                Escolher una Trilha
                              </Button>
                            ) : (
                              (() => {
                                // Get acquired non-mandatory abilities
                                const mandatoryIds = availableClassAbilities.length > 0 ? [] : [] // availableClassAbilities already excludes mandatory
                                const acquiredNonMandatory = (
                                  character.classAbilities || []
                                ).filter((ca) => {
                                  const eff =
                                    typeof ca.classAbility?.effects === 'string'
                                      ? JSON.parse(ca.classAbility.effects || '{}')
                                      : ca.classAbility?.effects || {}
                                  return !eff.mandatory
                                })
                                if (acquiredNonMandatory.length === 0) {
                                  return (
                                    <div className="p-3 bg-zinc-950/30 rounded-lg border border-zinc-700/30 text-zinc-500 text-xs italic text-center">
                                      Nenhuma habilidade adquirida ainda. Use o botão "Adicionar
                                      Habilidade" acima.
                                    </div>
                                  )
                                }
                                return acquiredNonMandatory.map((ability, idx) => (
                                  <div
                                    key={idx}
                                    className="p-3 bg-zinc-950/50 hover:bg-zinc-950 rounded-lg border border-emerald-500/30 hover:border-emerald-500/50 transition-all"
                                  >
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                          <h5 className="font-semibold text-emerald-300">
                                            {ability.classAbility?.name}
                                          </h5>
                                        </div>
                                        <p className="text-zinc-400 text-xs leading-relaxed mt-1">
                                          {ability.classAbility?.description}
                                        </p>
                                      </div>
                                      <Button
                                        isIconOnly
                                        size="sm"
                                        className="ml-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40"
                                        onPress={() => removeAcquiredAbility(ability.id)}
                                      >
                                        <Trash2 size={14} />
                                      </Button>
                                    </div>
                                  </div>
                                ))
                              })()
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
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
                      <span className="text-xs font-bold text-zinc-400 w-8 whitespace-nowrap">
                        {attr.label}
                      </span>
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
                    onChange={(e) => setDamageToHp(Math.max(0, Number(e.target.value)))}
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
                    onChange={(e) => setDamageToPe(Math.max(0, Number(e.target.value)))}
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
                    onChange={(e) => setDamageToSan(Math.max(0, Number(e.target.value)))}
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
                                        radius="xl"
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
                            className={`font-semibold ${
                              selectedSkills.includes(skill)
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

      {/* Add Ability Modal */}
      <Modal
        isOpen={isAddAbilityOpen}
        onOpenChange={onAddAbilityOpenChange}
        size="3xl"
        scrollBehavior="inside"
        classNames={{
          base: 'bg-zinc-900 border border-zinc-800',
          header: 'border-b border-zinc-800',
          body: 'py-4',
          footer: 'border-t border-zinc-800',
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Adicionar Habilidade de Classe</h2>
                  <Chip
                    size="sm"
                    className={`border ${
                      remainingPowerSlots - selectedAbilityIds.length > 0
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}
                  >
                    {selectedAbilityIds.length} / {remainingPowerSlots} slots disponíveis
                  </Chip>
                </div>
                <p className="text-xs text-zinc-400">
                  Selecione as habilidades de {character.class?.name || 'classe'} que deseja
                  adquirir. Você ganha 1 slot de poder nos NEX 15%, 30%, 45%, 60%, 75% e 90%.
                </p>
              </ModalHeader>
              <ModalBody>
                {/* Search */}
                <Input
                  placeholder="Buscar habilidade..."
                  value={abilitySearch}
                  onValueChange={setAbilitySearch}
                  size="sm"
                  classNames={{
                    inputWrapper: 'bg-zinc-950 border border-zinc-700 hover:border-zinc-600',
                    input: 'text-zinc-200',
                  }}
                  startContent={<Filter size={14} className="text-zinc-500" />}
                />

                {/* Available abilities */}
                <div className="space-y-2 mt-2">
                  {filteredAvailableAbilities.length > 0 ? (
                    filteredAvailableAbilities.map((ability) => {
                      const isSelected = selectedAbilityIds.includes(ability.id)
                      const isDisabled =
                        !isSelected && selectedAbilityIds.length >= remainingPowerSlots
                      return (
                        <div
                          key={ability.id}
                          onClick={() => !isDisabled && toggleAbilitySelection(ability.id)}
                          className={`p-3 rounded-lg border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-500/10 border-emerald-500/50 hover:border-emerald-500/70'
                              : isDisabled
                                ? 'bg-zinc-950/30 border-zinc-700/30 opacity-50 cursor-not-allowed'
                                : 'bg-zinc-950/50 border-zinc-700/30 hover:border-zinc-600/50 hover:bg-zinc-950'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                                isSelected
                                  ? 'border-emerald-500 bg-emerald-500'
                                  : 'border-zinc-600 bg-transparent'
                              }`}
                            >
                              {isSelected && <Check size={12} className="text-white" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5
                                className={`font-semibold text-sm ${isSelected ? 'text-emerald-300' : 'text-zinc-200'}`}
                              >
                                {ability.name}
                              </h5>
                              {ability.description && (
                                <p className="text-zinc-400 text-xs leading-relaxed mt-1">
                                  {ability.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="p-6 text-center text-zinc-500 text-sm italic">
                      {abilitySearch.trim()
                        ? 'Nenhuma habilidade encontrada com esse termo.'
                        : 'Todas as habilidades disponíveis já foram adquiridas.'}
                    </div>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="flat"
                  onPress={onClose}
                  className="bg-zinc-800 text-zinc-300 border border-zinc-700"
                >
                  Cancelar
                </Button>
                <Button
                  color="primary"
                  onPress={submitAddAbilities}
                  isDisabled={selectedAbilityIds.length === 0}
                  isLoading={isAddingAbilities}
                  className="font-bold"
                >
                  <Plus size={14} className="mr-1" />
                  Adicionar {selectedAbilityIds.length > 0 ? `(${selectedAbilityIds.length})` : ''}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}
