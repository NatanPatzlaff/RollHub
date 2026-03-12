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
const CampaignsController = () => import('#controllers/campaigns_controller')
const CampaignInvitesController = () => import('#controllers/campaign_invites_controller')
const CampaignNotesController = () => import('#controllers/campaign_notes_controller')

import { middleware } from '#start/kernel'

router.get('/', [HomeController, 'index'])

// Rotas de Convite (Públicas)
router.get('/invite/:token', [CampaignInvitesController, 'preview'])
router
  .group(() => {
    router.post('/invite/:token/accept', [CampaignInvitesController, 'accept'])
    router.post('/campaigns/:id/invite', [CampaignInvitesController, 'generate'])
    router.post('/campaigns', [CampaignsController, 'store'])
    router.get('/campaigns/:id', [CampaignsController, 'show'])
    router.get('/campaigns/:id/shield', [CampaignsController, 'shield'])
    router.put('/campaigns/:id', [CampaignsController, 'update'])
    router.post('/characters', [CharactersController, 'store'])
    router.get('/characters/:id', [CharactersController, 'show'])
    router.get('/api/characters/:id/campaign-rolls', [CharactersController, 'getCampaignRolls'])
    router.post('/api/characters/:id/rolls', [CharactersController, 'saveRoll'])
    router.put('/characters/:id', [CharactersController, 'update'])
    router.put('/characters/:id/attributes', [CharactersController, 'updateAttributes'])
    router.post('/characters/:id/abilities', [CharactersController, 'addAbility'])
    router.delete('/characters/:id/abilities/:abilityId', [CharactersController, 'removeAbility'])
    router.put('/characters/:id/abilities/:abilityId', [CharactersController, 'configureAbility'])
    router.post('/characters/:id/paranormal-powers', [CharactersController, 'addParanormalPower'])
    router.delete('/characters/:id/paranormal-powers/:powerId', [
      CharactersController,
      'removeParanormalPower',
    ])
    router.post('/characters/:id/rituals', [CharactersController, 'addRitual'])
    router.delete('/characters/:id/rituals/:ritualId', [CharactersController, 'removeRitual'])
    router.put('/characters/:id/trail', [CharactersController, 'selectTrail'])
    router.put('/characters/:id/trail-config', [CharactersController, 'updateTrailConfig'])
    router.put('/characters/:id/affinity', [CharactersController, 'updateAffinity'])
    router.put('/characters/:id/skills', [CharactersController, 'updateSkills'])
    router.post('/characters/:id/items', [CharactersController, 'addItem'])
    router.delete('/characters/:id/items/:itemId', [CharactersController, 'removeItem'])
    router.patch('/characters/:id/items/:itemId/equip', [CharactersController, 'equipItem'])

    // Weapon Modifications
    router.post('/characters/:id/weapons/:characterWeaponId/modifications', [
      CharactersController,
      'addWeaponModification',
    ])
    router.delete('/characters/:id/weapons/:characterWeaponId/modifications/:modificationId', [
      CharactersController,
      'removeWeaponModification',
    ])

    router.delete('/characters/:id', [CharactersController, 'destroy'])
    router.put('/characters/:id/stats', [CharacterStatsController, 'update'])

    // Campaign Notes
    router.get('/api/campaigns/:id/notes', [CampaignNotesController, 'index'])
    router.post('/api/campaigns/:id/notes', [CampaignNotesController, 'store'])
    router.put('/api/campaigns/notes/:id', [CampaignNotesController, 'update'])
    router.delete('/api/campaigns/notes/:id', [CampaignNotesController, 'destroy'])
  })
  .use(middleware.auth())

router.get('/login', [LoginController, 'index'])
router.post('/login', [LoginController, 'store'])

router.get('/register', [RegisterController, 'index'])
router.post('/register', [RegisterController, 'store'])

router.post('/logout', [LogoutController, 'handle'])
