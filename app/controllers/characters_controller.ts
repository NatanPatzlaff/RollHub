import type { HttpContext } from '@adonisjs/core/http'
import Character from '#models/character'
import Class from '#models/class'
import Origin from '#models/origin'
import Skill from '#models/skill'
import Trail from '#models/trail'
import CharacterAttribute from '#models/character_attribute'
import CharacterStat from '#models/character_stat'
import CharacterSkill from '#models/character_skill'
import CharacterClassAbility from '#models/character_class_ability'
import ClassAbility from '#models/class_ability'
import TrailProgression from '#models/trail_progression'

export default class CharactersController {
  async store({ request, response, auth }: HttpContext) {
    const user = auth.user!
    const data = request.only(['nex', 'classId', 'originId', 'name'])

    // Fetch the class to access stats info
    const characterClass = await Class.findOrFail(data.classId)
    const defaultName = data.name || `Agente ${characterClass.name}`

    const character = await Character.create({
      userId: user.id,
      name: defaultName,
      nex: data.nex,
      classId: data.classId,
      originId: data.originId,
      xp: 0, // Default XP
    })

    // Create default attributes (all at 1 - player will use 4 points to change)
    await CharacterAttribute.create({
      characterId: character.id,
      strength: 1,
      agility: 1,
      intellect: 1,
      presence: 1,
      vigor: 1,
    })

    // Calculate initial max stats based on class and NEX
    const nex = data.nex || 5
    const level = Math.floor(nex / 5) // 5% = lvl 1, 10% = lvl 2, etc

    // Default attributes start at 1
    const defaultVigor = 1
    const defaultPresence = 1

    // Calculate max HP: base + (vigor bonus if applicable) + (hp_per_level * levels beyond 1)
    let maxHp = characterClass.baseHp
    if (characterClass.hpAttribute === 'vigor') {
      maxHp += defaultVigor
    }
    if (level > 1) {
      if (characterClass.hpAttribute === 'vigor') {
        maxHp += (characterClass.hpPerLevel + defaultVigor) * (level - 1)
      } else {
        maxHp += characterClass.hpPerLevel * (level - 1)
      }
    }

    // Calculate max PE: base + (presence bonus if applicable) + (pe_per_level * levels beyond 1)
    let maxPe = characterClass.basePe
    if (characterClass.peAttribute === 'presence') {
      maxPe += defaultPresence
    }
    if (level > 1) {
      if (characterClass.peAttribute === 'presence') {
        maxPe += (characterClass.pePerLevel + defaultPresence) * (level - 1)
      } else {
        maxPe += characterClass.pePerLevel * (level - 1)
      }
    }

    // Calculate max Sanity: base + (sanity_per_level * levels beyond 1)
    let maxSanity = characterClass.baseSanity
    if (level > 1) {
      maxSanity += characterClass.sanityPerLevel * (level - 1)
    }

    await CharacterStat.create({
      characterId: character.id,
      maxHp: maxHp,
      currentHp: maxHp,
      maxPe: maxPe,
      currentPe: maxPe,
      maxSanity: maxSanity,
      currentSanity: maxSanity,
      defenseMisc: 0,
      defenseTemp: 0,
      dodgeMisc: 0,
      dodgeTemp: 0,
      blockDrMisc: 0,
      blockDrTemp: 0,
    })

    // Add trained skills from origin
    if (data.originId) {
      console.log(
        `[SKILL ASSIGNMENT] Creating character ${character.id} with originId ${data.originId}`
      )
      const origin = await Origin.findOrFail(data.originId)

      console.log(`[SKILL ASSIGNMENT] Origin: ${origin.name}`)
      console.log(`[SKILL ASSIGNMENT] trainedSkills: ${JSON.stringify(origin.trainedSkills)}`)
      console.log(`[SKILL ASSIGNMENT] Is Array: ${Array.isArray(origin.trainedSkills)}`)

      if (origin.trainedSkills && Array.isArray(origin.trainedSkills)) {
        console.log(`[SKILL ASSIGNMENT] Found ${origin.trainedSkills.length} skills to assign`)
        for (const skillName of origin.trainedSkills) {
          console.log(`[SKILL ASSIGNMENT] Looking for skill: ${skillName}`)
          const skill = await Skill.query().where('name', skillName).first()

          if (skill) {
            console.log(`[SKILL ASSIGNMENT] Found skill ID ${skill.id} for ${skillName}`)
            await CharacterSkill.create({
              characterId: character.id,
              skillId: skill.id,
              trainingDegree: 5, // 5 = Trained (trained by origin, ignores class limits)
            })
            console.log(`[SKILL ASSIGNMENT] Created CharacterSkill for ${skillName}`)
          } else {
            console.log(`[SKILL ASSIGNMENT] Skill ${skillName} not found in database!`)
          }
        }
      } else {
        console.log(`[SKILL ASSIGNMENT] trainedSkills is null/not array: ${origin.trainedSkills}`)
      }
    } else {
      console.log(`[SKILL ASSIGNMENT] No originId provided`)
    }

    // Add mandatory class abilities
    const allClassAbilities = await ClassAbility.query().where('classId', data.classId)

    console.log(
      `[CLASS ABILITY] Found ${allClassAbilities.length} total abilities for class ${data.classId}`
    )

    for (const ability of allClassAbilities) {
      const effects =
        typeof ability.effects === 'string'
          ? JSON.parse(ability.effects || '{}')
          : ability.effects || {}

      if (effects.mandatory === true) {
        console.log(`[CLASS ABILITY] Adding mandatory ability: ${ability.name}`)
        await CharacterClassAbility.create({
          characterId: character.id,
          classAbilityId: ability.id,
        })
        console.log(`[CLASS ABILITY] Added ability ${ability.name} to character ${character.id}`)
      }
    }

    return response.redirect().toPath(`/characters/${character.id}`)
  }

