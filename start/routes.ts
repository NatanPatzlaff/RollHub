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
const MissionsController = () => import('#controllers/missions_controller')
const CatalogsController = () => import('#controllers/catalogs_controller')
const HomebrewItemsController = () => import('#controllers/homebrew_items_controller')

import { middleware } from '#start/kernel'
import transmit from '@adonisjs/transmit/services/main'

// Registrar rotas SSE do transmit (sem middleware de auth pois EventSource não envia cookies facilmente)
transmit.registerRoutes((route) => {
  route.middleware([])
})

router.get('/', [HomeController, 'index'])

// Rotas de Convite (Públicas)
router.get('/invite/:token', [CampaignInvitesController, 'preview'])
router
  .group(() => {
    router.post('/invite/:token/accept', [CampaignInvitesController, 'accept'])
    router.post('/campaigns/:id/invite', [CampaignInvitesController, 'generate'])
    router.post('/campaigns', [CampaignsController, 'store'])
    router.get('/campaigns/:id', [CampaignsController, 'show'])
    router.get('/campaigns/:id/shield', [CampaignsController, 'shield']).as('shield')
    router.patch('/campaigns/:id/settings', [CampaignsController, 'updateSettings']).as('settings.update')
    router.get('/campaigns/:id/settings', [CampaignsController, 'getSettings']).as('settings.get')
    router.put('/campaigns/:id', [CampaignsController, 'update']).as('update')
    router.delete('/campaigns/:id', [CampaignsController, 'destroy']).as('campaign.destroy')
    router.post('/characters', [CharactersController, 'store'])
    router.get('/characters/:id', [CharactersController, 'show'])
    router.get('/api/characters/:id/campaign-rolls', [CharactersController, 'getCampaignRolls'])
    router.post('/api/characters/:id/rolls', [CharactersController, 'saveRoll'])
    router.post('/api/characters/:id/rolls/clear', [CharactersController, 'clearCampaignRolls'])
    router.delete('/api/characters/:id/rolls/:rollId', [CharactersController, 'deleteRoll'])
    router.get('/api/characters/:id/active-buffs', [CharactersController, 'getActiveBuffs'])
    router.post('/api/characters/:id/active-buffs/sync', [CharactersController, 'syncActiveBuffs'])
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

    // Ammunition Modifications
    router.post('/characters/:id/ammunitions/:ammunitionId/modifications', [
      CharactersController,
      'addAmmunitionModification',
    ])
    router.delete('/characters/:id/ammunitions/:ammunitionId/modifications/:modificationId', [
      CharactersController,
      'removeAmmunitionModification',
    ])

    router.delete('/characters/:id', [CharactersController, 'destroy'])
    router.put('/characters/:id/stats', [CharacterStatsController, 'update'])

    // Campaign Notes
    router.get('/api/campaigns/:id/notes', [CampaignNotesController, 'index'])
    router.get('/api/campaigns/:id/rolls', [CampaignsController, 'getRolls'])
    router.delete('/api/campaigns/:id/rolls', [CampaignsController, 'clearAllRolls'])
    router.post('/api/campaigns/:id/reaction', [CampaignsController, 'sendReactionRequest'])
    router.post('/api/campaigns/:id/reaction-response', [CampaignsController, 'sendReactionResponse'])
    router.post('/api/campaigns/:id/end-scene', [CampaignsController, 'endScene'])
    router.post('/api/campaigns/:id/notify-turn', [CampaignsController, 'notifyTurn'])
    router.post('/api/campaigns/:id/notes', [CampaignNotesController, 'store'])
    router.put('/api/campaigns/notes/:id', [CampaignNotesController, 'update'])
    router.delete('/api/campaigns/notes/:id', [CampaignNotesController, 'destroy'])

    // Missions & Exploration
    router.get('/api/campaigns/:campaignId/missions', [MissionsController, 'index'])
    router.post('/api/campaigns/:campaignId/missions', [MissionsController, 'store'])
    router.get('/api/campaigns/:campaignId/missions/:id', [MissionsController, 'show'])
    router.put('/api/campaigns/:campaignId/missions/:id', [MissionsController, 'update'])
    router.delete('/api/campaigns/:campaignId/missions/:id', [MissionsController, 'destroy'])

    router.post('/api/campaigns/:campaignId/missions/:missionId/rooms', [MissionsController, 'storeRoom'])
    router.put('/api/campaigns/:campaignId/missions/:missionId/rooms/:roomId', [MissionsController, 'updateRoom'])
    router.delete('/api/campaigns/:campaignId/missions/:missionId/rooms/:roomId', [MissionsController, 'destroyRoom'])

    router.post('/api/campaigns/:campaignId/missions/:missionId/rooms/:roomId/clues', [MissionsController, 'storeClue'])
    router.put('/api/campaigns/:campaignId/missions/:missionId/rooms/:roomId/clues/:clueId', [MissionsController, 'updateClue'])
    router.delete('/api/campaigns/:campaignId/missions/:missionId/clues/:clueId', [MissionsController, 'destroyClue'])

    router.post('/api/campaigns/:campaignId/missions/:missionId/rooms/:roomId/items', [MissionsController, 'storeItem'])
    router.delete('/api/campaigns/:campaignId/missions/:missionId/items/:itemId', [MissionsController, 'destroyItem'])
    router.post(
      '/api/campaigns/:campaignId/missions/:missionId/rooms/:roomId/items/:itemId/collect',
      [MissionsController, 'collectItem']
    )

    router.get('/api/catalogs', [CatalogsController, 'index'])

    // Homebrew Items
    router.get('/api/homebrew-items', [HomebrewItemsController, 'index'])
    router.post('/api/homebrew-items', [HomebrewItemsController, 'store'])
    router.delete('/api/homebrew-items/:id', [HomebrewItemsController, 'destroy'])
    router.get('/homebrew', [HomebrewItemsController, 'render'])

    router.post('/api/campaigns/:campaignId/missions/:missionId/rooms/:roomId/npcs', [MissionsController, 'storeNpc'])
    router.put('/api/campaigns/:campaignId/missions/:missionId/rooms/:roomId/npcs/:npcId', [MissionsController, 'updateNpc'])
    router.delete('/api/campaigns/:campaignId/missions/:missionId/npcs/:npcId', [MissionsController, 'destroyNpc'])

    // Homebrew item player endpoints
    router.post('/characters/:characterId/homebrew-items', [HomebrewItemsController, 'storeForPlayer'])
    router.post('/characters/:characterId/homebrew-items/add-existing', [HomebrewItemsController, 'addExistingToCharacter'])
    router.patch('/homebrew-items/:id/approve', [HomebrewItemsController, 'approveItem'])
    router.patch('/homebrew-items/:id/reject', [HomebrewItemsController, 'rejectItem'])
  })
  .use(middleware.auth())

router.get('/login', [LoginController, 'index'])
router.post('/login', [LoginController, 'store'])

router.get('/register', [RegisterController, 'index'])
router.post('/register', [RegisterController, 'store'])

router.post('/logout', [LogoutController, 'handle'])
