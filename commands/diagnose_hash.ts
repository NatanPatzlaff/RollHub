import { BaseCommand } from '@adonisjs/core/ace'
import hash from '@adonisjs/core/services/hash'
import fs from 'node:fs/promises'

export default class DiagnoseHash extends BaseCommand {
    static commandName = 'diagnose:hash'
    static description = 'Diagnose hash storage issues'

    async run() {
        const { default: db } = await import('@adonisjs/lucid/services/db')
        const email = 'natanepatzlaff@gmail.com'
        const password = '12345678'

        // 1. Generate
        const generatedHash = await hash.make(password)

        // 2. Store
        await db.from('users').where('email', email).update({ password: generatedHash })

        // 3. Retrieve
        const user = await db.from('users').where('email', email).first()
        const storedHash = user.password

        // 4. Verify
        const isValid = await hash.verify(storedHash, password)

        // 5. Report
        const report = `
Time: ${new Date().toISOString()}
Password: ${password}
Generated Hash (${generatedHash.length}):
${generatedHash}

Stored Hash (${storedHash?.length}):
${storedHash}

Match: ${generatedHash === storedHash}
Verify Result: ${isValid}
`
        await fs.writeFile('hash_diagnosis.txt', report)
        console.log('Diagnosis written to hash_diagnosis.txt')
    }
}