  async show({ params, inertia }: HttpContext) {
    try {
      const character = await Character.query()
        .where('id', params.id)
        .preload('class')
        .preload('origin')
        .preload('trail')
        .preload('attributes')
        .preload('stats')
        .preload('skills', (query) => query.preload('skill'))
        .preload('classAbilities', (query) => query.preload('classAbility'))
        .first()

      if (!character) {
        return inertia.render('errors/not_found', {})
      }

      // Get trail progressions if character has a trail
      let trailProgressions: TrailProgression[] = []
      if (character.trailId) {
        trailProgressions = await TrailProgression.query()
          .where('trailId', character.trailId)
          .orderBy('nex', 'asc')
      }

      // Get all trails for the character's class with their progressions
      const classTrails = await Trail.query()
        .where('classId', character.classId)
        .orderBy('name', 'asc')
        .preload('progression', (query) => query.orderBy('nex', 'asc'))

      // Get all classes and origins for edit modal
      const classes = await Class.all()
      const origins = await Origin.all()

      // Calculate derived stats
      const attributes = character.attributes
      const classData = character.class
      const nex = character.nex
      const level = Math.floor(nex / 5)

      // Recalculate max stats based on current attributes and NEX
      let calculatedMaxHp = classData.baseHp
      if (classData.hpAttribute === 'vigor' && attributes) {
        calculatedMaxHp += attributes.vigor
      }
      if (level > 1) {
        // Add vigor at each level if hp_attribute is 'vigor'
        if (classData.hpAttribute === 'vigor' && attributes) {
          calculatedMaxHp += (classData.hpPerLevel + attributes.vigor) * (level - 1)
        } else {
          calculatedMaxHp += classData.hpPerLevel * (level - 1)
        }
      }

      let calculatedMaxPe = classData.basePe
      if (classData.peAttribute === 'presence' && attributes) {
        calculatedMaxPe += attributes.presence
      }
      if (level > 1) {
        if (classData.peAttribute === 'presence' && attributes) {
          calculatedMaxPe += (classData.pePerLevel + attributes.presence) * (level - 1)
        } else {
          calculatedMaxPe += classData.pePerLevel * (level - 1)
        }
      }

      let calculatedMaxSanity = classData.baseSanity
      if (level > 1) {
        calculatedMaxSanity += classData.sanityPerLevel * (level - 1)
      }

      // Transcender: reduce max sanity by sanityPerLevel for each instance
      const transcenderCount = (character.classAbilities || []).filter(
        (ca) => ca.classAbility?.name === 'Transcender'
      ).length
      if (transcenderCount > 0) {
        calculatedMaxSanity -= classData.sanityPerLevel * transcenderCount
      }

      // Calculate defense (10 + AGI + armor)
      const baseDefense = 10 + (attributes?.agility || 0)
      const baseDodge = attributes?.agility || 0

      // Calculate attribute bonus points from NEX (Aumento de Atributo at 20%, 50%, 80%, 95%)
      // Each gives +1 point to distribute
      let attributeBonusFromNex = 0
      if (nex >= 20) attributeBonusFromNex += 1
      if (nex >= 50) attributeBonusFromNex += 1
      if (nex >= 80) attributeBonusFromNex += 1
      if (nex >= 95) attributeBonusFromNex += 1

      // Get all non-mandatory class abilities for the ability selection modal
      const allAbilitiesForClass = await ClassAbility.query().where('classId', character.classId)

      const availableClassAbilities = allAbilitiesForClass.filter((ability) => {
        const effects =
          typeof ability.effects === 'string'
            ? JSON.parse(ability.effects || '{}')
            : ability.effects || {}
        return !effects.mandatory
      })

      // Calculate power slots based on NEX
      // All classes get a power slot at NEX 15%, 30%, 45%, 60%, 75%, 90%
      const powerSlotNexLevels = [15, 30, 45, 60, 75, 90]
      const totalPowerSlots = powerSlotNexLevels.filter((n) => nex >= n).length

      // Count already acquired (non-mandatory) abilities
      const acquiredAbilityIds = (character.classAbilities || []).map((ca) => ca.classAbilityId)
      const mandatoryAbilityIds = new Set(
        allAbilitiesForClass
          .filter((a) => {
            const eff =
              typeof a.effects === 'string' ? JSON.parse(a.effects || '{}') : a.effects || {}
            return eff.mandatory === true
          })
          .map((a) => a.id)
      )
      const acquiredNonMandatoryCount = acquiredAbilityIds.filter(
        (id) => !mandatoryAbilityIds.has(id)
      ).length

      return inertia.render('characters/show', {
        character,
        classes,
        origins,
        classTrails,
        availableClassAbilities,
        totalPowerSlots,
        usedPowerSlots: acquiredNonMandatoryCount,
        calculatedStats: {
          maxHp: calculatedMaxHp,
          maxPe: calculatedMaxPe,
          maxSanity: calculatedMaxSanity,
          currentHp: character.stats?.currentHp || calculatedMaxHp,
          currentPe: character.stats?.currentPe || calculatedMaxPe,
          currentSanity: character.stats?.currentSanity || calculatedMaxSanity,
          defense:
            baseDefense + (character.stats?.defenseMisc || 0) + (character.stats?.defenseTemp || 0),
          dodge: baseDodge + (character.stats?.dodgeMisc || 0) + (character.stats?.dodgeTemp || 0),
        },
        classInfo: {
          hpFormula: `${classData.baseHp} + ${classData.hpAttribute?.toUpperCase() || ''} | +${classData.hpPerLevel} PV (+${classData.hpAttribute?.substring(0, 3).toUpperCase() || ''}) por NEX`,
          peFormula: `${classData.basePe} + ${classData.peAttribute?.toUpperCase() || ''} | +${classData.pePerLevel} PE (+${classData.peAttribute?.substring(0, 3).toUpperCase() || ''}) por NEX`,
          sanityFormula: `${classData.baseSanity} | +${classData.sanityPerLevel} SAN por NEX`,
          proficiencies: classData.proficiencies,
        },
        attributeBonusFromNex,
        trailProgressions,
      })
    } catch (error) {
      console.error('[CHARACTER SHOW] Error loading character:', error)
      return inertia.render('errors/not_found', {})
    }
  }

