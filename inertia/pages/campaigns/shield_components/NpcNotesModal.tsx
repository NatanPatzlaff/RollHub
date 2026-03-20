import { useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'

interface NpcNotesModalProps {
  isOpen: boolean
  onClose: () => void
  npc: { id: number; name: string; notes: string | null; isMonster: boolean } | null
  onSave: (npcId: number, notes: string) => void
}

export default function NpcNotesModal({ isOpen, onClose, npc, onSave }: NpcNotesModalProps) {
  const editor = useEditor({
    extensions: [StarterKit, TextStyle, Color],
    content: npc?.notes || '',
    editorProps: {
      attributes: {
        class: 'prose prose-invert focus:outline-none max-w-none min-h-[300px] text-zinc-300 p-3',
      },
    },
  })

  useEffect(() => {
    if (editor && npc) {
      editor.commands.setContent(npc.notes || '')
    }
  }, [npc?.id, editor])

  const handleSave = () => {
    if (!npc || !editor) return
    onSave(npc.id, editor.getHTML())
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      backdrop="blur"
      size="2xl"
      className="bg-[#18181B] border border-[#27272A] text-white"
      classNames={{
        header: "border-b border-[#27272A] uppercase tracking-tighter font-black italic",
        footer: "border-t border-[#27272A]",
      }}
    >
      <ModalContent>
        <ModalHeader>
          <div className="flex items-center gap-2">
            <span>{npc?.name}</span>
            {npc?.isMonster && (
              <span className="text-[10px] font-bold bg-red-900/40 text-red-400 border border-red-800/40 px-2 py-0.5 rounded-full uppercase">
                Monstro
              </span>
            )}
            {!npc?.isMonster && (
              <span className="text-[10px] font-bold bg-blue-900/40 text-blue-400 border border-blue-800/40 px-2 py-0.5 rounded-full uppercase">
                NPC
              </span>
            )}
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="bg-[#09090B] border border-[#27272A] rounded-lg overflow-hidden">
            {/* Toolbar simples */}
            <div className="flex gap-1 p-2 border-b border-[#27272A]">
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBold().run()}
                className={`px-2 py-1 text-xs rounded ${editor?.isActive('bold') ? 'bg-[#F97316] text-black' : 'text-zinc-400 hover:text-white hover:bg-[#27272A]'}`}
              >B</button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                className={`px-2 py-1 text-xs rounded italic ${editor?.isActive('italic') ? 'bg-[#F97316] text-black' : 'text-zinc-400 hover:text-white hover:bg-[#27272A]'}`}
              >I</button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                className={`px-2 py-1 text-xs rounded ${editor?.isActive('bulletList') ? 'bg-[#F97316] text-black' : 'text-zinc-400 hover:text-white hover:bg-[#27272A]'}`}
              >• Lista</button>
            </div>
            <EditorContent editor={editor} />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={onClose} className="text-zinc-400">
            Cancelar
          </Button>
          <Button onPress={handleSave} className="bg-[#F97316] text-black font-bold">
            Salvar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
