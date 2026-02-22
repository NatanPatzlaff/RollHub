import { BaseCommand } from '@adonisjs/core/ace'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

export default class ReproduceLogin extends BaseCommand {
    static commandName = 'reproduce:login'
    static description = 'Debug login failure'

    async run() {
        console.log('--- Starting Debug ---')
        const email = 'natanepatzlaff@gmail.com'
        const password = '12345678'

        const user = await User.findBy('email', email)
        if (!user) {
            console.error('User not found!')
            return
        }

        console.log(`User ID: ${user.id}`)
        console.log(`Stored Hash: ${user.password}`)
        console.log(`Hash Length: ${user.password.length}`)

        try {
            const isValid = await hash.verify(user.password, password)
            console.log(`Hash verify result for '${password}': ${isValid}`)

            if (!isValid) {
                console.log('Hash is invalid. Generating new hash...')
                const newHash = await hash.make(password)
                console.log('New Hash:', newHash)
                // Update directly via query builder to bypass hooks
                const { default: db } = await import('@adonisjs/lucid/services/db')
                await db.from('users').where('id', user.id).update({ password: newHash })
                console.log('Password updated via Query Builder.')
            }
        } catch (e) {
            console.error('Hash verify threw error:', e)
        }
    }
}
