import { BaseCommand } from '@adonisjs/core/ace'
import { CommandOptions } from '@adonisjs/core/types/ace'
import User from '#models/user'

export default class CheckUser extends BaseCommand {
    static commandName = 'check:user'
    static description = 'Check if user exists'

    static options: CommandOptions = {}

    async run() {
        const email = 'natanepatzlaff@gmail.com'
        const user = await User.findBy('email', email)

        if (user) {
            this.logger.info(`User found: ${user.fullName} (${user.email})`)
        } else {
            this.logger.error(`User with email ${email} NOT found.`)
        }
    }
}
