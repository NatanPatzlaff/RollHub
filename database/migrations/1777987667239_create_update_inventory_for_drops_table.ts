import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    try {
      await this.db.rawQuery('ALTER TABLE room_items ADD COLUMN character_weapon_id INTEGER')
    } catch (e) {}
    try {
      await this.db.rawQuery('ALTER TABLE room_items ADD COLUMN character_protection_id INTEGER')
    } catch (e) {}
    try {
      await this.db.rawQuery('ALTER TABLE room_items ADD COLUMN character_general_item_id INTEGER')
    } catch (e) {}
    try {
      await this.db.rawQuery('ALTER TABLE room_items ADD COLUMN item_name TEXT')
    } catch (e) {}
  }

  async down() {}
}