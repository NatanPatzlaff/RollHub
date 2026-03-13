import type { HttpContext } from '@adonisjs/core/http'
import Class from '#models/class'
import Origin from '#models/origin'
import Character from '#models/character'
import Campaign from '#models/campaign'

export default class HomeController {
    async index({ auth, inertia }: HttpContext) {
        const classes = await Class.query().orderBy('name', 'asc')
        const origins = await Origin.query()
            .preload('benefits', (q) => {
                q.preload('skill')
                q.preload('ability')
            })
            .orderBy('name', 'asc')

        let characters: Character[] = []
        let campaigns: Campaign[] = []
        
        if (auth.user) {
            characters = await Character.query()
                .where('user_id', auth.user.id)
                .preload('class')
                .preload('origin')
                .orderBy('created_at', 'desc')
                
            const campaignsData = await Campaign.query()
                .where('game_master_id', auth.user.id)
                .orWhereHas('players', (query) => query.where('user_id', auth.user!.id))
                .withCount('players')
                .orderBy('created_at', 'desc')

            campaigns = campaignsData.map(campaign => ({
                ...campaign.serialize(),
                isOwner: campaign.gameMasterId === auth.user!.id,
                playerCount: campaign.$extras.players_count
            })) as any
        }

        return inertia.render('home', {
            classes,
            origins,
            characters,
            campaigns,
        })
    }
}
