
import { BaseCommand } from '@adonisjs/core/ace'
import db from '@adonisjs/lucid/services/db'

export default class ForceSetup extends BaseCommand {
    static commandName = 'force:setup'
    static description = 'Force create tables'

    static options = {
        startApp: true
    }

    async run() {
        this.logger.info('Starting force setup...')

        try {
            // 1. Drop everything first to be sure
            this.logger.info('Dropping existing tables...')
            const schema = db.connection().schema
            await db.rawQuery('SET FOREIGN_KEY_CHECKS = 0')

            const tablesToDelete = [
                'adonis_schema', 'adonis_schema_versions',
                'combat_participants', 'combats',
                'character_items', 'character_rituals', 'character_abilities', 'character_skills',
                'character_stats', 'character_attributes', 'campaign_members',
                'characters',
                'origin_benefits', 'trail_progressions', 'class_progressions', 'trails',
                'items', 'rituals', 'abilities', 'skills', 'origins', 'classes',
                'campaigns', 'users'
            ]

            for (const t of tablesToDelete) {
                await schema.dropTableIfExists(t)
                this.logger.info(`Dropped ${t}`)
            }

            await db.rawQuery('SET FOREIGN_KEY_CHECKS = 1')

            this.logger.info('Tables dropped. Creating tables manually...')
            // const schema = db.connection().schema

            // 1. Core Tables
            // Users
            await schema.createTable('users', (table) => {
                table.increments('id')
                table.string('full_name').nullable()
                table.string('email').notNullable().unique()
                table.string('password').notNullable()
                table.timestamp('created_at', { useTz: true }).nullable()
                table.timestamp('updated_at', { useTz: true }).nullable()
            })
            this.logger.info('Created users')


            // Classes
            await schema.createTable('classes', (table) => {
                table.increments('id')
                table.string('name').notNullable()
                table.text('description').nullable()
                table.timestamp('created_at', { useTz: true }).nullable()
                table.timestamp('updated_at', { useTz: true }).nullable()
            })
            this.logger.info('Created classes')


            // Origins
            await schema.createTable('origins', (table) => {
                table.increments('id')
                table.string('name').notNullable()
                table.text('description').nullable()
                table.json('effects').nullable()
                table.timestamp('created_at', { useTz: true }).nullable()
                table.timestamp('updated_at', { useTz: true }).nullable()
            })
            this.logger.info('Created origins')


            // Skills
            await schema.createTable('skills', (table) => {
                table.increments('id')
                table.string('name').notNullable().unique()
                table.timestamp('created_at', { useTz: true }).nullable()
                table.timestamp('updated_at', { useTz: true }).nullable()
            })
            this.logger.info('Created skills')


            // Abilities
            await schema.createTable('abilities', (table) => {
                table.increments('id')
                table.string('name').notNullable()
                table.text('description').nullable()
                table.string('type').notNullable()
                table.json('effects').nullable()
                table.timestamp('created_at', { useTz: true }).nullable()
                table.timestamp('updated_at', { useTz: true }).nullable()
            })
            this.logger.info('Created abilities')


            // Rituals
            await schema.createTable('rituals', (table) => {
                table.increments('id')
                table.string('name').notNullable()
                table.string('element').notNullable()
                table.integer('circle').notNullable()
                table.string('execution').notNullable()
                table.string('range').notNullable()
                table.string('target').notNullable()
                table.string('duration').notNullable()
                table.text('description').nullable()
                table.timestamp('created_at', { useTz: true }).nullable()
                table.timestamp('updated_at', { useTz: true }).nullable()
            })
            this.logger.info('Created rituals')


            // Items
            await schema.createTable('items', (table) => {
                table.increments('id')
                table.string('name').notNullable()
                table.string('category').notNullable()
                table.string('type').nullable()
                table.integer('weight').defaultTo(0)
                table.json('stats').nullable()
                table.text('description').nullable()
                table.timestamp('created_at', { useTz: true }).nullable()
                table.timestamp('updated_at', { useTz: true }).nullable()
            })
            this.logger.info('Created items')


            // Trails (Depends on Classes)
            await schema.createTable('trails', (table) => {
                table.increments('id')
                table.integer('class_id').unsigned().references('id').inTable('classes').onDelete('CASCADE')
                table.string('name').notNullable()
                table.text('description').nullable()
                table.timestamp('created_at', { useTz: true }).nullable()
                table.timestamp('updated_at', { useTz: true }).nullable()
            })
            this.logger.info('Created trails')


            // Class Progressions (Depends on Classes)
            await schema.createTable('class_progressions', (table) => {
                table.increments('id')
                table.integer('class_id').unsigned().references('id').inTable('classes').onDelete('CASCADE')
                table.integer('nex').notNullable()
                table.string('title').notNullable()
                table.text('description').nullable()
                table.string('type').notNullable()
                table.integer('reference_id').unsigned().nullable()
                table.json('effects').nullable()
                table.timestamp('created_at', { useTz: true }).nullable()
                table.timestamp('updated_at', { useTz: true }).nullable()
            })
            this.logger.info('Created class_progressions')


            // Trail Progressions (Depends on Trails)
            await schema.createTable('trail_progressions', (table) => {
                table.increments('id')
                table.integer('trail_id').unsigned().references('id').inTable('trails').onDelete('CASCADE')
                table.integer('nex').notNullable()
                table.string('title').notNullable()
                table.text('description').nullable()
                table.string('type').notNullable()
                table.integer('reference_id').unsigned().nullable()
                table.json('effects').nullable()
                table.timestamp('created_at', { useTz: true }).nullable()
                table.timestamp('updated_at', { useTz: true }).nullable()
            })
            this.logger.info('Created trail_progressions')


            // Origin Benefits (Depends on Origins, Skills, Abilities)
            await schema.createTable('origin_benefits', (table) => {
                table.increments('id')
                table.integer('origin_id').unsigned().references('id').inTable('origins').onDelete('CASCADE')
                table.integer('skill_id').unsigned().references('id').inTable('skills').onDelete('CASCADE').nullable()
                table.integer('ability_id').unsigned().references('id').inTable('abilities').onDelete('CASCADE').nullable()
                table.timestamp('created_at', { useTz: true }).nullable()
                table.timestamp('updated_at', { useTz: true }).nullable()
            })
            this.logger.info('Created origin_benefits')


            // Characters (Depends on Users, Classes, Origins, Trails)
            await schema.createTable('characters', (table) => {
                table.increments('id')
                table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
                table.integer('class_id').unsigned().references('id').inTable('classes').onDelete('CASCADE')
                table.integer('origin_id').unsigned().references('id').inTable('origins').onDelete('CASCADE')
                table.integer('trail_id').unsigned().references('id').inTable('trails').onDelete('SET NULL').nullable()
                table.integer('nex').defaultTo(5)
                table.integer('xp').defaultTo(0)
                table.string('name').notNullable()
                table.text('lore').nullable()
                table.text('appearance').nullable()
                table.timestamp('created_at', { useTz: true }).nullable()
                table.timestamp('updated_at', { useTz: true }).nullable()
            })
            this.logger.info('Created characters')


            // Character Attributes
            await schema.createTable('character_attributes', (table) => {
                table.increments('id')
                table.integer('character_id').unsigned().references('id').inTable('characters').onDelete('CASCADE')
                table.integer('strength').defaultTo(1)
                table.integer('agility').defaultTo(1)
                table.integer('intellect').defaultTo(1)
                table.integer('presence').defaultTo(1)
                table.integer('vigor').defaultTo(1)
                table.timestamp('created_at', { useTz: true }).nullable()
                table.timestamp('updated_at', { useTz: true }).nullable()
            })
            this.logger.info('Created character_attributes')


            // Character Stats
            await schema.createTable('character_stats', (table) => {
                table.increments('id')
                table.integer('character_id').unsigned().references('id').inTable('characters').onDelete('CASCADE')
                table.integer('max_hp').defaultTo(0)
                table.integer('current_hp').defaultTo(0)
                table.integer('max_sanity').defaultTo(0)
                table.integer('current_sanity').defaultTo(0)
                table.integer('max_pe').defaultTo(0)
                table.integer('current_pe').defaultTo(0)
                table.integer('defense_misc').defaultTo(0)
                table.integer('defense_temp').defaultTo(0)
                table.integer('dodge_misc').defaultTo(0)
                table.integer('dodge_temp').defaultTo(0)
                table.integer('block_dr_misc').defaultTo(0)
                table.integer('block_dr_temp').defaultTo(0)
                table.timestamp('created_at', { useTz: true }).nullable()
                table.timestamp('updated_at', { useTz: true }).nullable()
            })
            this.logger.info('Created character_stats')


            // Character Skills
            await schema.createTable('character_skills', (table) => {
                table.increments('id')
                table.integer('character_id').unsigned().references('id').inTable('characters').onDelete('CASCADE')
                table.integer('skill_id').unsigned().references('id').inTable('skills').onDelete('CASCADE')
                table.integer('training_degree').defaultTo(0)
                table.timestamp('created_at', { useTz: true }).nullable()
                table.timestamp('updated_at', { useTz: true }).nullable()
            })
            this.logger.info('Created character_skills')


            // Character Abilities
            await schema.createTable('character_abilities', (table) => {
                table.increments('id')
                table.integer('character_id').unsigned().references('id').inTable('characters').onDelete('CASCADE')
                table.integer('ability_id').unsigned().references('id').inTable('abilities').onDelete('CASCADE')
                table.timestamp('created_at', { useTz: true }).nullable()
                table.timestamp('updated_at', { useTz: true }).nullable()
            })
            this.logger.info('Created character_abilities')


            // Character Rituals
            await schema.createTable('character_rituals', (table) => {
                table.increments('id')
                table.integer('character_id').unsigned().references('id').inTable('characters').onDelete('CASCADE')
                table.integer('ritual_id').unsigned().references('id').inTable('rituals').onDelete('CASCADE')
                table.integer('dt').defaultTo(0)
                table.timestamp('created_at', { useTz: true }).nullable()
                table.timestamp('updated_at', { useTz: true }).nullable()
            })
            this.logger.info('Created character_rituals')


            // Character Items
            await schema.createTable('character_items', (table) => {
                table.increments('id')
                table.integer('character_id').unsigned().references('id').inTable('characters').onDelete('CASCADE')
                table.integer('item_id').unsigned().references('id').inTable('items').onDelete('CASCADE')
                table.boolean('is_equipped').defaultTo(false)
                table.integer('current_category').nullable()
                table.json('details').nullable()
                table.timestamp('created_at', { useTz: true }).nullable()
                table.timestamp('updated_at', { useTz: true }).nullable()
            })
            this.logger.info('Created character_items')


            // Campaigns
            await schema.createTable('campaigns', (table) => {
                table.increments('id')
                table.integer('game_master_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
                table.string('name').notNullable()
                table.text('description').nullable()
                table.timestamp('created_at', { useTz: true }).nullable()
                table.timestamp('updated_at', { useTz: true }).nullable()
            })
            this.logger.info('Created campaigns')


            // Campaign Members
            await schema.createTable('campaign_members', (table) => {
                table.increments('id')
                table.integer('campaign_id').unsigned().references('id').inTable('campaigns').onDelete('CASCADE')
                table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
                table.integer('character_id').unsigned().references('id').inTable('characters').onDelete('SET NULL').nullable()
                table.string('role').defaultTo('PLAYER')
                table.timestamp('created_at', { useTz: true }).nullable()
                table.timestamp('updated_at', { useTz: true }).nullable()
            })
            this.logger.info('Created campaign_members')


            // Combats
            await schema.createTable('combats', (table) => {
                table.increments('id')
                table.integer('campaign_id').unsigned().references('id').inTable('campaigns').onDelete('CASCADE')
                table.integer('round').defaultTo(1)
                table.boolean('active').defaultTo(true)
                table.timestamp('started_at').nullable()
                table.timestamp('created_at', { useTz: true }).nullable()
                table.timestamp('updated_at', { useTz: true }).nullable()
            })
            this.logger.info('Created combats')


            // Combat Participants
            await schema.createTable('combat_participants', (table) => {
                table.increments('id')
                table.integer('combat_id').unsigned().references('id').inTable('combats').onDelete('CASCADE')
                table.integer('character_id').unsigned().references('id').inTable('characters').onDelete('CASCADE').nullable()
                table.integer('monster_id').unsigned().nullable()
                table.string('name').notNullable()
                table.integer('initiative').defaultTo(0)
                table.integer('hp_current').nullable()
                table.text('status').nullable()
                table.timestamp('created_at', { useTz: true }).nullable()
                table.timestamp('updated_at', { useTz: true }).nullable()
            })
            this.logger.info('Created combat_participants')


            this.logger.info('Manual setup complete.')

        } catch (e: any) {
            this.logger.error(`Setup Error: ${e.message}`)
        }
    }
}
