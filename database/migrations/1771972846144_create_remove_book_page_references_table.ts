import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  public async up() {
    // Queries to remove string fragments from class_abilities
    await this.db.rawQuery(`
      UPDATE class_abilities
      SET description = REPLACE(description, ' Veja o CAPÍTULO 5 para as regras de rituais.', '')
      WHERE description LIKE '%Veja o CAPÍTULO 5 para as regras de rituais.%';
    `)
    await this.db.rawQuery(`
      UPDATE class_abilities
      SET description = REPLACE(description, ' (veja a página 151)', '')
      WHERE description LIKE '%(veja a página 151)%';
    `)
    await this.db.rawQuery(`
      UPDATE class_abilities
      SET description = REPLACE(description, ' (veja a Tabela 1.4)', '')
      WHERE description LIKE '%(veja a Tabela 1.4)%';
    `)
    await this.db.rawQuery(`
      UPDATE class_abilities
      SET description = REPLACE(description, ' (veja p. 59)', '')
      WHERE description LIKE '%(veja p. 59)%';
    `)

    // Transcender is an ability but also exists in paranormal_powers maybe?
    await this.db.rawQuery(`
      UPDATE class_abilities
      SET description = REPLACE(description, ' (veja a página 114)', '')
      WHERE description LIKE '%(veja a página 114)%';
    `)
    await this.db.rawQuery(`
      UPDATE paranormal_powers
      SET description = REPLACE(description, ' (veja a página 114)', '')
      WHERE description LIKE '%(veja a página 114)%';
    `)
  }

  public async down() {
    // Not easily reversible since the exact string was lost, but we do nothing here
  }
}