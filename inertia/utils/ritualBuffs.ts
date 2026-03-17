/**
 * Mapa de rituais que aplicam buffs automáticos em stats visíveis na ficha.
 *
 * Cada entrada mapeia o nome normalizado (lowercase) do ritual para um objeto
 * com as versões (base / discente / verdadeiro) e seus respectivos efeitos.
 *
 * Campos possíveis em cada efeito:
 *   defenseBonus       – bônus direto na Defesa
 *   dodgeBonus         – bônus direto na Esquiva
 *   tempHp             – PV temporários (dado: ex "3d6")
 *   healDice           – cura de PV (dado: ex "3d8+3")
 *   strBonus / agiBonus / intBonus / preBonus / vigBonus – bônus em atributo
 *   selfOnly           – true se o alvo é sempre "pessoal / você"
 *   label              – rótulo curto para exibição
 */

/** Tipo de um efeito de buff de ritual */
export interface RitualBuffEffect {
  defenseBonus?: number
  dodgeBonus?: number
  tempHp?: string // dado, ex: "3d6"
  tempHpFlat?: number // valor fixo de PV temporários
  healDice?: string // dado de cura, ex: "3d8+3"
  strBonus?: number
  agiBonus?: number
  intBonus?: number
  preBonus?: number
  vigBonus?: number
  /** Se true, se aplica SOMENTE em si mesmo (não mostra modal de escolha) */
  selfOnly?: boolean
  /** Rótulo curto para exibição nos buffs ativos */
  label: string
  /** Escolha de atributo necessária: ex. ["str","agi"] para Aprimorar Físico */
  attributeChoice?: ('str' | 'agi' | 'int' | 'pre')[]

  // ── Efeitos em armas ────────────────────────────────────────────────────────
  weaponAttackBonus?: number
  weaponDamageBonus?: number
  weaponThreatRangeBonus?: number
  weaponCritMultiplierBonus?: number
  /** Dados extras de dano: ex "1d6", "2d6", "4d6", "3d8+3", "4d8" */
  weaponExtraDamageDice?: string
  /** Elemento do dano extra: ex "Conhecimento", "Energia", "Morte", "Sangue" */
  weaponDamageElement?: string
  /** Tipo de arma afetada */
  weaponType?: 'melee' | 'all'
  /** Duração do buff de arma */
  weaponDuration?: 'scene' | 'sustained' | 'next_attack'
  /** Se true, cura PV igual a metade do dano total causado */
  healHalfDamage?: boolean
  /** Fator de cura por dano: 0.5 = metade, 1.0 = total */
  healByDamageFactor?: number
}

export interface RitualBuffEntry {
  base?: RitualBuffEffect
  discente?: RitualBuffEffect
  verdadeiro?: RitualBuffEffect
}

/**
 * Rola uma expressão de dados simples como "3d8+3" e retorna o total.
 */
export function rollDiceExpression(expr: string): { total: number; rolls: number[] } {
  const m = expr.match(/^(\d+)d(\d+)(?:([+-])(\d+))?$/)
  if (!m) return { total: 0, rolls: [] }
  const count = parseInt(m[1])
  const sides = parseInt(m[2])
  const mod = m[3] ? (m[3] === '+' ? parseInt(m[4]) : -parseInt(m[4])) : 0
  const rolls: number[] = []
  for (let i = 0; i < count; i++) rolls.push(Math.ceil(Math.random() * sides))
  const total = rolls.reduce((a, b) => a + b, 0) + mod
  return { total, rolls }
}

