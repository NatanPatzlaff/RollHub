import Monster from '../app/models/monster.js'
const monsters = await Monster.query().select('id', 'name', 'agi', 'str', 'int', 'pre', 'vig').orderBy('id', 'desc').limit(5)
console.log(JSON.stringify(monsters, null, 2))