  async updateAttributes({ params, request, response, auth }: HttpContext) {
    const user = auth.user!
    const character = await Character.query()
      .where('id', params.id)
      .where('userId', user.id)
      .preload('attributes')
      .preload('stats')
      .preload('class')
      .firstOrFail()

    const { strength, agility, intellect, vigor, presence } = request.only([
      'strength',
      'agility',
      'intellect',
      'vigor',
      'presence',
    ])

    // Calculate attribute bonus from NEX (Aumento de Atributo at 20%, 50%, 80%, 95%)
    const nex = character.nex
    let nexBonus = 0
    if (nex >= 20) nexBonus += 1
    if (nex >= 50) nexBonus += 1
    if (nex >= 80) nexBonus += 1
    if (nex >= 95) nexBonus += 1

    // Calculate total points available (4 base + NEX bonus + 1 for each attribute at 0)
    // All attributes have base 1. Points used = value above base. Reducing to 0 gives +1 bonus.
    const attrs = [strength, agility, intellect, vigor, presence]
    const basePoints = 4 + nexBonus
    const zeroBonus = attrs.filter((v: number) => v === 0).length
    const totalAvailable = basePoints + zeroBonus
    // Points used = sum of (value - 1) for each attribute
    const totalUsed = attrs.reduce((sum: number, v: number) => sum + (v - 1), 0)

    if (totalUsed > totalAvailable) {
      return response.badRequest({ error: 'Pontos insuficientes' })
    }

    // Update or create attributes
    if (character.attributes) {
      character.attributes.strength = strength
      character.attributes.agility = agility
      character.attributes.intellect = intellect
      character.attributes.vigor = vigor
      character.attributes.presence = presence
      await character.attributes.save()
    } else {
      await CharacterAttribute.create({
        characterId: character.id,
        strength,
        agility,
        intellect,
        vigor,
        presence,
      })
    }

    // Recalculate and update max stats based on new attributes
    const classData = character.class
    const level = Math.floor(nex / 5)

    let maxHp = classData.baseHp
    if (classData.hpAttribute === 'vigor') {
      maxHp += vigor
    }
    if (level > 1) {
      if (classData.hpAttribute === 'vigor') {
        maxHp += (classData.hpPerLevel + vigor) * (level - 1)
      } else {
        maxHp += classData.hpPerLevel * (level - 1)
      }
    }

    let maxPe = classData.basePe
    if (classData.peAttribute === 'presence') {
      maxPe += presence
    }
    if (level > 1) {
      if (classData.peAttribute === 'presence') {
        maxPe += (classData.pePerLevel + presence) * (level - 1)
      } else {
        maxPe += classData.pePerLevel * (level - 1)
      }
    }

    let maxSanity = classData.baseSanity
    if (level > 1) {
      maxSanity += classData.sanityPerLevel * (level - 1)
    }

    // Transcender: reduce max sanity by sanityPerLevel for each instance
    const charAbilities = await CharacterClassAbility.query()
      .where('characterId', character.id)
      .preload('classAbility')
    const transcenderCount = charAbilities.filter(
      (ca) => ca.classAbility?.name === 'Transcender'
    ).length
    if (transcenderCount > 0) {
      maxSanity -= classData.sanityPerLevel * transcenderCount
    }

    // Update stats
    if (character.stats) {
      character.stats.maxHp = maxHp
      character.stats.maxPe = maxPe
      character.stats.maxSanity = maxSanity
      // Cap current values to new max
      character.stats.currentHp = Math.min(character.stats.currentHp, maxHp)
      character.stats.currentPe = Math.min(character.stats.currentPe, maxPe)
      character.stats.currentSanity = Math.min(character.stats.currentSanity, maxSanity)
      await character.stats.save()
    }

    return response.redirect().back()
  }

