import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import { usePage } from '@inertiajs/react'
import PlayerCard from './PlayerCard'

interface GroupOverviewProps {
  players: any[]
}

export default function GroupOverview({ players }: GroupOverviewProps) {
  const { campaign } = usePage().props as any
  
  const [isGenerating, setIsGenerating] = useState(false)

  const copyInviteLink = async () => {
    setIsGenerating(true)
    try {
      // Extrair o token CSRF do cookie (AdonisJS Shield)
      const xsrfToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1]

      const response = await fetch(`/campaigns/${campaign.id}/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-XSRF-TOKEN': xsrfToken ? decodeURIComponent(xsrfToken) : '',
        }
      })
      
      const data = await response.json()
      
      if (data.token) {
        const url = `${window.location.origin}/invite/${data.token}`
        
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(url)
          alert('Link de convite copiado para a área de transferência!')
        } else {
          prompt('Copie o link abaixo para convidar jogadores:', url)
        }
      }
    } catch (error) {
      console.error('Erro ao gerar convite:', error)
      alert('Falha ao gerar link de convite.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="bg-[#18181B] border border-[#27272A] rounded-b-xl rounded-tr-xl p-5 md:p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-white">Personagens dos Jogadores</h2>
        <button 
          onClick={copyInviteLink}
          disabled={isGenerating}
          className={`${isGenerating ? 'opacity-50 cursor-not-allowed' : ''} bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-4 py-2 rounded-md font-semibold flex items-center gap-2 text-sm transition-colors shadow-lg shadow-[#7C3AED]/20`}
        >
          <UserPlus size={16} className={isGenerating ? 'animate-spin' : ''} />
          {isGenerating ? 'Gerando...' : 'Convidar Jogador'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {players.map(player => (
          <PlayerCard key={player.id} character={player} />
        ))}
        
        <button 
          onClick={copyInviteLink}
          className="bg-[#101012] border border-dashed border-[#27272A] hover:border-[#7C3AED] hover:bg-[#7C3AED]/5 rounded-lg p-4 flex flex-col items-center justify-center gap-2 transition-colors min-h-[200px] text-[#A1A1AA] hover:text-[#7C3AED]"
        >
          <div className="w-10 h-10 rounded-full bg-[#1C1C1E] flex items-center justify-center mb-2">
            <UserPlus size={20} />
          </div>
          <span className="font-semibold text-sm">Aguardando Jogador</span>
          <span className="text-xs text-center opacity-60">Envie o link de convite para adicionar mais pessoas</span>
        </button>
      </div>
    </div>
  )
}
