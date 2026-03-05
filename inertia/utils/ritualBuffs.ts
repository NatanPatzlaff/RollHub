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

  'forma monstruosa': {
    base: {
      tempHpFlat: 30,
      selfOnly: true,
      label: 'Forma Monstruosa',
    },
    verdadeiro: {
      tempHpFlat: 50,
      selfOnly: true,
      label: 'Forma Monstruosa (V)',
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
      selfOnly: false,
      label: 'Ódio Incontrolável',
      // +2 ataque/dano e RD 5 — não são stats da ficha exibidos
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
