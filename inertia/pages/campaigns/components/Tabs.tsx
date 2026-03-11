import { motion } from 'framer-motion'
import { Users, FileText } from 'lucide-react'

interface TabsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function Tabs({ activeTab, setActiveTab }: TabsProps) {
  const tabs = [
    { id: 'jogadores', label: 'Grupo', icon: Users },
    { id: 'anotacoes', label: 'Anotações', icon: FileText },
  ]

  return (
    <div className="flex border-b border-[#27272A] mb-6">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-colors relative ${
              isActive ? 'text-[#F97316]' : 'text-[#A1A1AA] hover:text-[#D4D4D8]'
            }`}
          >
            <Icon size={16} />
            {tab.label}
            {isActive && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F97316]"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
