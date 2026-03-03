import { Head, router, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Button, useDisclosure,
} from '@heroui/react'
import { Shield, Map, Plus } from 'lucide-react'

import HomeHeader from './home/HomeHeader'
import CharacterCard from './home/CharacterCard'
import CampaignCard from './home/CampaignCard'
import PaginationControl from './home/PaginationControl'
import CreateCharacterModal from './home/CreateCharacterModal'

const ITEMS_PER_PAGE = 6

interface Origin {
  id: number
  name: string
  description: string
  trainedSkills: string[] | string | null
  abilityName: string | null
  abilityDescription: string | null
}

export default function Home({
  classes,
  origins,
  characters = [],
}: {
  classes: any[]
  origins: Origin[]
  characters?: any[]
}) {
  const { user } = usePage().props as any

  // modal de criação
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  // modal de delete
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteOpenChange, onClose: onDeleteClose } = useDisclosure()
  const [characterToDelete, setCharacterToDelete] = useState<any | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // paginação
  const [charPage, setCharPage] = useState(1)
  const [campPage, setCampPage] = useState(1)
  const campaigns: any[] = []
  const charTotalPages = Math.ceil(characters.length / ITEMS_PER_PAGE)
  const campTotalPages = Math.ceil(campaigns.length / ITEMS_PER_PAGE)
  const paginatedChars = characters.slice((charPage - 1) * ITEMS_PER_PAGE, charPage * ITEMS_PER_PAGE)
  const paginatedCamps = campaigns.slice((campPage - 1) * ITEMS_PER_PAGE, campPage * ITEMS_PER_PAGE)

  const handleLogout = () => router.post('/logout')

  const handleOpenCreate = () => {
    if (!user) { router.visit('/login'); return }
    setIsCreateOpen(true)
  }

  const handleOpenDeleteModal = (char: any) => {
    setCharacterToDelete(char)
    onDeleteOpen()
  }

  const handleDeleteCharacter = () => {
    if (!characterToDelete) return
    setIsDeleting(true)
    router.delete(`/characters/${characterToDelete.id}`, {
      onSuccess: () => {
        onDeleteClose()
        setCharacterToDelete(null)
        setIsDeleting(false)
      },
      onError: () => {
        setIsDeleting(false)
        console.error('Character deletion failed')
      },
    })
  }

  return (
    <>
      <Head title="Início - RollHub" />

      <div className="flex min-h-screen flex-col bg-background">
        {/* Header */}
        <HomeHeader user={user} onLogout={handleLogout} />

        {/* Dashboard */}
        <main className="flex flex-1 flex-col gap-6 p-6 lg:flex-row lg:gap-0 lg:divide-x lg:divide-border lg:p-0">

          {/* ── Meus Personagens ─────────────────────────────────────────── */}
          <section className="flex flex-1 flex-col p-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-bold tracking-wide text-foreground">Meus Personagens</h2>
              </div>
              <Button
                className="bg-primary text-white font-bold hover:bg-primary/90"
                onPress={handleOpenCreate}
                startContent={<Plus className="h-4 w-4" />}
              >
                Criar Personagem
              </Button>
            </motion.div>

            {characters.length === 0 ? (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-muted-foreground text-center text-lg px-6">
                  Nenhum agente criado ainda. Crie seu primeiro personagem!
                </p>
              </div>
            ) : (
              <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 content-start">
                {paginatedChars.map((character, i) => (
                  <CharacterCard
                    key={character.id}
                    character={character}
                    index={i}
                    onClick={() => router.visit(`/characters/${character.id}`)}
                    onDelete={(e) => {
                      e.stopPropagation()
                      handleOpenDeleteModal(character)
                    }}
                  />
                ))}
              </div>
            )}

            <PaginationControl currentPage={charPage} totalPages={charTotalPages} onPageChange={setCharPage} />
          </section>

          {/* ── Minhas Campanhas ─────────────────────────────────────────── */}
          <section className="flex flex-1 flex-col p-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Map className="h-6 w-6 text-accent" />
                <h2 className="text-xl font-bold tracking-wide text-foreground">Minhas Campanhas</h2>
              </div>
              <Button
                className="bg-accent text-white font-bold hover:bg-accent/90"
                startContent={<Plus className="h-4 w-4" />}
              >
                Criar Campanha
              </Button>
            </motion.div>

            <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 content-start">
              {paginatedCamps.length === 0 ? (
                <div className="col-span-2 flex flex-1 items-center justify-center">
                  <p className="text-muted-foreground text-center text-lg px-6">
                    Nenhuma campanha encontrada. Crie uma nova campanha!
                  </p>
                </div>
              ) : (
                paginatedCamps.map((campaign, i) => (
                  <CampaignCard key={campaign.id} campaign={campaign} index={i} />
                ))
              )}
            </div>

            <PaginationControl currentPage={campPage} totalPages={campTotalPages} onPageChange={setCampPage} />
          </section>
        </main>
      </div>

      {/* ── Modal: Criar Personagem ────────────────────────────────────────── */}
      {isCreateOpen && (
        <CreateCharacterModal
          classes={classes}
          origins={origins}
          onClose={() => setIsCreateOpen(false)}
        />
      )}

      {/* ── Modal: Confirmar Delete ───────────────────────────────────────── */}
      <Modal
        isOpen={isDeleteOpen}
        onOpenChange={onDeleteOpenChange}
        backdrop="blur"
        classNames={{
          base: 'bg-zinc-950 border border-zinc-800',
          header: 'border-b border-zinc-800',
          footer: 'border-t border-zinc-800',
          closeButton: 'hover:bg-white/5',
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <span className="text-xl font-bold text-white">Deletar Agente</span>
              </ModalHeader>
              <ModalBody>
                <p className="text-gray-300">
                  Tem certeza que deseja deletar o agente{' '}
                  <span className="font-bold text-white">"{characterToDelete?.name}"</span>?
                </p>
                <p className="text-sm text-gray-500">Esta ação é irreversível.</p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose} className="text-zinc-400 hover:text-white">
                  Cancelar
                </Button>
                <Button
                  color="danger"
                  onPress={handleDeleteCharacter}
                  isLoading={isDeleting}
                  className="font-bold text-red-600"
                >
                  DELETAR
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}