import { Swords, Crosshair, Bell } from 'lucide-react'

export default function QuickActionsPanel() {
  return (
    <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-5 md:p-6 flex flex-col gap-4">
      <h2 className="text-lg font-bold text-white mb-2">Ações Rápidas</h2>
      
      <button className="w-full bg-[#EF4444]/10 border border-[#EF4444]/30 hover:bg-[#EF4444]/20 text-[#EF4444] py-4 rounded-lg font-bold flex items-center justify-center gap-3 transition-colors">
        <Swords size={20} />
        Criar Novo Combate
      </button>
      
      <div className="grid grid-cols-2 gap-3">
        <button className="bg-[#101012] border border-[#27272A] hover:border-[#06B6D4] hover:text-[#06B6D4] text-[#A1A1AA] py-3 rounded-lg font-semibold flex flex-col items-center gap-2 text-sm transition-colors">
          <Crosshair size={18} />
          Rolar Dados
        </button>
        <button className="bg-[#101012] border border-[#27272A] hover:border-[#F97316] hover:text-[#F97316] text-[#A1A1AA] py-3 rounded-lg font-semibold flex flex-col items-center gap-2 text-sm transition-colors">
          <Bell size={18} />
          Sinal de Alerta
        </button>
      </div>
    </div>
  )
}
