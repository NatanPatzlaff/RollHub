import { Settings, Shield, UserPlus } from 'lucide-react'
import { router, usePage } from '@inertiajs/react'
import { Button, Tooltip } from '@heroui/react'

export default function Header() {
  const { campaign } = usePage().props as any
  
  const copyInviteLink = () => {
    const url = `${window.location.origin}/join/${campaign.inviteCode}`
    navigator.clipboard.writeText(url)
    alert('Link de convite copiado para a área de transferência!')
  }

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Campanha: {campaign?.name || 'Carregando...'}
        </h1>
        <p className="text-[#A1A1AA] text-sm mt-1">
          {campaign?.description || 'Sem descrição'}
        </p>
      </div>
      <div className="flex gap-3">
        <Tooltip content="Copiar Link de Convite">
          <Button 
            variant="flat"
            className="bg-[#18181B] border border-[#27272A] text-[#A1A1AA] hover:text-white"
            onPress={copyInviteLink}
            isIconOnly
          >
            <UserPlus size={18} />
          </Button>
        </Tooltip>

        <button className="bg-[#18181B] border border-[#27272A] text-[#A1A1AA] hover:text-white px-4 py-2.5 rounded-lg font-semibold flex items-center gap-2 text-sm transition-colors">
          <Settings size={16} />
        </button>
        <button 
          onClick={() => router.visit(`/campaigns/${campaign?.id}/shield`)}
          className="bg-transparent border border-[#06B6D4] text-[#06B6D4] hover:bg-[#06B6D4]/10 px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 text-sm transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)]"
        >
          <Shield size={16} />
          Escudo do Mestre
        </button>
      </div>
    </div>
  )
}
