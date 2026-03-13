import { useEffect, useState, useRef } from 'react'
import { Head, usePage } from '@inertiajs/react'
import axios from 'axios'

import BrowserTabs from './shield_components/BrowserTabs'
import PlayersSidebar from './components/vtt/PlayersSidebar'
import MainContent from './shield_components/MainContent'
import RollHistoryPanel from './shield_components/RollHistoryPanel'

// --- DADOS DE TESTE (MOCKS) ---
const mockEntities = [
  { id: 1, name: 'Arthur Cervero', class: 'Combatente', hp: 45, maxHp: 45, pe: 12, maxPe: 15, sanity: 30, maxSanity: 40, status: 'Saudável', initiative: 24, isMonster: false },
  { id: 'm1', name: 'Zumbi de Sangue (Alfa)', class: 'Criatura - Sangue', hp: 80, maxHp: 80, pe: 0, maxPe: 0, sanity: 0, maxSanity: 0, status: 'Machucado', initiative: 18, isMonster: true },
  { id: 2, name: 'Kaiser', class: 'Especialista', hp: 22, maxHp: 30, pe: 25, maxPe: 25, sanity: 15, maxSanity: 45, status: 'Machucado', initiative: 14, isMonster: false },
  { id: 3, name: 'Joui Jouki', class: 'Ocultista', hp: 15, maxHp: 20, pe: 35, maxPe: 35, sanity: 8, maxSanity: 50, status: 'Enlouquecendo', initiative: 8, isMonster: false },
]

export default function ShieldDashboard() {
  const { campaign, auth } = usePage().props as any
  const [activeTab, setActiveTab] = useState('combates')
  const [campaignRolls, setCampaignRolls] = useState<any[]>([])
  
  // Estados para Pedir Iniciativa
  const [requestingInitiative, setRequestingInitiative] = useState(false)
  const [initiativePending, setInitiativePending] = useState<Set<number>>(new Set())
  const [localInitiatives, setLocalInitiatives] = useState<Record<number, number>>({})

  const updateInitiative = (characterId: number, value: number) => {
    setLocalInitiatives(prev => ({ ...prev, [characterId]: value }))
  }

  // Refs para controle de tempo e estado no polling
  const initiativeRequestedAtRef = useRef<Date | null>(null)
  const requestingInitiativeRef = useRef(false)

  const handleRequestInitiative = () => {
    initiativeRequestedAtRef.current = new Date()
    const characterIds = new Set<number>(campaign.characters.map((c: any) => c.id))
    requestingInitiativeRef.current = true
    setInitiativePending(characterIds)
    setRequestingInitiative(true)
  }

  const loadRolls = async () => {
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
        rolledAt: new Date(r.rolledAt || r.rolled_at)
      }))
      setCampaignRolls(formattedRolls)

      // Se estiver pedindo iniciativa, processar as novas rolagens
      if (requestingInitiativeRef.current) {
        formattedRolls.forEach((roll: any) => {
          // Ignorar rolagens anteriores ao pedido de iniciativa
          if (initiativeRequestedAtRef.current && roll.rolledAt < initiativeRequestedAtRef.current) return

          if (roll.action?.toLowerCase().includes('iniciativa')) {
            const character = campaign.characters.find((c: any) => c.name === roll.player)
            if (character && initiativePending.has(character.id)) {
              updateInitiative(character.id, roll.result)
              setInitiativePending(prev => {
                const next = new Set(prev)
                next.delete(character.id)
                if (next.size === 0) {
                  setRequestingInitiative(false)
                  requestingInitiativeRef.current = false
                }
                return next
              })
            }
          }
        })
      }
    } catch (e) {
      console.error('Erro ao buscar rolagens:', e)
    }
  }

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

  useEffect(() => {
    loadRolls()
    const interval = setInterval(loadRolls, 10000)
    return () => clearInterval(interval)
  }, [campaign?.id])

  useEffect(() => {
    // campaignRolls sync log removed
  }, [campaignRolls])

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
            characters={campaign.characters || []} 
            localInitiatives={localInitiatives}
            requestingInitiative={requestingInitiative}
            onRequestInitiative={handleRequestInitiative}
          />
          
          {/* Área Central: Conteúdo das Abas */}
          <MainContent activeTab={activeTab} />
          
          {/* Registro do Sistema */}
          <div className="lg:col-span-1 h-full">
            <RollHistoryPanel 
              rolls={campaignRolls} 
              onClear={handleClearHistory}
              onClearAll={handleClearAll}
            />
          </div>
        </div>
      </div>
    </>
  )
}
