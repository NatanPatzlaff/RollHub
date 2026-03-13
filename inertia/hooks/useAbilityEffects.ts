import { useMemo } from 'react'

export interface AbilityEffectsResult {
  defenseBonus: number
  hpBonusPerNex: number
  peBonusFlat: number
  movementBonus: number
  damageReductionMental: string | null // ex: 'intellect'
  immunePoison: boolean
  immuneCritical: boolean
  skillBonusByAttr: { [attr: string]: number } // ex: { INT: 5 }
  flatSkillBonuses: { [skill: string]: number }
  peBonusPerNex: number
  immuneDisease: boolean
  threatRangeBonus: number
}

export function useAbilityEffects({
  classAbilities = [],
  paranormalPowers = [],
  originAbilities = [],
  trailProgressions = [],
}: {
  classAbilities?: any[]
  paranormalPowers?: any[]
  originAbilities?: any[]
  trailProgressions?: any[]
}): AbilityEffectsResult {
  return useMemo(() => {
    const result: AbilityEffectsResult = {
      defenseBonus: 0,
      hpBonusPerNex: 0,
      peBonusFlat: 0,
      movementBonus: 0,
      damageReductionMental: null,
      immunePoison: false,
      immuneCritical: false,
      skillBonusByAttr: {},
      flatSkillBonuses: {},
      peBonusPerNex: 0,
      immuneDisease: false,
      threatRangeBonus: 0,
    }

    // Helper para processar um effects JSON
    const applyEffects = (effects: any) => {
      if (!effects || typeof effects !== 'object') return

      if (effects.defense_bonus) result.defenseBonus += effects.defense_bonus
      if (effects.movement_bonus) result.movementBonus += effects.movement_bonus
      if (effects.hp_per_nex) result.hpBonusPerNex += effects.hp_per_nex
      if (effects.pe_bonus) result.peBonusFlat += effects.pe_bonus
      if (effects.fortitude_bonus) {
        result.flatSkillBonuses['Fortitude'] = (result.flatSkillBonuses['Fortitude'] || 0) + effects.fortitude_bonus
      }
      if (effects.will_bonus) {
        result.flatSkillBonuses['Vontade'] = (result.flatSkillBonuses['Vontade'] || 0) + effects.will_bonus
      }
      if (effects.damage_reduction_mental) result.damageReductionMental = effects.damage_reduction_mental
      if (effects.immune_poison) result.immunePoison = true
      if (effects.immune_critical) result.immuneCritical = true
      if (effects.skill_bonus_attr && effects.bonus) {
        const attr = effects.skill_bonus_attr
        result.skillBonusByAttr[attr] = (result.skillBonusByAttr[attr] || 0) + effects.bonus
      }
      if (effects.flat_skill_bonuses && typeof effects.flat_skill_bonuses === 'object') {
        Object.entries(effects.flat_skill_bonuses).forEach(([skill, bonus]) => {
          result.flatSkillBonuses[skill] = (result.flatSkillBonuses[skill] || 0) + (bonus as number)
        })
      }
      if (effects.pe_bonus_per_nex) result.peBonusPerNex = (result.peBonusPerNex || 0) + effects.pe_bonus_per_nex
      if (effects.immune_disease) result.immuneDisease = true
      if (effects.threat_range_bonus) result.threatRangeBonus = (result.threatRangeBonus || 0) + effects.threat_range_bonus
    }

    // 1. Habilidades de Classe (pivot: ca.classAbility.effects)
    classAbilities.forEach((ca: any) => {
      const effects = ca.classAbility?.effects
      // Só aplica passivas (sem pe_cost ou com passive: true)
      if (!effects?.pe_cost || effects?.passive) applyEffects(effects)
    })

    // 2. Poderes Paranormais (pivot: pp.paranormalPower.effects)
    paranormalPowers.forEach((pp: any) => {
      applyEffects(pp.paranormalPower?.effects)
    })

    // 3. Habilidades de Origem (lista plana, só passivas: sem pe_cost)
    originAbilities.forEach((ability: any) => {
      const effects = ability.effects
      if (!effects?.pe_cost || effects?.passive) applyEffects(effects)
    })

    // 4. Trilhas (lista plana, só PASSIVE)
    trailProgressions.forEach((trail: any) => {
      if (trail.type === 'PASSIVE') applyEffects(trail.effects)
    })

    return result
  }, [classAbilities, paranormalPowers, originAbilities, trailProgressions])
}
