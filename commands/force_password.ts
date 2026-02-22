import { BaseCommand } from '@adonisjs/core/ace'
import hash from '@adonisjs/core/services/hash'

export default class ForcePassword extends BaseCommand {
    static commandName = 'force:password'
    static description = 'Force update password bypass hooks'

    async run() {
        const email = 'natanepatzlaff@gmail.com'
        const password = '12345678'

        console.log(`Generating fresh hash for: ${password}`)
        const newHash = await hash.make(password)
        console.log(`Generated Hash: ${newHash}`)

        const { default: db } = await import('@adonisjs/lucid/services/db')

        console.log(`Updating password for ${email} directly in DB...`)
        await db.from('users').where('email', email).update({ password: newHash })

        console.log('Password updated successfully.')

        // Immediate verification
        const user = await db.from('users').where('email', email).first()
        const isValid = await hash.verify(user.password, password)
        console.log(`Immediate Verification Result: ${isValid}`)
    }
}
