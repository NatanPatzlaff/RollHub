
import { BaseCommand } from '@adonisjs/core/ace'
import { CommandOptions } from '@adonisjs/core/types/ace'
import User from '#models/user'
import Character from '#models/character'
import Campaign from '#models/campaign'
import string from '@adonisjs/core/helpers/string'

export default class VerifySchema extends BaseCommand {
  static commandName = 'verify:schema'
  static description = 'Verify database schema relationships'

  static options: CommandOptions = {
    startApp: true
  }

  async run() {
    console.log('Starting verification...')

    try {
      // 1. Create Users
      const gmEmail = `gm_${string.random(5)}@example.com`
      const playerEmail = `player_${string.random(5)}@example.com`

      const gm = await User.create({ email: gmEmail, password: 'password', fullName: 'GM User' })
      const player = await User.create({ email: playerEmail, password: 'password', fullName: 'Player User' })

      console.log(`Created Users: GM (${gm.id}), Player (${player.id})`)

      // 2. Create Campaign (GM)
      const campaign = await Campaign.create({
        gameMasterId: gm.id,
        name: 'Epic Adventure',
        description: 'A test campaign',
      })
      console.log(`Created Campaign: ${campaign.id}`)

      // 3. Create Character (Player)
      const character = await Character.create({
        userId: player.id,
        name: 'Heroic Warrior',
      })
      console.log(`Created Character: ${character.id}`)

      // 4. Verify Relationships (Before Join)
      await gm.load('campaignsMastered')
      if (gm.campaignsMastered.length !== 1) throw new Error('GM should map to 1 campaign')

      await player.load('characters')
      if (player.characters.length !== 1) throw new Error('Player should map to 1 character')

      // 5. Join and Assign Character to Campaign
      // Attach player with role and character_id
      await campaign.related('players').attach({
        [player.id]: { role: 'PLAYER', character_id: character.id }
      })
      console.log('Player joined and character assigned to campaign')

      // 6. Verify GM sees Character
      // We need to reload the campaign and its relations
      const campaignCheck = await Campaign.findOrFail(campaign.id)
      await campaignCheck.load('characters')

      if (campaignCheck.characters.length === 1 && campaignCheck.characters[0].id === character.id) {
        this.logger.success('SUCCESS: GM sees the specific character in the campaign!')
        console.log(JSON.stringify(campaignCheck.characters.map(c => c.toJSON()), null, 2))
      } else {
        this.logger.error('FAILURE: GM does not see the character.')
        console.log(JSON.stringify(campaignCheck.characters, null, 2))
        process.exitCode = 1
      }

    } catch (e) {
      this.logger.error(e)
      process.exitCode = 1
    }
  }
}