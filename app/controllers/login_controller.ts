import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { loginValidator } from '#validators/auth'
import hash from '@adonisjs/core/services/hash'

export default class LoginController {
    async index({ inertia }: HttpContext) {
        return inertia.render('login')
    }

    async store({ request, response, auth, session }: HttpContext) {
        const { email, password } = await request.validateUsing(loginValidator)

        try {
            console.log('--- Debug Login ---')
            console.log('Email:', email)

            const user = await User.findBy('email', email)
            if (!user) {
                console.log('User not found.')
                return response.redirect().toPath('/register')
            }

            console.log('User found:', user.id)
            console.log('Stored Hash:', user.password)

            const isValid = await hash.verify(user.password, password)
            console.log('Hash Verify Result:', isValid)

            if (isValid) {
                console.log('Password valid. Logging in...')
                await auth.use('web').login(user)
                return response.redirect().toPath('/')
            } else {
                console.log('Password invalid.')
                session.flash('errors', {
                    email: 'Email ou senha incorretos.'
                })
                return response.redirect().back()
            }
        } catch (error) {
            console.error('Login error:', error)
            session.flash('errors', {
                email: 'Erro no login: ' + error.message
            })
            return response.redirect().back()
        }
    }
}
