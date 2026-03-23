import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    // Bônus fixos
    await this.db.from('general_items').where('name', 'Binóculos').update({ 
      skill_bonus_name: 'Percepção', 
      skill_bonus_value: 5 
    })
    await this.db.from('general_items').where('name', 'Corda').update({ 
      skill_bonus_name: 'Atletismo', 
      skill_bonus_value: 5 
    })
    await this.db.from('general_items').where('name', 'Equipamento de Sobrevivência').update({ 
      skill_bonus_name: 'Sobrevivência', 
      skill_bonus_value: 5 
    })
    await this.db.from('general_items').where('name', 'Máscara de Gás').update({ 
      skill_bonus_name: 'Fortitude', 
      skill_bonus_value: 10 
    })
    await this.db.from('general_items').where('name', 'Pé de Cabra').update({ 
      skill_bonus_name: 'Atletismo', 
      skill_bonus_value: 5 
    })
    await this.db.from('general_items').where('name', 'Traje Hazmat').update({ 
      skill_bonus_name: 'Fortitude', 
      skill_bonus_value: 5 
    })
    await this.db.from('general_items').where('name', 'Escuta de Ruídos Paranormais').update({ 
      skill_bonus_name: 'Ocultismo', 
      skill_bonus_value: 5 
    })
    await this.db.from('general_items').where('name', 'Arpéu').update({ 
      skill_bonus_name: 'Atletismo', 
      skill_bonus_value: 5 
    })

    // Bônus escolheveis
    await this.db.from('general_items').where('name', 'Utensílio').update({ 
      skill_bonus_is_choosable: true, 
      skill_bonus_value: 2 
    })
    await this.db.from('general_items').where('name', 'Vestimenta').update({ 
      skill_bonus_is_choosable: true, 
      skill_bonus_value: 2 
    })
  }

  async down() {
    await this.db.from('general_items').update({
      skill_bonus_name: null,
      skill_bonus_value: null,
      skill_bonus_is_choosable: false
    })
  }
}
