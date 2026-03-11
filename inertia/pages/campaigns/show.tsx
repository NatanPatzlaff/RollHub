import { useState } from 'react'
import { useForm } from '@inertiajs/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search } from 'lucide-react'

import Header from './components/Header'
import Tabs from './components/Tabs'
import GroupOverview from './components/GroupOverview'
import QuickActionsPanel from './components/QuickActionsPanel'
import GroupResourcesBars from './components/GroupResourcesBars'

interface GameMasterDashboardProps {
  campaign: any
  isGM?: boolean
}

export default function GameMasterDashboard({ campaign, isGM }: GameMasterDashboardProps) {
  const [activeTab, setActiveTab] = useState('jogadores')
  const players = campaign.characters || []
  const { data, setData, put, processing, errors, reset } = useForm({
    name: campaign.name || '',
    description: campaign.description || '',
  })

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    put(`/campaigns/${campaign.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        // opcional: feedback visual
      },
    })
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white font-sans p-4 md:p-6 lg:p-8 flex justify-center selection:bg-[#7C3AED]/30">
      <div className="w-full max-w-7xl flex flex-col">
        {/* Header customizado com edição */}
        <div className="mb-6 flex flex-col gap-2">
          {isGM ? (
            <form onSubmit={handleSave} className="flex flex-col gap-2">
              <input
                className="bg-[#18181B] border border-[#27272A] rounded px-3 py-2 text-xl font-bold text-white mb-1 focus:outline-none focus:ring-2 focus:ring-violet-500"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                disabled={processing}
                maxLength={64}
              />
              {errors.name && <span className="text-red-400 text-sm">{errors.name}</span>}
              <textarea
                className="bg-[#18181B] border border-[#27272A] rounded px-3 py-2 text-base text-[#A1A1AA] mb-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                rows={3}
                disabled={processing}
                maxLength={256}
              />
              {errors.description && (
                <span className="text-red-400 text-sm">{errors.description}</span>
              )}
              <button
                type="submit"
                className="self-start bg-violet-600 hover:bg-violet-700 text-white font-semibold px-4 py-2 rounded transition disabled:opacity-60"
                disabled={processing || data.name.trim() === ''}
              >
                {processing ? 'Salvando...' : 'Salvar'}
              </button>
            </form>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-white mb-1">{campaign.name}</h1>
              <p className="text-base text-[#A1A1AA] mb-2">{campaign.description}</p>
            </>
          )}
        </div>
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-8 flex flex-col gap-6">
            <AnimatePresence mode="wait">
              {activeTab === 'jogadores' && (
                <motion.div
                  key="jogadores"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <GroupOverview players={players} />
                </motion.div>
              )}
              {activeTab !== 'jogadores' && (
                <motion.div
                  key="outros"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="h-full bg-[#18181B] border border-[#27272A] rounded-xl p-10 flex flex-col items-center justify-center text-[#A1A1AA]"
                >
                  <Search size={48} className="mb-4 opacity-20" />
                  <p className="text-lg font-semibold text-white mb-1">Módulo em Desenvolvimento</p>
                  <p className="text-sm">
                    A aba selecionada será implementada na próxima atualização do sistema.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="xl:col-span-4 flex flex-col gap-6">
            <QuickActionsPanel />
            <GroupResourcesBars players={players} />
          </div>
        </div>
      </div>
    </div>
  )
}
