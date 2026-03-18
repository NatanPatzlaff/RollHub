import { Users, FileText, Swords, Monitor, Plus, LucideIcon } from 'lucide-react'

interface TabsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function Tabs({ activeTab, setActiveTab }: TabsProps) {
  const tabs = [
    { id: 'salas', label: 'Salas', icon: Monitor },
    { id: 'combates', label: 'Combates', icon: Swords },
    { id: 'jogadores', label: 'Grupo', icon: Users },
    { id: 'anotacoes', label: 'Anotações', icon: FileText },
  ]

  return (
    <div className="flex items-center gap-1 mb-[-1px] relative z-10">
      {tabs.map((tab) => {
        const Icon: LucideIcon = tab.icon
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-2.5 text-sm font-medium transition-all relative rounded-t-lg min-w-[140px] ${
              isActive 
                ? 'bg-[#18181B] text-white border-t-2 border-[#F97316]' 
                : 'bg-[#09090B]/40 text-[#A1A1AA] hover:bg-[#18181B]/60 hover:text-[#D4D4D8] border-t-2 border-transparent'
            }`}
          >
            <Icon size={16} className={isActive ? 'text-white' : 'text-[#A1A1AA]'} />
            {tab.label}
          </button>
        )
      })}
      
      <button className="p-2.5 text-[#A1A1AA] hover:text-white transition-colors ml-1">
        <Plus size={18} />
      </button>
    </div>
  )
}
