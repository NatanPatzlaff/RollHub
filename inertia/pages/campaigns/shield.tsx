import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { addToast } from "@heroui/react"
import { Transmit } from '@adonisjs/transmit-client'
import { Head, usePage, router } from '@inertiajs/react'
import axios from 'axios'
import { ThreeDDice } from 'dddice-js'

import BrowserTabs from './shield_components/BrowserTabs'
import PlayersSidebar from './components/vtt/PlayersSidebar'
import MainContent from './shield_components/MainContent'
import RollHistoryPanel from './shield_components/RollHistoryPanel'



export default function ShieldDashboard() {
  const { campaign, auth, homebrewItems, activeCombat, campaignMonsters } = usePage().props as any
  const [activeTab, setActiveTab] = useState('missoes')
  const [showStats, setShowStats] = useState<boolean>(Boolean(campaign.showPlayerStats ?? false))
  
  const handleToggleStats = async () => {
    console.log('[TOGGLE] clicado, showStats atual:', showStats)
    const newValue = !Boolean(showStats)
    setShowStats(newValue)
    console.log('[TOGGLE] novo valor:', newValue)
    try {
      const res = await axios.patch(`/campaigns/${campaign.id}/settings`, { showPlayerStats: newValue })
      console.log('[TOGGLE] resposta:', res.data)
    } catch (e) {
      console.error('[TOGGLE] erro:', e)
      setShowStats(!newValue)
    }
  }

  const [campaignRolls, setCampaignRolls] = useState<any[]>([])
  
  // Memorizar personagens para estabilidade de referência
  const characters = useMemo(() => campaign.characters || [], [campaign.characters])

  
  // Estados para Pedir Iniciativa
  const [requestingInitiative, setRequestingInitiative] = useState(false)
  const [initiativePending, setInitiativePending] = useState<Set<number>>(new Set())
  const [localInitiatives, setLocalInitiatives] = useState<Record<number, number>>({})
  const [selectedParticipantId, setSelectedParticipantId] = useState<number | null>(null)
  
  const handleParticipantSelection = useCallback((id: number) => {
    setSelectedParticipantId(id)
    setActiveTab('combates')
  }, [])

  // dddice logic
  const dddiceRef = useRef<any>(null)
  const dddiceCanvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    console.log('[SHIELD DEBUG] Iniciando setup do dddice...', {
      hasRef: !!dddiceRef.current,
      roomSlug: campaign?.dddiceRoomSlug
    })

    if (!dddiceRef.current && campaign?.dddiceRoomSlug) {
      try {
        const dddice = new ThreeDDice()
        
        const token = import.meta.env.VITE_DDDICE_API_KEY as string | undefined

        console.log('[SHIELD DEBUG] Token encontrado?', !!token)

        if (token) {
          const canvas = document.createElement('canvas')
          dddice.initialize(canvas, token)
          dddice.connect(campaign.dddiceRoomSlug)
          dddiceRef.current = dddice
          console.log('[SHIELD DEBUG] dddice instanciado e conectado com sucesso!')
        } else {
          console.error('[SHIELD DEBUG ERRO] API Key do dddice ausente no .env (VITE_DDDICE_API_KEY). A engine não foi iniciada.')
        }
      } catch (error) {
        console.error('[SHIELD DEBUG ERRO FATAL] Falha ao instanciar ThreeDDice:', error)
      }
    } else if (!campaign?.dddiceRoomSlug) {
      console.warn('[SHIELD DEBUG AVISO] Campanha não possui dddiceRoomSlug configurado.')
    }
  }, [campaign?.dddiceRoomSlug])

  const handleAttackCharacter = async (characterId: number, characterName: string) => {
    try {
      await axios.post(`/api/campaigns/${campaign.id}/reaction`, {
        characterId,
        attackerName: 'Monstro', // Pode ser expandido futuramente
        actionType: 'attack'
      })
      console.log(`[REACTION] Solicitação enviada para ${characterName}`)
    } catch (error) {
      console.error('[REACTION] Erro ao enviar solicitação:', error)
    }
  }

  const handleEndScene = async () => {
    try {
      await axios.post(`/api/campaigns/${campaign.id}/end-scene`)
      console.log('[SCENE] Fim de cena enviado')
    } catch (error) {
      console.error('[SCENE] Erro ao enviar fim de cena:', error)
    }
  }

  // SSE para receber respostas de reações
  useEffect(() => {
    const transmitClient = new Transmit({ baseUrl: window.location.origin })
    const subscription = transmitClient.subscription(`campaign/${campaign.id}/events`)

    subscription.create().then(() => {
      console.log('[SSE] mestre conectado ao canal campaign/' + campaign.id + '/events')
    }).catch((e) => {
      console.error('[SSE] erro:', e)
    })

    subscription.onMessage<any>((data) => {
      console.log('[SSE] Evento recebido:', data)
      
      if (data.type === 'ATTACK_ROLLED') {
        addToast({
          title: `💥 Ataque de ${data.characterName}!`,
          description: `${data.action} -> Resultado: ${data.result} (${data.damageType})`,
          color: data.isCritical ? 'danger' : 'primary',
          timeout: 8000,
        })
        router.reload({ only: ['activeCombat'] })
      }

      if (['COMBAT_STARTED', 'PARTICIPANT_ADDED', 'DAMAGE_APPLIED', 'TURN_START', 'SCENE_END', 'INITIATIVE_UPDATED', 'COMBAT_READY', 'BUFFS_UPDATED', 'BUFF_COPY_CONSUMED'].includes(data.type)) {
        router.reload({ only: ['activeCombat', 'campaignMonsters', 'campaign'] })
      }

      if (data.type === 'MONSTER_ROLL') {
        loadRollsRef.current()
      }

      if (data.type === 'REACTION_RESPONSE') {
        const reactionLabels: Record<string, string> = {
          block: '🛡️ Bloquear',
          dodge: '💨 Esquivar',
          counter: '⚔️ Contra-atacar',
        }

        addToast({
          title: `${data.playerName} reagiu!`,
          description: `${data.characterName || 'Personagem'} escolheu: ${reactionLabels[data.reactionType] || data.reactionType}`,
          color: data.reactionType === 'block' ? 'primary' : data.reactionType === 'dodge' ? 'success' : 'danger',
          timeout: 6000,
        })
      }
    })

    return () => {
      subscription.delete().catch(() => {})
    }
  }, [campaign.id])



  // Refs para controle de tempo e estado no polling
  const initiativeRequestedAtRef = useRef<Date | null>(null)
  const requestingInitiativeRef = useRef(false)
  const initiativePendingRef = useRef<Set<number>>(new Set())
  const campaignCharactersRef = useRef<any[]>([])

  useEffect(() => {
    initiativePendingRef.current = initiativePending
  }, [initiativePending])

  useEffect(() => {
    campaignCharactersRef.current = characters
  }, [characters])

  const handleRequestInitiative = () => {
    setRequestingInitiative(true)
    requestingInitiativeRef.current = true
    initiativeRequestedAtRef.current = new Date()
    setInitiativePending(new Set(characters.map((c: any) => c.id)))
    router.post(`/campaigns/${campaign.id}/combats/request-initiative`)
  }

  const loadRolls = useCallback(async () => {
    if (!campaign?.id) return
    try {
      const response = await axios.get(`/api/campaigns/${campaign.id}/rolls`)
      const formattedRolls = (response.data.rolls || []).map((r: any) => ({
        id: r.id,
        player: r.playerName || r.player_name,
        action: r.action,
        roll: r.rollExpression || r.roll_expression,
        result: r.result,
        time: new Date(r.rolledAt || r.rolled_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        isCritical: !!r.isCritical || !!r.is_critical,
        isFail: !!r.isFail || !!r.is_fail,
        isGM: !!r.isGm || !!r.is_gm,
        diceValues: r.diceValues,
        rolledAt: (() => {
          const raw = r.rolledAt || r.rolled_at || ''
          const str = raw.includes('T') || raw.includes('Z') ? raw : raw.replace(' ', 'T') + 'Z'
          return new Date(str)
        })()
      }))
      setCampaignRolls(formattedRolls)

      const updateInitiative = (id: number, val: number) => {
        setLocalInitiatives(prev => ({ ...prev, [id]: val }))
      }

      // Se estiver pedindo iniciativa, processar as novas rolagens
      if (requestingInitiativeRef.current) {
        formattedRolls.forEach((roll: any) => {
          const passaTempo = !initiativeRequestedAtRef.current || roll.rolledAt >= initiativeRequestedAtRef.current
          const passaAcao = roll.action?.toLowerCase().includes('iniciativa')
          const character = campaignCharactersRef.current.find((c: any) => c.name === roll.player)
          const estaPendente = character ? initiativePendingRef.current.has(character.id) : false

          if (!passaTempo) return
          if (!passaAcao) return
          if (!character || !estaPendente) return

          updateInitiative(character.id, roll.result)
          setInitiativePending(prev => {
            const next = new Set(prev)
            next.delete(character.id)
            initiativePendingRef.current = next
            if (next.size === 0) {
              setRequestingInitiative(false)
              requestingInitiativeRef.current = false
            }
            return next
          })
        })
      }
    } catch (e) {
      console.error('Erro ao buscar rolagens:', e)
    }
  }, [campaign?.id])

  const handleClearHistory = async () => {
    if (!campaign?.id) return
    
    // Encontrar o personagem do mestre na campanha
    const gmCharacter = campaign.characters?.find((c: any) => c.userId === auth.user.id)
    if (!gmCharacter) return

    try {
      await axios.post(`/api/characters/${gmCharacter.id}/rolls/clear`)
      setCampaignRolls([])
    } catch (error) {
      console.error('Erro ao limpar histórico:', error)
    }
  }

  const handleClearAll = async () => {
    if (!campaign?.id) return
    if (!confirm('Isso irá deletar TODAS as rolagens da campanha para todos os jogadores. Confirmar?')) return
    
    try {
      await axios.delete(`/api/campaigns/${campaign.id}/rolls`)
      setCampaignRolls([])
    } catch (e) {
      console.error('Erro ao limpar todas as rolagens:', e)
    }
  }

  const loadRollsRef = useRef<() => void>(() => {})

  useEffect(() => {
    loadRollsRef.current = loadRolls
  }, [loadRolls])

  useEffect(() => {
    loadRollsRef.current()
    const interval = setInterval(() => loadRollsRef.current(), 10000)

    // Escuta rolagens de monstros feitas pelo próprio mestre (via MonsterCombatSheet)
    const handleSecretRoll = () => {
      loadRollsRef.current()
    }
    window.addEventListener('secret-roll-added', handleSecretRoll)

    return () => {
      clearInterval(interval)
      window.removeEventListener('secret-roll-added', handleSecretRoll)
    }
  }, [campaign?.id])

    

  return (
    <>
      <Head title={`Escudo do Mestre - ${campaign?.name || 'Campanha'}`} />
      
      <div className="h-screen w-full bg-[#09090B] text-white font-sans flex flex-col overflow-hidden selection:bg-[#F97316]/30">
        
        {/* Topo: Abas do Navegador */}
        <BrowserTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {/* Corpo: Layout Bento/VTT */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Painel Esquerdo: Ordem de Turno / Personagens */}
             <PlayersSidebar 
              activeCombat={activeCombat}
              characters={characters} 
              localInitiatives={localInitiatives}
              requestingInitiative={requestingInitiative}
              onRequestInitiative={handleRequestInitiative}
              onInitiativeChange={(characterId, value) =>
                setLocalInitiatives(prev => ({ ...prev, [characterId]: value }))
              }
              onNextTurn={async (characterId, characterName) => {
                try {
                  await axios.post(`/api/campaigns/${campaign.id}/notify-turn`, { characterId, characterName })
                } catch (e) {
                  console.error('[TURN] Erro ao notificar turno:', e)
                }
              }}
              showStats={true}
              onToggleStats={handleToggleStats}
              switchValue={showStats}
              onAttackCharacter={handleAttackCharacter}
              selectedParticipantId={selectedParticipantId}
              onSelectParticipant={handleParticipantSelection}
            />
            
            {/* Área Central: Conteúdo das Abas */}
             <MainContent 
              activeTab={activeTab} 
              campaign={campaign} 
              showStats={true} 
              isOwner={true} 
              onEndScene={handleEndScene} 
              homebrewItems={homebrewItems}
              activeCombat={activeCombat}
              campaignMonsters={campaignMonsters}
              setActiveTab={setActiveTab}
              selectedParticipantId={selectedParticipantId}
              dddiceRef={dddiceRef}
            />
          
          {/* Registro do Sistema */}
          {activeTab !== 'bestiario' && (
            <div className="lg:col-span-1 h-full">
              <RollHistoryPanel 
                rolls={campaignRolls} 
                onClear={handleClearHistory}
                onClearAll={handleClearAll}
              />
            </div>
          )}
        </div>
      </div>

      <canvas ref={dddiceCanvasRef} style={{ display: 'none', position: 'fixed', pointerEvents: 'none' }} />
    </>
  )
}
