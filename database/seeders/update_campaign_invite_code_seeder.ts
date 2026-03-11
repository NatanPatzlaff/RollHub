import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Campaign from '#models/campaign'

export default class extends BaseSeeder {
  async run() {
    const campaigns = await Campaign.query().whereNull('invite_code')

    for (const campaign of campaigns) {
      campaign.inviteCode = Math.random().toString(36).substring(2, 12).toUpperCase()
      await campaign.save()
    }
  }
}