  async update({ params, request, response, auth }: HttpContext) {
    const user = auth.user!
    const character = await Character.query()
      .where('id', params.id)
      .where('userId', user.id)
      .preload('skills')
      .firstOrFail()

    const { name, classId, originId, nex } = request.only(['name', 'classId', 'originId', 'nex'])

    // Update basic info
    if (name) character.name = name
    if (nex !== undefined) character.nex = nex
    if (classId) character.classId = classId

    // If origin changed, we need to update skills
    if (originId && originId !== character.originId) {
      // Remove old origin skills (trainingDegree = 5 that came from old origin)
      const oldOrigin = await Origin.find(character.originId)
      if (oldOrigin) {
        const oldSkillNames =
          typeof oldOrigin.trainedSkills === 'string'
            ? JSON.parse(oldOrigin.trainedSkills || '[]')
            : oldOrigin.trainedSkills || []

        for (const skillName of oldSkillNames) {
          const skill = await Skill.findBy('name', skillName)
          if (skill) {
            const charSkill = await CharacterSkill.query()
              .where('characterId', character.id)
              .where('skillId', skill.id)
              .where('trainingDegree', 5)
              .first()
            if (charSkill) {
              await charSkill.delete()
            }
          }
        }
      }

      // Add new origin skills
      const newOrigin = await Origin.findOrFail(originId)
      const newSkillNames =
        typeof newOrigin.trainedSkills === 'string'
          ? JSON.parse(newOrigin.trainedSkills || '[]')
          : newOrigin.trainedSkills || []

      for (const skillName of newSkillNames) {
        const skill = await Skill.findBy('name', skillName)
        if (skill) {
          const existingSkill = await CharacterSkill.query()
            .where('characterId', character.id)
            .where('skillId', skill.id)
            .first()

          if (!existingSkill) {
            await CharacterSkill.create({
              characterId: character.id,
              skillId: skill.id,
              trainingDegree: 5,
            })
          }
        }
      }

      character.originId = originId
    }

    await character.save()

    return response.redirect().back()
  }

