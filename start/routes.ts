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

import { middleware } from '#start/kernel'

router.get('/', [HomeController, 'index'])
router
  .group(() => {
    router.post('/characters', [CharactersController, 'store'])
    router.get('/characters/:id', [CharactersController, 'show'])
    router.put('/characters/:id', [CharactersController, 'update'])
    router.put('/characters/:id/attributes', [CharactersController, 'updateAttributes'])
    router.put('/characters/:id/abilities/:abilityId', [CharactersController, 'configureAbility'])
    router.post('/characters/:id/abilities', [CharactersController, 'addAbilities'])
    router.delete('/characters/:id/abilities/:abilityId', [CharactersController, 'removeAbility'])
    router.put('/characters/:id/trail', [CharactersController, 'selectTrail'])
    router.put('/characters/:id/skills', [CharactersController, 'updateSkills'])
    router.delete('/characters/:id', [CharactersController, 'destroy'])
  })
  .use(middleware.auth())

router.get('/login', [LoginController, 'index'])
router.post('/login', [LoginController, 'store'])

router.get('/register', [RegisterController, 'index'])
router.post('/register', [RegisterController, 'store'])

router.post('/logout', [LogoutController, 'handle'])
