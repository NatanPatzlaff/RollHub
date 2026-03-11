import { MessageSquare, AlertTriangle, XCircle, CheckCircle2 } from 'lucide-react'

interface RollHistoryPanelProps {
  rolls: any[]
}

export default function RollHistoryPanel({ rolls }: RollHistoryPanelProps) {
  return (
    <div className="bg-[#18181B] border-l border-[#27272A] flex flex-col h-full w-72 xl:w-80 flex-shrink-0">
      <div className="p-4 border-b border-[#27272A] flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MessageSquare size={18} className="text-[#7C3AED]" />
          <h2 className="font-bold text-white">Registo do Sistema</h2>
        </div>
        <button className="text-[#A1A1AA] hover:text-white text-xs font-semibold">Limpar</button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {rolls.map(roll => {
          let borderColor = 'border-[#27272A]'
          let icon = null
          let textColor = 'text-white'

          if (roll.isCritical) {
            borderColor = 'border-[#F97316] bg-[#F97316]/5'
            icon = <AlertTriangle size={14} className="text-[#F97316]" />
            textColor = 'text-[#F97316] font-black'
          } else if (roll.isFail) {
            borderColor = 'border-[#EF4444] bg-[#EF4444]/5'
            icon = <XCircle size={14} className="text-[#EF4444]" />
            textColor = 'text-[#EF4444] font-bold'
          } else {
            icon = <CheckCircle2 size={14} className="text-[#10B981]" />
          }

          if (roll.isGM) {
            borderColor = 'border-[#7C3AED] bg-[#7C3AED]/5'
          }

          return (
            <div key={roll.id} className={`bg-[#101012] border ${borderColor} rounded-lg p-3 text-sm relative`}>
              <div className="flex justify-between items-center mb-1">
                <span className={`font-bold ${roll.isGM ? 'text-[#7C3AED]' : 'text-[#A1A1AA]'}`}>
                  {roll.player}
                </span>
                <span className="text-[10px] text-[#52525B]">{roll.time}</span>
              </div>
              <div className="text-[#D4D4D8] mb-2">{roll.action}</div>
              
              <div className="flex justify-between items-center bg-[#09090B] p-2 rounded border border-[#27272A]">
                <span className="text-xs text-[#8B8B94] font-mono">{roll.roll}</span>
                <div className="flex items-center gap-1.5">
                  {icon}
                  <span className={`text-xl ${textColor}`}>{roll.result}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