  async configureAbility({ params, request, response, auth }: HttpContext) {
    const user = auth.user!
    const character = await Character.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail()

    const ability = await CharacterClassAbility.query()
      .where('characterId', character.id)
      .where('id', params.abilityId)
      .preload('classAbility')
      .firstOrFail()

    // Get config from request
    const config = request.only(['selectedSkills'])

    // Validate that it's not Luta or Pontaria
    if (config.selectedSkills && Array.isArray(config.selectedSkills)) {
      const invalidSkills = config.selectedSkills.filter(
        (skill: string) => skill === 'Luta' || skill === 'Pontaria'
      )
      if (invalidSkills.length > 0) {
        return response.status(400).send({ error: 'Luta e Pontaria não podem ser selecionadas' })
      }
    }

    // Validate that exactly 2 skills are selected for Perito
    if (ability.classAbility?.name === 'Perito') {
      if (!config.selectedSkills || config.selectedSkills.length !== 2) {
        return response.status(400).send({ error: 'Perito requer exatamente 2 perícias' })
      }
    }

    // Update config
    ability.config = config
    await ability.save()

    // Redirect back to character page - Inertia will re-render with updated data
    return response.redirect().back()
  }

  async updateSkills({ params, request, response, auth }: HttpContext) {
    const user = auth.user!
    const character = await Character.query()
      .where('id', params.id)
      .where('userId', user.id)
      .preload('origin')
      .preload('skills', (query) => query.preload('skill'))
      .firstOrFail()

    // Get the data from request
    const { trainedSkills, veteranSkills } = request.only(['trainedSkills', 'veteranSkills'])

    // Get origin's initial skills
    const originSkillNames = character.origin
      ? typeof character.origin.trainedSkills === 'string'
        ? JSON.parse(character.origin.trainedSkills || '[]')
        : character.origin.trainedSkills || []
      : []

    // Find origin skill IDs
    const originSkillIds = new Set<number>()
    for (const skillName of originSkillNames) {
      const skill = await Skill.findBy('name', skillName)
      if (skill) {
        originSkillIds.add(skill.id)
      }
    }

    // Delete all non-origin skills
    const existingSkills = await CharacterSkill.query().where('characterId', character.id)
    for (const existingSkill of existingSkills) {
      if (!originSkillIds.has(existingSkill.skillId)) {
        await existingSkill.delete()
      }
    }

    // Add the new trained and veteran skills
    const allSelectedSkills = [...(trainedSkills || []), ...(veteranSkills || [])]

    for (const skillName of allSelectedSkills) {
      const skill = await Skill.findBy('name', skillName)
      if (skill && !originSkillIds.has(skill.id)) {
        const degree = veteranSkills?.includes(skillName) ? 10 : 5

        // Check if already exists (from origin)
        const existing = await CharacterSkill.query()
          .where('characterId', character.id)
          .where('skillId', skill.id)
          .first()

        if (existing) {
          existing.trainingDegree = degree
          await existing.save()
        } else {
          await CharacterSkill.create({
            characterId: character.id,
            skillId: skill.id,
            trainingDegree: degree,
          })
        }
      }
    }

    // Reload page to show updated skills
    return response.redirect().back()
  }

  async selectTrail({ params, request, response, auth }: HttpContext) {
    const user = auth.user!
    const character = await Character.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail()

    const { trailId } = request.only(['trailId'])

    // Verify trail exists and belongs to the character's class
    const trail = await Trail.query()
      .where('id', trailId)
      .where('classId', character.classId)
      .firstOrFail()

    character.trailId = trail.id
    await character.save()

    return response.redirect().back()
  }

