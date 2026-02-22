import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { registerValidator } from '#validators/auth'

export default class RegisterController {
    async index({ inertia }: HttpContext) {
        return inertia.render('register')
    }

    async store({ request, response, auth }: HttpContext) {
        const payload = await request.validateUsing(registerValidator)
        const user = await User.create({
            fullName: payload.name,
            email: payload.email,
            password: payload.password,
        })

        await auth.use('web').login(user)

        return response.redirect().toPath('/')
    }
}
