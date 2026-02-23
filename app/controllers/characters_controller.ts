import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
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

      // Get all available class abilities (not already acquired)
      const allClassAbilities = await ClassAbility.query().where('classId', character.classId)

      const acquiredAbilityIds = character.classAbilities?.map((ca) => ca.classAbilityId) || []

      const availableAbilities = allClassAbilities.filter((ability) => {
        // Exclude already acquired abilities
        if (acquiredAbilityIds.includes(ability.id)) {
          return false
        }

        // Exclude mandatory abilities (already handled in store)
        const effects =
          typeof ability.effects === 'string'
            ? JSON.parse(ability.effects || '{}')
            : ability.effects || {}

        if (effects.mandatory === true) {
          return false
        }

        // Check if ability is available at current NEX
        if (effects.nex) {
          // Parse NEX requirement (e.g., "15%" -> 15)
          const requiredNex = parseInt(effects.nex)
          if (character.nex < requiredNex) {
            return false
          }
        }

        return true
      })

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

      // Catalogos de itens para o modal "Adicionar Item" (por tipo)
      const [
        weaponsRows,
        protectionsRows,
        generalItemsRows,
        cursedItemsRows,
        ammunitionRows,
        characterWeaponsRows,
        characterProtectionsRows,
        characterGeneralItemsRows,
      ] = await Promise.all([
        db.from('weapons').select('*').orderBy('name', 'asc'),
        db.from('protections').select('*').orderBy('name', 'asc'),
        db.from('general_items').select('*').orderBy('name', 'asc'),
        db.from('cursed_items').select('*').orderBy('name', 'asc'),
        db.from('weapon_modifications').where('type', 'Munição').select('*').orderBy('name', 'asc'), // Munições
        db
          .from('character_weapons')
          .where('character_id', character.id)
          .leftJoin('weapons', 'character_weapons.weapon_id', 'weapons.id')
          .select(
            'character_weapons.*',
            'weapons.name',
            'weapons.type',
            'weapons.damage',
            'weapons.range',
            'weapons.critical',
            'weapons.critical_multiplier',
            'weapons.damage_type',
            'weapons.description',
            'weapons.spaces'
          ),
        db
          .from('character_protections')
          .where('character_id', character.id)
          .leftJoin('protections', 'character_protections.protection_id', 'protections.id')
          .select('character_protections.*', 'protections.name', 'protections.spaces', 'protections.description'),
        db
          .from('character_general_items')
          .where('character_id', character.id)
          .leftJoin('general_items', 'character_general_items.general_item_id', 'general_items.id')
          .select('character_general_items.*', 'general_items.name', 'general_items.spaces', 'general_items.description'),
      ])
      const catalogWeapons = weaponsRows.map((r: any) => ({
        id: r.id,
        name: r.name,
        category: [null, 'I', 'II', 'III', 'IV'][r.category] || '—',
        type: r.type,
        weaponType: r.weapon_type,
        damage: r.damage,
        damageType: r.damage_type,
        critical: r.critical,
        criticalMultiplier: r.critical_multiplier,
        range: r.range,
        ammoCapacity: r.ammo_capacity,
        ammoType: r.ammo_type,
        spaces: r.spaces,
        description: r.description,
        special:
          typeof r.special === 'string' ? (r.special ? JSON.parse(r.special) : null) : r.special,
      }))
      const catalogProtections = protectionsRows.map((r: any) => ({
        id: r.id,
        name: r.name,
        category: r.category,
        type: r.type,
        defenseBonus: r.defense_bonus,
        dodgePenalty: r.dodge_penalty,
        spaces: r.spaces,
        description: r.description,
        special:
          typeof r.special === 'string' ? (r.special ? JSON.parse(r.special) : null) : r.special,
      }))
      const catalogGeneralItems = generalItemsRows.map((r: any) => ({
        id: r.id,
        name: r.name,
        category: r.category,
        type: r.type,
        spaces: r.spaces,
        description: r.description,
        effects:
          typeof r.effects === 'string' ? (r.effects ? JSON.parse(r.effects) : null) : r.effects,
      }))
      const catalogCursedItems = cursedItemsRows.map((r: any) => ({
        id: r.id,
        name: r.name,
        element: r.element,
        itemType: r.item_type,
        spaces: r.spaces,
        description: r.description,
        benefits:
          typeof r.benefits === 'string'
            ? r.benefits
              ? JSON.parse(r.benefits)
              : null
            : r.benefits,
        curses: typeof r.curses === 'string' ? (r.curses ? JSON.parse(r.curses) : null) : r.curses,
      }))

      // Catálogo de munições (tipo especial de modificação de arma)
      const catalogAmmunitions = ammunitionRows.map((r: any) => ({
        id: r.id,
        name: r.name,
        category: r.category,
        type: r.type,
        description: r.description,
        damageBonus: r.damage_bonus,
        damageTypeOverride: r.damage_type_override,
        criticalBonus: r.critical_bonus,
        criticalMultiplierBonus: r.critical_multiplier_bonus,
        weaponTypeRestriction: r.weapon_type_restriction,
      }))

      // Itens do inventário do personagem (armas)
      const inventoryWeapons = characterWeaponsRows.map((r: any) => ({
        id: r.id, // Usar o ID da tabela pivot (character_weapons.id)
        weaponId: r.weapon_id,
        name: r.name,
        type: 'Weapon',
        damage: r.damage,
        range: r.range,
        critical: r.critical,
        criticalMultiplier: r.critical_multiplier,
        damageType: r.damage_type,
        description: r.description,
        equipped: r.is_equipped,
        quantity: 1,
        spaces: r.spaces || 0,
      }))

      const inventoryProtections = characterProtectionsRows.map((r: any) => ({
        id: r.id,
        protectionId: r.protection_id,
        name: r.name,
        type: 'Protection',
        description: r.description,
        equipped: r.is_equipped,
        quantity: 1,
        spaces: r.spaces || 0,
      }))

      const inventoryGeneralItems = characterGeneralItemsRows.map((r: any) => ({
        id: r.id,
        generalItemId: r.general_item_id,
        name: r.name,
        type: 'General',
        description: r.description,
        quantity: r.quantity || 1,
        spaces: r.spaces || 0,
      }))

      return inertia.render('characters/show', {
        character,
        classes,
        origins,
        classTrails,
        availableAbilities,
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
        catalogWeapons,
        catalogProtections,
        catalogGeneralItems,
        catalogCursedItems,
        catalogAmmunitions,
        inventoryWeapons,
        inventoryProtections,
        inventoryGeneralItems,
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

    // Store old classId to detect if class changed
    const oldClassId = character.classId

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

    // If class changed, reset chosen abilities and update mandatory ones
    if (classId && classId !== oldClassId) {
      // Delete all chosen abilities (non-mandatory) from old class
      const oldAbilities = await CharacterClassAbility.query()
        .where('characterId', character.id)
        .preload('classAbility')

      for (const charAbility of oldAbilities) {
        const effects =
          typeof charAbility.classAbility.effects === 'string'
            ? JSON.parse(charAbility.classAbility.effects || '{}')
            : charAbility.classAbility.effects || {}

        // Delete if it's not mandatory (chosen ability) or if it belongs to old class
        if (effects.mandatory !== true || charAbility.classAbility.classId === oldClassId) {
          await charAbility.delete()
        }
      }

      // Add mandatory abilities from new class
      const newClassAbilities = await ClassAbility.query().where('classId', classId)

      for (const ability of newClassAbilities) {
        const effects =
          typeof ability.effects === 'string'
            ? JSON.parse(ability.effects || '{}')
            : ability.effects || {}

        if (effects.mandatory === true) {
          // Check if it already exists to avoid duplicates
          const exists = await CharacterClassAbility.query()
            .where('characterId', character.id)
            .where('classAbilityId', ability.id)
            .first()

          if (!exists) {
            await CharacterClassAbility.create({
              characterId: character.id,
              classAbilityId: ability.id,
            })
          }
        }
      }
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

  async addAbility({ params, request, response, auth }: HttpContext) {
    const user = auth.user!
    const { abilityId } = request.only(['abilityId'])

    const character = await Character.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail()

    // Fetch the ability
    const ability = await ClassAbility.findOrFail(abilityId)

    // Validate ability belongs to character's class
    if (ability.classId !== character.classId) {
      return response.status(400).send({ error: 'Habilidade não pertence à classe do personagem' })
    }

    // Check if ability is already acquired
    const existing = await CharacterClassAbility.query()
      .where('characterId', character.id)
      .where('classAbilityId', ability.id)
      .first()

    if (existing) {
      return response.status(400).send({ error: 'Habilidade já foi adquirida' })
    }

    // Check NEX requirement
    const effects =
      typeof ability.effects === 'string'
        ? JSON.parse(ability.effects || '{}')
        : ability.effects || {}

    if (effects.nex) {
      const requiredNex = parseInt(effects.nex)
      if (character.nex < requiredNex) {
        return response.status(400).send({ error: `Requer NEX ${effects.nex}` })
      }
    }

    // Add ability
    await CharacterClassAbility.create({
      characterId: character.id,
      classAbilityId: ability.id,
    })

    return response.redirect().back()
  }

  async removeAbility({ params, response, auth }: HttpContext) {
    const user = auth.user!
    const { abilityId } = params

    const character = await Character.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail()

    // Find and delete the ability
    const characterAbility = await CharacterClassAbility.query()
      .where('characterId', character.id)
      .where('classAbilityId', abilityId)
      .firstOrFail()

    await characterAbility.delete()

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

  async addItem({ params, request, response, auth }: HttpContext) {
    const user = auth.user!
    const character = await Character.query()
      .where('id', params.id)
      .where('userId', user.id)
      .preload('attributes')
      .preload('stats')
      .preload('class')
      .preload('origin')
      .preload('trail')
      .preload('skills', (query) => query.preload('skill'))
      .preload('classAbilities', (query) => query.preload('classAbility'))
      .firstOrFail()

    const { type, itemId, quantity } = request.only(['type', 'itemId', 'quantity'])
    if (!type || !itemId) {
      return response.badRequest({ error: 'type e itemId são obrigatórios' })
    }

    const qty = Math.max(1, parseInt(quantity, 10) || 1)

    // CÁLCULO DE CAPACIDADE (BACKEND)
    const strength = character.attributes?.strength || 0
    const intellect = character.attributes?.intellect || 0

    const hasInventarioOtimizado =
      character.trail?.name === 'Técnico' && (character as any).nex >= 10
    const hasInventarioOrganizado = character.classAbilities?.some(
      (a) => a.classAbility?.name === 'Inventário Organizado'
    )

    let baseStrengthForCapacity = strength
    if (hasInventarioOtimizado) baseStrengthForCapacity += intellect

    let limit = baseStrengthForCapacity > 0 ? baseStrengthForCapacity * 5 : 2
    if (hasInventarioOrganizado) limit += intellect

    const maxCapacity = limit * 2

    // Calcular espaços atuais usados
    const [weaponsUsed, protectionsUsed, generalItemsUsed] = await Promise.all([
      db
        .from('character_weapons')
        .where('character_id', character.id)
        .leftJoin('weapons', 'character_weapons.weapon_id', 'weapons.id')
        .sum('weapons.spaces as total'),
      db
        .from('character_protections')
        .where('character_id', character.id)
        .leftJoin('protections', 'character_protections.protection_id', 'protections.id')
        .sum('protections.spaces as total'),
      db
        .from('character_general_items')
        .where('character_id', character.id)
        .leftJoin('general_items', 'character_general_items.general_item_id', 'general_items.id')
        .select(db.raw('sum(general_items.spaces * character_general_items.quantity) as total')),
    ])

    const totalUsed =
      Number(weaponsUsed[0]?.total || 0) +
      Number(protectionsUsed[0]?.total || 0) +
      Number(generalItemsUsed[0]?.total || 0)

    if (type === 'weapon') {
      const weapon = await db.from('weapons').where('id', itemId).first()
      if (!weapon) return response.notFound({ error: 'Arma não encontrada' })

      if (totalUsed + (weapon.spaces || 0) > maxCapacity) {
        return response.badRequest({
          error: `Limite de carga atingido! Máximo permitido: ${maxCapacity} espaços.`,
        })
      }

      const now = new Date().toISOString()
      await db.table('character_weapons').insert({
        character_id: character.id,
        weapon_id: itemId,
        is_equipped: false,
        created_at: now,
        updated_at: now,
      })
    } else if (type === 'protection') {
      const protection = await db.from('protections').where('id', itemId).first()
      if (!protection) return response.notFound({ error: 'Proteção não encontrada' })

      if (totalUsed + (protection.spaces || 0) > maxCapacity) {
        return response.badRequest({
          error: `Limite de carga atingido! Máximo permitido: ${maxCapacity} espaços.`,
        })
      }

      await db.table('character_protections').insert({
        character_id: character.id,
        protection_id: itemId,
        is_equipped: false,
      })
    } else if (type === 'general') {
      const item = await db.from('general_items').where('id', itemId).first()
      if (!item) return response.notFound({ error: 'Item não encontrado' })

      const itemTotalSpaces = (item.spaces || 0) * qty
      if (totalUsed + itemTotalSpaces > maxCapacity) {
        return response.badRequest({
          error: `Limite de carga atingido! Máximo permitido: ${maxCapacity} espaços.`,
        })
      }

      await db.table('character_general_items').insert({
        character_id: character.id,
        general_item_id: itemId,
        quantity: qty,
      })
    } else if (type === 'cursed') {
      const item = await db.from('cursed_items').where('id', itemId).first()
      if (!item) return response.notFound({ error: 'Item amaldiçoado não encontrado' })

      const itemTotalSpaces = (item.spaces || 0) * qty
      if (totalUsed + itemTotalSpaces > maxCapacity) {
        return response.badRequest({
          error: `Limite de carga atingido! Máximo permitido: ${maxCapacity} espaços.`,
        })
      }

      await db.table('character_cursed_items').insert({
        character_id: character.id,
        cursed_item_id: itemId,
        quantity: qty,
      })
    } else if (type === 'ammunition') {
      const item = await db.from('weapon_modifications').where('id', itemId).first()
      if (!item) return response.notFound({ error: 'Munição não encontrada' })

      const itemTotalSpaces = (item.spaces || 0) * qty
      if (totalUsed + itemTotalSpaces > maxCapacity) {
        return response.badRequest({
          error: `Limite de carga atingido! Máximo permitido: ${maxCapacity} espaços.`,
        })
      }

      await db.table('character_general_items').insert({
        character_id: character.id,
        general_item_id: itemId,
        quantity: qty,
      })
    } else {
      return response.badRequest({
        error: 'Tipo de item inválido. Use: weapon, protection, general, cursed, ammunition',
      })
    }

    // Recarregar personagem com dados atualizados e redirecionar de volta
    // Isso garante que a lógica do método show() seja executada, mantendo a consistência dos dados
    await character.refresh()
    return response.redirect().back()
  }

  async removeItem({ params, response, auth }: HttpContext) {
    const user = auth.user!
    const character = await Character.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail()

    const itemId = params.itemId
    console.log(`[removeItem] Tentando remover item ${itemId} do personagem ${character.id}`)

    // Tenta remover de cada tabela possível
    let removed = false

    try {
      // Verifica em character_weapons
      const weapon = await db
        .from('character_weapons')
        .where('id', itemId)
        .where('character_id', character.id)
        .first()
      console.log('[removeItem] weapon:', weapon)
      if (weapon) {
        await db
          .from('character_weapons')
          .where('id', itemId)
          .where('character_id', character.id)
          .delete()
        console.log('[removeItem] Arma removida com sucesso')
        removed = true
      }
    } catch (error: any) {
      console.error('[removeItem] Erro ao verificar character_weapons:', error.message)
    }

    // Verifica em character_protections
    if (!removed) {
      try {
        const protection = await db
          .from('character_protections')
          .where('id', itemId)
          .where('character_id', character.id)
          .first()
        console.log('[removeItem] protection:', protection)
        if (protection) {
          await db
            .from('character_protections')
            .where('id', itemId)
            .where('character_id', character.id)
            .delete()
          console.log('[removeItem] Proteção removida com sucesso')
          removed = true
        }
      } catch (error: any) {
        console.error('[removeItem] Erro ao verificar character_protections:', error.message)
      }
    }

    // Verifica em character_general_items
    if (!removed) {
      try {
        const generalItem = await db
          .from('character_general_items')
          .where('id', itemId)
          .where('character_id', character.id)
          .first()
        console.log('[removeItem] generalItem:', generalItem)
        if (generalItem) {
          await db
            .from('character_general_items')
            .where('id', itemId)
            .where('character_id', character.id)
            .delete()
          console.log('[removeItem] Item geral removido com sucesso')
          removed = true
        }
      } catch (error: any) {
        console.error('[removeItem] Erro ao verificar character_general_items:', error.message)
      }
    }

    if (!removed) {
      console.error('[removeItem] Item não encontrado em nenhuma tabela')
      return response.notFound({ error: 'Item não encontrado' })
    }

    return response.ok({ success: true })
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
