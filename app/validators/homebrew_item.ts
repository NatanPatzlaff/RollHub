import vine from '@vinejs/vine'

export const createHomebrewItemValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1),
    description: vine.string().trim().nullable().optional(),
    item_type: vine.enum(['weapon', 'protection', 'ammunition', 'general']),
    
    // campos condicionais marcados como opcionais na raiz, mas validados via logic se necessário
    damage: vine.string().trim().optional(),
    damageType: vine.string().trim().optional(),
    range: vine.string().trim().optional(),
    defenseBonus: vine.number().optional(),
    penalty: vine.number().optional(),
    caliber: vine.string().trim().optional(),
    quantityPerBox: vine.number().optional(),
    category: vine.number().min(0).max(4).optional(),
    weight: vine.string().trim().nullable().optional(),
    price: vine.string().trim().nullable().optional(),
    skillBonusName: vine.enum(['Acrobacia', 'Adestramento', 'Artes', 'Atletismo', 'Atualidades', 'Ciências', 'Crime', 'Diplomacia', 'Enganação', 'Fortitude', 'Furtividade', 'Iniciativa', 'Intimidação', 'Intuição', 'Investigação', 'Luta', 'Medicina', 'Ocultismo', 'Percepção', 'Pilotagem', 'Pontaria', 'Profissão', 'Reflexos', 'Religião', 'Sobrevivência', 'Tática', 'Tecnologia', 'Vontade']).nullable().optional(),
    skillBonusValue: vine.number().min(-10).max(20).nullable().optional(),
  })
)
