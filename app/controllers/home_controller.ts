import type { HttpContext } from '@adonisjs/core/http'
import Class from '#models/class'
import Origin from '#models/origin'
import Character from '#models/character'

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
        if (auth.user) {
            characters = await Character.query()
                .where('user_id', auth.user.id)
                .preload('class')
                .preload('origin')
                .orderBy('created_at', 'desc')
        }

        return inertia.render('home', {
            classes,
            origins,
            characters,
        })
    }
}
