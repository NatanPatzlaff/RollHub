import { type ReactNode } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/react'

/** Props do componente BaseModal — wrapper genérico de modal */
export interface BaseModalProps {
  isOpen: boolean
  onClose: () => void
  maxWidth?: string
  height?: string
  title?: ReactNode
  description?: ReactNode
  footer?: ReactNode
  children?: ReactNode
  bodyClassName?: string
}

/**
 * Modal reutilizável com título, descrição, corpo e rodapé opcionais.
 * Envolve o Modal do HeroUI aplicando estilização padrão do projeto.
 */
export default function BaseModal({
  isOpen,
  onClose,
  maxWidth = 'max-w-lg',
  height,
  title,
  description,
  footer,
  children,
  bodyClassName,
}: BaseModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
      placement="center"
      scrollBehavior="inside"
      classNames={{
        base: `bg-zinc-900 border border-zinc-800 rounded-2xl ${maxWidth}${height ? ` ${height} !max-h-[90vh]` : ''}`,
        header: 'border-b border-zinc-800',
        body: `py-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-700 [&::-webkit-scrollbar-thumb]:rounded-full${bodyClassName ? ` ${bodyClassName}` : ''}`,
        footer: 'border-t border-zinc-800',
        closeButton: 'text-zinc-400 hover:text-white',
      }}
    >
      <ModalContent>
        {title && (
          <ModalHeader className="flex flex-col gap-1">
            {typeof title === 'string' ? (
              <h2 className="text-xl font-bold text-white">{title}</h2>
            ) : (
              title
            )}
            {description &&
              (typeof description === 'string' ? (
                <p className="text-sm text-zinc-400">{description}</p>
              ) : (
                description
              ))}
          </ModalHeader>
        )}

        <ModalBody>{children}</ModalBody>

        {footer && <ModalFooter>{footer}</ModalFooter>}
      </ModalContent>
    </Modal>
  )
}
