import { useState, FormEvent } from 'react'
import { router } from '@inertiajs/react'
import {
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Button, Input, Textarea
} from '@heroui/react'

interface CampaignSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  campaign: any
}

export default function CampaignSettingsModal({ isOpen, onClose, campaign }: CampaignSettingsModalProps) {
  const [name, setName] = useState(campaign?.name || '')
  const [description, setDescription] = useState(campaign?.description || '')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    router.put(`/campaigns/${campaign.id}`, { name, description }, {
      onSuccess: () => {
        setIsLoading(false)
        onClose()
      },
      onError: () => {
        setIsLoading(false)
      }
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      backdrop="blur"
      classNames={{
        base: 'bg-zinc-950 border border-zinc-800',
        header: 'border-b border-zinc-800',
        footer: 'border-t border-zinc-800',
        closeButton: 'hover:bg-white/5',
      }}
    >
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader className="flex flex-col gap-1">
            <span className="text-xl font-bold text-white">Configurações da Campanha</span>
          </ModalHeader>
          <ModalBody className="py-6 flex flex-col gap-4">
            <Input
              label="Nome da Campanha"
              placeholder="Digite o nome da campanha"
              value={name}
              onValueChange={setName}
              isRequired
              variant="bordered"
              classNames={{
                inputWrapper: 'border-zinc-800 focus-within:border-primary',
                input: 'text-white',
                label: 'text-zinc-400'
              }}
            />
            <Textarea
              label="Descrição (opcional)"
              placeholder="Uma breve descrição da sua campanha..."
              value={description}
              onValueChange={setDescription}
              variant="bordered"
              classNames={{
                inputWrapper: 'border-zinc-800 focus-within:border-primary',
                input: 'text-white text-sm',
                label: 'text-zinc-400'
              }}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose} className="text-zinc-400 hover:text-white">
              Cancelar
            </Button>
            <Button
              color="primary"
              type="submit"
              isLoading={isLoading}
              className="font-bold text-white"
            >
              Salvar
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
