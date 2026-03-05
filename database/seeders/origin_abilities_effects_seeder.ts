import { BaseSeeder } from '@adonisjs/lucid/seeders'
import OriginAbility from '#models/origin_ability'

/**
 * Popula os campos mecânicos (type, peCost, castTime, duration, range, target, effects)
 * para todas as habilidades de origem do Ordem Paranormal RPG.
 *
 * O campo `effects` segue este schema:
 * {
 *   pe_cost?: number
 *   duration?: 'instant' | 'next_test' | 'next_attack' | 'scene' | 'passive'
 *   uses_per_scene?: number | 'unlimited'
 *   uses_per_session?: number
 *   uses_per_mission?: number
 *   uses_per_round?: number
 *   bonus?: number                      // bônus genérico no teste
 *   attack_bonus?: number               // bônus no teste de ataque
 *   damage_bonus?: number               // bônus nas rolagens de dano
 *   critical_bonus?: number             // redução na margem de ameaça (é positivo = melhora)
 *   skill_bonus_target?: string | string[] // nome(s) da(s) perícia(s) que recebem o bônus
 *   skill_bonus_attr?: string | string[]   // atributo(s) base cujas perícias recebem o bônus
 *   weapon_type?: 'melee' | 'ranged' | 'all'
 *   exclude_skills?: string[]
 *   skill_substitute?: string           // usa esta perícia no lugar de outra
 *   trained_any_skill?: boolean
 *   extra_move_action?: boolean
 *   passive?: boolean
 *   scaling_cost?: boolean              // custo aumenta +1 PE a cada uso na cena
 *   effect_label?: string               // rótulo legível para exibição da ficha
 * }
 */