  async addAbilities({ params, request, response, auth }: HttpContext) {
    const user = auth.user!
    const character = await Character.query()
      .where('id', params.id)
      .where('userId', user.id)
      .preload('classAbilities')
      .firstOrFail()

    const { abilityIds } = request.only(['abilityIds'])

    if (!abilityIds || !Array.isArray(abilityIds) || abilityIds.length === 0) {
      return response.badRequest({ error: 'Nenhuma habilidade selecionada' })
    }

    // Get all class abilities to check mandatory ones
    const allClassAbilities = await ClassAbility.query().where('classId', character.classId)

    const mandatoryIds = new Set(
      allClassAbilities
        .filter((a) => {
          const eff =
            typeof a.effects === 'string' ? JSON.parse(a.effects || '{}') : a.effects || {}
          return eff.mandatory === true
        })
        .map((a) => a.id)
    )

    // Calculate power slots
    const nex = character.nex
    const powerSlotNexLevels = [15, 30, 45, 60, 75, 90]
    const totalPowerSlots = powerSlotNexLevels.filter((n) => nex >= n).length

    // Count current non-mandatory abilities
    const currentNonMandatory = character.classAbilities.filter(
      (ca) => !mandatoryIds.has(ca.classAbilityId)
    )
    const currentCount = currentNonMandatory.length

    // Check slot limits
    if (currentCount + abilityIds.length > totalPowerSlots) {
      return response.badRequest({
        error: `Slots insuficientes. Disponíveis: ${totalPowerSlots - currentCount}`,
      })
    }

    // Verify all abilities belong to this class and are not mandatory
    const validAbilityIds = new Set(
      allClassAbilities.filter((a) => !mandatoryIds.has(a.id)).map((a) => a.id)
    )

    for (const abilityId of abilityIds) {
      if (!validAbilityIds.has(abilityId)) {
        return response.badRequest({
          error: `Habilidade ${abilityId} não é válida para esta classe`,
        })
      }
      // Check not already acquired (unless repeatable)
      const abilityData = allClassAbilities.find((a) => a.id === abilityId)
      const abilityEffects =
        typeof abilityData?.effects === 'string'
          ? JSON.parse(abilityData.effects || '{}')
          : abilityData?.effects || {}
      if (!abilityEffects.repeatable) {
        const alreadyHas = character.classAbilities.find((ca) => ca.classAbilityId === abilityId)
        if (alreadyHas) {
          return response.badRequest({ error: `Habilidade já adquirida` })
        }
      }
    }

    // Add abilities
    let hasTranscender = false
    for (const abilityId of abilityIds) {
      await CharacterClassAbility.create({
        characterId: character.id,
        classAbilityId: abilityId,
      })
      const abilityData = allClassAbilities.find((a) => a.id === abilityId)
      if (abilityData?.name === 'Transcender') hasTranscender = true
    }

    // If Transcender was added, recalculate max sanity
    if (hasTranscender) {
      await this.recalculateSanity(character.id)
    }

    return response.redirect().back()
  }

  async removeAbility({ params, response, auth }: HttpContext) {
    const user = auth.user!
    const character = await Character.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail()

    const ability = await CharacterClassAbility.query()
      .where('characterId', character.id)
      .where('id', params.abilityId)
      .preload('classAbility')
      .firstOrFail()

    // Don't allow removing mandatory abilities
    const effects =
      typeof ability.classAbility?.effects === 'string'
        ? JSON.parse(ability.classAbility.effects || '{}')
        : ability.classAbility?.effects || {}

    if (effects.mandatory === true) {
      return response.badRequest({ error: 'Não é possível remover habilidades obrigatórias' })
    }

    await ability.delete()

    // If Transcender was removed, recalculate max sanity
    if (ability.classAbility?.name === 'Transcender') {
      await this.recalculateSanity(character.id)
    }

    return response.redirect().back()
  }

  private async recalculateSanity(characterId: number) {
    const char = await Character.query()
      .where('id', characterId)
      .preload('class')
      .preload('stats')
      .preload('classAbilities', (q) => q.preload('classAbility'))
      .firstOrFail()

    const classData = char.class
    const nex = char.nex
    const level = Math.floor(nex / 5)

    let maxSanity = classData.baseSanity
    if (level > 1) {
      maxSanity += classData.sanityPerLevel * (level - 1)
    }

    const transcenderCount = char.classAbilities.filter(
      (ca) => ca.classAbility?.name === 'Transcender'
    ).length
    if (transcenderCount > 0) {
      maxSanity -= classData.sanityPerLevel * transcenderCount
    }

    if (char.stats) {
      char.stats.maxSanity = maxSanity
      char.stats.currentSanity = Math.min(char.stats.currentSanity, maxSanity)
      await char.stats.save()
    }
  }

  async destroy({ params, response, auth }: HttpContext) {
    const user = auth.user!
    const character = await Character.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail()

    await character.delete()

    return response.redirect().toPath('/')
  }
}
