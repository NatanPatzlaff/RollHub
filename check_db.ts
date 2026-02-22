
import User from '#models/user'

async function run() {
    try {
        const users = await User.all()
        console.log(`Users count: ${users.length}`)
    } catch (error) {
        console.error('Error querying users:', error.message)
        console.error(error)
    }
}

run().then(() => {
    process.exit(0)
}).catch((err) => {
    console.error(err)
    process.exit(1)
})