export default class extends BaseSeeder {
  async run() {
    const abilities: Array<{
      name: string
      type: string
      peCost: string | null
      castTime: string | null
      duration: string | null
      range: string | null
      target: string | null
      effects: Record<string, any>
    }> = [
      // ─── ATIVAS (exigem ação e custam PE) ───────────────────────────────────
      {
        name: 'Saber é Poder',
        type: 'ativa',
        peCost: '2 PE',
        castTime: 'Ação padrão',
        duration: 'Próximo teste',
        range: 'Pessoal',
        target: 'Você',
        effects: {
          pe_cost: 2,
          duration: 'next_test',
          bonus: 5,
          skill_bonus_attr: 'INT',
          effect_label: '+5 em testes de Intelecto',
        },
      },
      {
        name: '110%',
        type: 'ativa',
        peCost: '2 PE',
        castTime: 'Ação padrão',
        duration: 'Próximo teste',
        range: 'Pessoal',
        target: 'Você',
        effects: {
          pe_cost: 2,
          duration: 'next_test',
          bonus: 5,
          skill_bonus_attr: ['FOR', 'AGI'],
          exclude_skills: ['Luta', 'Pontaria'],
          effect_label: '+5 em testes de FOR ou AGI (exceto Luta e Pontaria)',
        },
      },
      {
        name: 'Vislumbres do Passado',
        type: 'ativa',
        peCost: null,
        castTime: 'Ação padrão',
        duration: 'Instantâneo',
        range: 'Pessoal',
        target: 'Você',
        effects: {
          pe_cost: 0,
          duration: 'instant',
          uses_per_session: 1,
          test_required: { skill: 'Intelecto', dt: 10 },
          reward: { temp_pe_dice: '1d4' },
          effect_label: 'Teste de Intelecto (DT 10) → 1d4 PE temporários',
        },
      },
      {
        name: 'Magnum Opus',
        type: 'ativa',
        peCost: null,
        castTime: 'Ação livre',
        duration: 'Cena',
        range: 'Pessoal',
        target: '1 personagem',
        effects: {
          pe_cost: 0,
          duration: 'scene',
          uses_per_mission: 1,
          bonus: 5,
          skill_bonus_attr: 'PRE',
          condition: 'target_recognizes_you',
          effect_label: '+5 em testes de Presença contra quem o reconhece',
        },
      },
      {
        name: 'Investigação Científica',
        type: 'livre',
        peCost: null,
        castTime: 'Ação livre',
        duration: 'Instantâneo',
        range: 'Pessoal',
        target: 'Você',
        effects: {
          pe_cost: 0,
          duration: 'instant',
          uses_per_scene: 1,
          skill_substitute: 'Ciências',
          condition: 'investigation_scene',
          effect_label: 'Usa Ciências em lugar de qualquer perícia de investigação',
        },
      },
      {
        name: 'Bagagem de Leitura',
        type: 'livre',
        peCost: '2 PE',
        castTime: 'Ação livre',
        duration: 'Fim da cena',
        range: 'Pessoal',
        target: 'Você',
        effects: {
          pe_cost: 2,
          duration: 'scene',
          trained_any_skill: true,
          effect_label: 'Fica treinado em qualquer perícia até o fim da cena',
        },
      },
      {
        name: 'Processo Otimizado',
        type: 'ativa',
        peCost: '2 PE',
        castTime: 'Ação padrão',
        duration: 'Próximo teste',
        range: 'Pessoal',
        target: 'Você',
        effects: {
          pe_cost: 2,
          duration: 'next_test',
          bonus: 5,
          condition: 'extended_test_or_document',
          effect_label: '+5 em testes estendidos ou para revisar documentos',
        },
      },
      {
        name: 'Faro para Pistas',
        type: 'ativa',
        peCost: '1 PE',
        castTime: 'Ação padrão',
        duration: 'Próximo teste',
        range: 'Pessoal',
        target: 'Você',
        effects: {
          pe_cost: 1,
          duration: 'next_test',
          uses_per_scene: 1,
          bonus: 5,
          skill_bonus_target: 'Investigação',
          effect_label: '+5 no próximo teste de Investigação',
        },
      },
      {
        name: 'Fontes Confiáveis',
        type: 'ativa',
        peCost: '1 PE',
        castTime: 'Ação padrão',
        duration: 'Próximo teste',
        range: 'Pessoal',
        target: 'Você',
        effects: {
          pe_cost: 1,
          duration: 'next_test',
          uses_per_session: 1,
          reroll: true,
          bonus: 5,
          skill_bonus_target: 'Investigação',
          effect_label: 'Rerolagem +5 em teste de Investigação para pistas',
        },
      },
      {
        name: 'Posição de Combate',
        type: 'ativa',
        peCost: '2 PE',
        castTime: 'Reação',
        duration: 'Instantâneo',
        range: 'Pessoal',
        target: 'Você',
        effects: {
          pe_cost: 2,
          duration: 'instant',
          extra_move_action: true,
          condition: 'first_turn',
          effect_label: 'Ação de movimento adicional no primeiro turno',
        },
      },
      {
        name: 'Aula de Campo',
        type: 'ativa',
        peCost: '2 PE',
        castTime: 'Ação padrão',
        duration: 'Fim da cena',
        range: 'Curto',
        target: '1 aliado',
        effects: {
          pe_cost: 2,
          duration: 'scene',
          target_ally: true,
          attribute_bonus: 1,
          effect_label: '+1 em um atributo de um aliado até o fim da cena',
        },
      },
      {
        name: 'Espírito Cívico',
        type: 'ativa',
        peCost: '1 PE',
        castTime: 'Reação',
        duration: 'Instantâneo',
        range: 'Pessoal',
        target: 'Você',
        effects: {
          pe_cost: 1,
          duration: 'instant',
          bonus: 2,
          condition: 'help_test',
          effect_label: '+2 em testes de ajudar',
        },
      },
      {
        name: 'Motor de Busca',
        type: 'ativa',
        peCost: '2 PE',
        castTime: 'Ação padrão',
        duration: 'Próximo teste',
        range: 'Pessoal',
        target: 'Você',
        effects: {
          pe_cost: 2,
          duration: 'next_test',
          skill_substitute: 'Tecnologia',
          condition: 'has_internet',
          effect_label: 'Usa Tecnologia em lugar de qualquer perícia',
        },
      },
      {
        name: 'Desbravador',
        type: 'ativa',
        peCost: '2 PE',
        castTime: 'Ação padrão',
        duration: 'Próximo teste',
        range: 'Pessoal',
        target: 'Você',
        effects: {
          pe_cost: 2,
          duration: 'next_test',
          bonus: 5,
          skill_bonus_target: ['Adestramento', 'Sobrevivência'],
          effect_label: '+5 em testes de Adestramento ou Sobrevivência',
        },
      },
      {
        name: 'Impostor',
        type: 'ativa',
        peCost: '2 PE',
        castTime: 'Ação livre',
        duration: 'Próximo teste',
        range: 'Pessoal',
        target: 'Você',
        effects: {
          pe_cost: 2,
          duration: 'next_test',
          skill_substitute: 'Enganação',
          effect_label: 'Usa Enganação em lugar de qualquer perícia',
        },
      },
      {
        name: 'Acostumado ao Extremo',
        type: 'reação',
        peCost: '1 PE',
        castTime: 'Reação',
        duration: 'Instantâneo',
        range: 'Pessoal',
        target: 'Você',
        effects: {
          pe_cost: 1,
          duration: 'instant',
          damage_reduction: 5,
          damage_types: ['fogo', 'frio', 'mental'],
          scaling_cost: true,
          effect_label: 'Reduz dano de fogo, frio ou mental em 5',
        },
      },

      // ─── REAÇÕES ────────────────────────────────────────────────────────────
      {
        name: 'Fraternidade Gaudéria',
        type: 'reação',
        peCost: '1 PE',
        castTime: 'Reação',
        duration: 'Instantâneo',
        range: 'Pessoal',
        target: '1 aliado',
        effects: {
          pe_cost: 1,
          duration: 'instant',
          swap_with_ally: true,
          then_attack_bonus: 2,
          effect_label: 'Troca de lugar com aliado; +2 contra o agressor',
        },
      },

      // ─── PASSIVAS ────────────────────────────────────────────────────────────
      {
        name: 'Técnica Medicinal',
        type: 'passiva',
        peCost: null,
        castTime: null,
        duration: 'Permanente',
        range: null,
        target: null,
        effects: { passive: true, heal_bonus: 'intellect', effect_label: '+Intelecto em curas' },
      },
      {
        name: 'Calejado',
        type: 'passiva',
        peCost: null,
        castTime: null,
        duration: 'Permanente',
        range: null,
        target: null,
        effects: { passive: true, hp_per_nex: 1, effect_label: '+1 PV por 5% de NEX' },
      },
      {
        name: 'Destemido',
        type: 'passiva',
        peCost: null,
        castTime: null,
        duration: 'Permanente',
        range: null,
        target: null,
        effects: {
          passive: true,
          bonus: 5,
          condition: 'fail_has_consequence',
          effect_label: '+5 quando falha pode resultar em dano/condição',
        },
      },
      {
        name: 'Ferramentas Favoritas',
        type: 'passiva',
        peCost: null,
        castTime: null,
        duration: 'Permanente',
        range: null,
        target: null,
        effects: {
          passive: true,
          item_category_reduction: 1,
          condition: 'not_weapon',
          effect_label: '1 item (não-arma) conta como 1 categoria abaixo',
        },
      },
      {
        name: 'Mobilidade Acrobática',
        type: 'passiva',
        peCost: null,
        castTime: null,
        duration: 'Permanente',
        range: null,
        target: null,
        effects: {
          passive: true,
          defense_bonus: 2,
          movement_bonus: 3,
          effect_label: '+2 Defesa, +3m de deslocamento',
        },
      },
      {
        name: 'Mão Pesada',
        type: 'passiva',
        peCost: null,
        castTime: null,
        duration: 'Permanente',
        range: null,
        target: null,
        effects: {
          passive: true,
          damage_bonus: 2,
          weapon_type: 'melee',
          effect_label: '+2 dano corpo a corpo',
        },
      },
      {
        name: 'Para Bellum',
        type: 'passiva',
        peCost: null,
        castTime: null,
        duration: 'Permanente',
        range: null,
        target: null,
        effects: {
          passive: true,
          damage_bonus: 2,
          weapon_type: 'ranged',
          effect_label: '+2 dano com armas de fogo',
        },
      },
      {
        name: 'Ferramenta de Trabalho',
        type: 'passiva',
        peCost: null,
        castTime: null,
        duration: 'Permanente',
        range: null,
        target: null,
        effects: {
          passive: true,
          attack_bonus: 1,
          damage_bonus: 1,
          critical_bonus: 1,
          condition: 'specific_weapon',
          effect_label: '+1 ataque/dano/margem em 1 arma escolhida',
        },
      },
      {
        name: 'Patrulha',
        type: 'passiva',
        peCost: null,
        castTime: null,
        duration: 'Permanente',
        range: null,
        target: null,
        effects: { passive: true, defense_bonus: 2, effect_label: '+2 Defesa' },
      },
      {
        name: 'Antes Só',
        type: 'passiva',
        peCost: null,
        castTime: null,
        duration: 'Permanente',
        range: null,
        target: null,
        effects: {
          passive: true,
          defense_bonus: 1,
          skill_bonus: 1,
          pe_limit_bonus: 1,
          condition: 'no_ally_nearby',
          effect_label: '+1 Defesa/perícias/limite PE sem aliados próximos',
        },
      },
      {
        name: 'Eu Já Sabia',
        type: 'passiva',
        peCost: null,
        castTime: null,
        duration: 'Permanente',
        range: null,
        target: null,
        effects: {
          passive: true,
          damage_reduction_mental: 'intellect',
          effect_label: 'RD mental = Intelecto',
        },
      },
      {
        name: 'Dedicação',
        type: 'passiva',
        peCost: null,
        castTime: null,
        duration: 'Permanente',
        range: null,
        target: null,
        effects: { passive: true, pe_bonus: 1, pe_limit_bonus_scaling: true, effect_label: '+1 PE base, +1 limite PE por NEX ímpar' },
      },
      {
        name: 'Cicatrizes Psicológicas',
        type: 'passiva',
        peCost: null,
        castTime: null,
        duration: 'Permanente',
        range: null,
        target: null,
        effects: { passive: true, san_per_nex: 1, effect_label: '+1 SAN por 5% de NEX' },
      },
      {
        name: 'Companheiro Animal',
        type: 'passiva',
        peCost: null,
        castTime: null,
        duration: 'Permanente',
        range: null,
        target: null,
        effects: { passive: true, companion: true, effect_label: 'Parceiro animal' },
      },
      {
        name: 'Traços do Outro Lado',
        type: 'passiva',
        peCost: null,
        castTime: null,
        duration: 'Permanente',
        range: null,
        target: null,
        effects: { passive: true, paranormal_power: true, effect_label: '+1 poder paranormal (−50% SAN)' },
      },
      {
        name: 'Patrocinador da Ordem',
        type: 'passiva',
        peCost: null,
        castTime: null,
        duration: 'Permanente',
        range: null,
        target: null,
        effects: { passive: true, credit_limit_bonus: 1, effect_label: 'Limite de crédito +1' },
      },
      {
        name: 'Acalentar',
        type: 'passiva',
        peCost: null,
        castTime: null,
        duration: 'Permanente',
        range: null,
        target: null,
        effects: {
          passive: true,
          skill_bonus_target: 'Religião',
          bonus: 5,
          condition: 'acalmar',
          heal_san: true,
          effect_label: '+5 Religião para acalmar; cura SAN = 1d6 + Presença',
        },
      },
      {
        name: 'O Crime Compensa',
        type: 'passiva',
        peCost: null,
        castTime: null,
        duration: 'Permanente',
        range: null,
        target: null,
        effects: {
          passive: true,
          extra_item_slot: true,
          condition: 'end_of_mission',
          effect_label: '+1 item de missão sem custo de limite',
        },
      },
      {
        name: 'Ingrediente Secreto',
        type: 'passiva',
        peCost: null,
        castTime: null,
        duration: 'Permanente',
        range: null,
        target: null,
        effects: {
          passive: true,
          extra_interludio_meal: true,
          effect_label: '2 benefícios de refeição no interlúdio',
        },
      },
      {
        name: 'Fome do Outro Lado',
        type: 'passiva',
        peCost: null,
        castTime: null,
        duration: 'Permanente',
        range: null,
        target: null,
        effects: { passive: true, paranormal_cooking: true, effect_label: 'Cozinha criaturas paranormais' },
      },
      {
        name: 'Acostumado ao Extremo',
        type: 'reação',
        peCost: '1 PE',
        castTime: 'Reação',
        duration: 'Instantâneo',
        range: 'Pessoal',
        target: 'Você',
        effects: {
          pe_cost: 1,
          duration: 'instant',
          damage_reduction: 5,
          damage_types: ['fogo', 'frio', 'mental'],
          scaling_cost: true,
          effect_label: 'Reduz dano de fogo, frio ou mental em 5 (custo +1 PE por uso na cena)',
        },
      },
    ]

    let updated = 0
    for (const ability of abilities) {
      const record = await OriginAbility.findBy('name', ability.name)
      if (!record) continue
      record.type = ability.type
      record.peCost = ability.peCost
      record.castTime = ability.castTime
      record.duration = ability.duration
      record.range = ability.range
      record.target = ability.target
      record.effects = ability.effects
      await record.save()
      updated++
    }

    console.log(`✓ Atualizadas ${updated} habilidades de origem com effects.`)
  }
}
