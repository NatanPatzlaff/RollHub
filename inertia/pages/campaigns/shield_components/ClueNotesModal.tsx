import { useEffect, useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Switch } from '@heroui/react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { Eye, EyeOff } from 'lucide-react'

interface ClueNotesModalProps {
  isOpen: boolean
  onClose: () => void
  clue: { id: number; content: string; revealed: boolean } | null
  onSave: (clueId: number, data: { content: string; revealed: boolean }) => void
}

export default function ClueNotesModal({ isOpen, onClose, clue, onSave }: ClueNotesModalProps) {
  const [isRevealed, setIsRevealed] = useState(false)

  const editor = useEditor({
    extensions: [StarterKit, TextStyle, Color],
    content: clue?.content || '',
    editorProps: {
      attributes: {
        class: 'prose prose-invert focus:outline-none max-w-none min-h-[300px] text-zinc-300 p-3',
      },
    },
  })

  useEffect(() => {
    if (editor && clue) {
      editor.commands.setContent(clue.content || '')
      setIsRevealed(clue.revealed)
    }
  }, [clue?.id, editor])

  const handleSave = () => {
    if (!clue || !editor) return
    onSave(clue.id, { 
      content: editor.getHTML(), 
      revealed: isRevealed 
    })
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
          <div className="flex items-center justify-between w-full pr-8">
            <div className="flex items-center gap-2">
              <span>Pista</span>
              <span className="text-[10px] font-bold bg-purple-900/40 text-purple-400 border border-purple-800/40 px-2 py-0.5 rounded-full uppercase">
                Investigação
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Switch 
                size="sm" 
                color="success" 
                isSelected={isRevealed}
                onValueChange={setIsRevealed}
                classNames={{
                  label: "text-[10px] font-bold uppercase text-zinc-500"
                }}
              >
                {isRevealed ? "Revelada" : "Oculta"}
              </Switch>
              {isRevealed ? <Eye size={16} className="text-emerald-400" /> : <EyeOff size={16} className="text-zinc-500" />}
            </div>
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
            Salvar Pista
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
