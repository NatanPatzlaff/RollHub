/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const HomeController = () => import('#controllers/home_controller')
const LoginController = () => import('#controllers/login_controller')
const RegisterController = () => import('#controllers/register_controller')
const LogoutController = () => import('#controllers/logout_controller')
const CharactersController = () => import('#controllers/characters_controller')
const CharacterStatsController = () => import('#controllers/character_stats_controller')

import { middleware } from '#start/kernel'

router.get('/', [HomeController, 'index'])
router.group(() => {
    router.post('/characters', [CharactersController, 'store'])
    router.get('/characters/:id', [CharactersController, 'show'])
    router.put('/characters/:id', [CharactersController, 'update'])
    router.put('/characters/:id/attributes', [CharactersController, 'updateAttributes'])
    router.post('/characters/:id/abilities', [CharactersController, 'addAbility'])
    router.delete('/characters/:id/abilities/:abilityId', [CharactersController, 'removeAbility'])
    router.put('/characters/:id/abilities/:abilityId', [CharactersController, 'configureAbility'])
    router.post('/characters/:id/paranormal-powers', [CharactersController, 'addParanormalPower'])
    router.delete('/characters/:id/paranormal-powers/:powerId', [CharactersController, 'removeParanormalPower'])
    router.post('/characters/:id/rituals', [CharactersController, 'addRitual'])
    router.delete('/characters/:id/rituals/:ritualId', [CharactersController, 'removeRitual'])
    router.put('/characters/:id/trail', [CharactersController, 'selectTrail'])
    router.put('/characters/:id/skills', [CharactersController, 'updateSkills'])
    router.post('/characters/:id/items', [CharactersController, 'addItem'])
    router.delete('/characters/:id/items/:itemId', [CharactersController, 'removeItem'])
    router.delete('/characters/:id', [CharactersController, 'destroy'])
    router.put('/characters/:id/stats', [CharacterStatsController, 'update'])
}).use(middleware.auth())

router.get('/login', [LoginController, 'index'])
router.post('/login', [LoginController, 'store'])

router.get('/register', [RegisterController, 'index'])
router.post('/register', [RegisterController, 'store'])

router.post('/logout', [LogoutController, 'handle'])