/** Mapa principal de rituais com buffs */
export const RITUAL_BUFFS: Record<string, RitualBuffEntry> = {
  'armadura de sangue': {
    base: {
      defenseBonus: 5,
      selfOnly: true,
      label: 'Armadura de Sangue',
    },
    discente: {
      defenseBonus: 10,
      selfOnly: true,
      label: 'Armadura de Sangue (D)',
    },
    verdadeiro: {
      defenseBonus: 15,
      selfOnly: true,
      label: 'Armadura de Sangue (V)',
    },
  },

  'embaralhar': {
    base: {
      defenseBonus: 6,
      selfOnly: true,
      label: 'Embaralhar',
    },
    discente: {
      defenseBonus: 10,
      selfOnly: true,
      label: 'Embaralhar (D)',
    },
    verdadeiro: {
      defenseBonus: 16,
      selfOnly: true,
      label: 'Embaralhar (V)',
    },
  },

  'fortalecimento sensorial': {
    base: {
      selfOnly: true,
      label: 'Fortalecimento Sensorial',
      // +1d20 em Investigação, Luta, Percepção, Pontaria — não altera stats visíveis diretamente
    },
    verdadeiro: {
      defenseBonus: 10,
      dodgeBonus: 10,
      selfOnly: true,
      label: 'Fortalecimento Sensorial (V)',
    },
  },

  'aprimorar físico': {
    base: {
      attributeChoice: ['str', 'agi'],
      selfOnly: false,
      label: 'Aprimorar Físico',
      // +1 ao atributo escolhido — definido no modal
    },
    discente: {
      attributeChoice: ['str', 'agi'],
      selfOnly: false,
      label: 'Aprimorar Físico (D)',
    },
    verdadeiro: {
      attributeChoice: ['str', 'agi'],
      selfOnly: false,
      label: 'Aprimorar Físico (V)',
    },
  },

  'aprimorar mente': {
    base: {
      attributeChoice: ['int', 'pre'],
      selfOnly: false,
      label: 'Aprimorar Mente',
      // +1 ao atributo escolhido — definido no modal
    },
    discente: {
      attributeChoice: ['int', 'pre'],
      selfOnly: false,
      label: 'Aprimorar Mente (D)',
    },
    verdadeiro: {
      attributeChoice: ['int', 'pre'],
      selfOnly: false,
      label: 'Aprimorar Mente (V)',
    },
  },

  'consumir manancial': {
    base: {
      tempHp: '3d6',
      selfOnly: true,
      label: 'Consumir Manancial',
    },
    discente: {
      tempHp: '6d6',
      selfOnly: true,
      label: 'Consumir Manancial (D)',
    },
    // Verdadeiro tem efeito de área diferente — não automático simples
  },

  'tela de ruído': {
    base: {
      tempHpFlat: 30,
      selfOnly: true,
      label: 'Tela de Ruído',
    },
    discente: {
      tempHpFlat: 60,
      selfOnly: true,
      label: 'Tela de Ruído (D)',
    },
  },


  'cicatrização': {
    base: {
      healDice: '3d8+3',
      selfOnly: false,
      label: 'Cicatrização',
    },
    discente: {
      healDice: '5d8+5',
      selfOnly: false,
      label: 'Cicatrização (D)',
    },
    verdadeiro: {
      healDice: '7d8+7',
      selfOnly: false,
      label: 'Cicatrização (V)',
    },
  },

  'alterar destino': {
    base: {
      defenseBonus: 15,
      selfOnly: true,
      label: 'Alterar Destino',
    },
    verdadeiro: {
      defenseBonus: 15,
      selfOnly: false,
      label: 'Alterar Destino (V)',
    },
  },

  'coincidência forçada': {
    // +2/+5 em perícias — não altera stats diretos na ficha
    // Não incluído aqui
  },

  'proteção contra rituais': {
    base: {
      selfOnly: false,
      label: 'Proteção contra Rituais',
      // +5 em testes de resistência — não altera stats visíveis diretamente
    },
  },

  'ódio incontrolável': {
    base: {
      label: 'Ódio Incontrolável',
      weaponAttackBonus: 2,
      weaponDamageBonus: 2,
      weaponDuration: 'scene',
      weaponType: 'melee',
      selfOnly: true,
    },
    verdadeiro: {
      label: 'Ódio Incontrolável (V)',
      weaponAttackBonus: 5,
      weaponDamageBonus: 5,
      weaponDuration: 'scene',
      weaponType: 'melee',
      selfOnly: true,
    },
  },

  'amaldiçoar arma': {
    base: {
      label: 'Amaldiçoar Arma',
      weaponExtraDamageDice: '1d6',
      weaponDuration: 'scene',
      weaponType: 'all',
      selfOnly: true,
    },
    discente: {
      label: 'Amaldiçoar Arma (D)',
      weaponExtraDamageDice: '2d6',
      weaponDuration: 'scene',
      weaponType: 'all',
      selfOnly: true,
    },
    verdadeiro: {
      label: 'Amaldiçoar Arma (V)',
      weaponExtraDamageDice: '4d6',
      weaponDuration: 'scene',
      weaponType: 'all',
      selfOnly: true,
    },
  },

  'arma atroz': {
    base: {
      label: 'Arma Atroz',
      weaponAttackBonus: 2,
      weaponThreatRangeBonus: 1,
      weaponDuration: 'scene',
      weaponType: 'all',
      selfOnly: true,
    },
    discente: {
      label: 'Arma Atroz (D)',
      weaponAttackBonus: 5,
      weaponDuration: 'scene',
      weaponType: 'all',
      selfOnly: true,
    },
    verdadeiro: {
      label: 'Arma Atroz (V)',
      weaponAttackBonus: 5,
      weaponThreatRangeBonus: 2,
      weaponCritMultiplierBonus: 2,
      weaponDuration: 'scene',
      weaponType: 'all',
      selfOnly: true,
    },
  },

  'forma monstruosa': {
    base: {
      tempHpFlat: 30,
      label: 'Forma Monstruosa',
      weaponAttackBonus: 5,
      weaponDamageBonus: 5,
      weaponDuration: 'scene',
      weaponType: 'melee',
      selfOnly: true,
    },
    verdadeiro: {
      tempHpFlat: 50,
      label: 'Forma Monstruosa (V)',
      weaponAttackBonus: 10,
      weaponDamageBonus: 10,
      weaponDuration: 'scene',
      weaponType: 'melee',
      selfOnly: true,
    },
  },

  'chamas do caos': {
    base: {
      label: 'Chamas do Caos',
      weaponExtraDamageDice: '1d6',
      weaponDamageElement: 'Fogo',
      weaponDuration: 'scene',
      weaponType: 'melee',
      selfOnly: true,
    },
  },

  'decadência': {
    discente: {
      label: 'Decadência (D)',
      weaponExtraDamageDice: '3d8',
      weaponDamageBonus: 3,
      weaponDamageElement: 'Morte',
      weaponDuration: 'next_attack',
      weaponType: 'melee',
      selfOnly: true,
    },
  },

  'descarnar': {
    verdadeiro: {
      label: 'Descarnar (V)',
      weaponExtraDamageDice: '4d8',
      weaponDamageElement: 'Sangue',
      weaponDuration: 'scene',
      weaponType: 'melee',
      selfOnly: true,
    },
  },

  'hemofagia': {
    base: {
      label: 'Hemofagia',
      healByDamageFactor: 0.5,
      selfOnly: true,
      // Base é ritual de dano direto — não é buff de arma
    },
    discente: {
      label: 'Hemofagia (D)',
      healByDamageFactor: 0.5,
      selfOnly: true,
      // Discente: buff de próximo ataque com dano extra de ritual
      weaponExtraDamageDice: '6d6',
      weaponDamageElement: 'Sangue',
      weaponDuration: 'next_attack',
      weaponType: 'all',
    },
    verdadeiro: {
      label: 'Hemofagia (V)',
      healByDamageFactor: 0.5,
      selfOnly: true,
      // Verdadeiro: buff de cena sustentado
      weaponDuration: 'scene',
      weaponType: 'all',
    },
  },
}

/**
 * Retorna os bônus de atributo para Aprimorar Físico / Mente
 * com base na versão.
 */
export function getAttributeBonus(version: 'base' | 'discente' | 'verdadeiro'): number {
  switch (version) {
    case 'base':
      return 1
    case 'discente':
      return 2
    case 'verdadeiro':
      return 3
  }
}

/**
 * Busca o buff do ritual pelo nome e versão.
 * Retorna undefined se o ritual não tem buff automático.
 */
export function getRitualBuff(
  ritualName: string,
  version: 'base' | 'discente' | 'verdadeiro'
): RitualBuffEffect | undefined {
  const entry = RITUAL_BUFFS[ritualName.toLowerCase()]
  if (!entry) return undefined
  return entry[version]
}
