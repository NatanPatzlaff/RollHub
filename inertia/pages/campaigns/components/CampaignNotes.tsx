import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, FileText, ArrowLeft, Trash2 } from 'lucide-react'
import axios from 'axios'
import debounce from 'lodash/debounce'

interface Note {
  id: number
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

interface CampaignNotesProps {
  campaignId: number
}

export default function CampaignNotes({ campaignId }: CampaignNotesProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [activeNoteId, setActiveNoteId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load from database on mount
  useEffect(() => {
    fetchNotes()
  }, [campaignId])

  const fetchNotes = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(`/api/campaigns/${campaignId}/notes`)
      setNotes(response.data)
    } catch (e) {
      console.error('Failed to fetch notes', e)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    try {
      const response = await axios.post(`/api/campaigns/${campaignId}/notes`, {
        title: newTitle,
        content: '',
      })
      const newNote = response.data
      setNotes([newNote, ...notes])
      setNewTitle('')
      setIsCreating(false)
      setActiveNoteId(newNote.id)
    } catch (e) {
      console.error('Failed to create note', e)
    }
  }

  // Debounced update function
  const debouncedUpdate = useCallback(
    debounce(async (id: number, content: string) => {
      try {
        await axios.put(`/api/campaigns/notes/${id}`, { content })
      } catch (e) {
        console.error('Auto-save failed', e)
      }
    }, 1000),
    []
  )

  const handleUpdateNoteContent = (id: number, newContent: string) => {
    // Update local state immediately for visual responsiveness
    setNotes(prevNotes => prevNotes.map(note => 
      note.id === id 
        ? { ...note, content: newContent, updatedAt: 'Salvando...' }
        : note
    ))
    
    // Trigger debounced backend update
    debouncedUpdate(id, newContent)
  }

  const handleDeleteNote = async (id: number) => {
    if (confirm('Tem certeza que deseja apagar esta anotação?')) {
      try {
        await axios.delete(`/api/campaigns/notes/${id}`)
        setNotes(notes.filter(n => n.id !== id))
        if (activeNoteId === id) {
          setActiveNoteId(null)
        }
      } catch (e) {
        console.error('Failed to delete note', e)
      }
    }
  }

  const activeNote = notes.find(n => n.id === activeNoteId)

  return (
    <div className="h-full bg-[#18181B] border border-[#27272A] rounded-b-xl rounded-tr-xl flex flex-col overflow-hidden">
      {/* Header bar */}
      <div className="p-4 border-b border-[#27272A] flex justify-between items-center bg-[#09090B]/50 transition-all">
        <div className="flex items-center gap-3">
          {activeNoteId ? (
            <button
              onClick={() => setActiveNoteId(null)}
              className="p-1.5 hover:bg-[#27272A] rounded-lg text-[#A1A1AA] hover:text-white transition-colors"
              title="Voltar"
            >
              <ArrowLeft size={18} />
            </button>
          ) : (
            <FileText className="text-violet-500" size={20} />
          )}
          
          <h2 className="text-xl font-bold line-clamp-1">
            {activeNoteId ? activeNote?.title : 'Anotações da Campanha'}
          </h2>
        </div>
        
        {!activeNoteId ? (
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-3 py-1.5 rounded-lg font-medium transition-colors text-sm shrink-0"
          >
            <Plus size={16} />
            Nova Anotação
          </button>
        ) : (
          <button
            onClick={() => handleDeleteNote(activeNoteId)}
            className="flex items-center gap-2 text-red-400 hover:bg-red-500/10 px-3 py-1.5 rounded-lg font-medium transition-colors text-sm shrink-0"
          >
            <Trash2 size={16} />
            <span className="hidden sm:inline">Excluir</span>
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar relative flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center text-[#A1A1AA]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500 mb-4"></div>
          </div>
        ) : activeNoteId && activeNote ? (
          // FULL SCREEN EDITOR VIEW
          <motion.div
            key="editor"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex-1 flex flex-col h-full bg-[#09090B]"
          >
            <div className="p-2 border-b border-[#27272A] bg-[#18181B] flex justify-between text-xs text-[#71717A] px-6 py-2">
              <span>Criado: {new Date(activeNote.createdAt).toLocaleString('pt-BR')}</span>
              <span>{activeNote.updatedAt === 'Salvando...' ? 'Salvando...' : `Última edição: ${new Date(activeNote.updatedAt).toLocaleString('pt-BR')}`}</span>
            </div>
            <textarea
              className="flex-1 w-full bg-transparent resize-none p-6 text-[#E4E4E7] focus:outline-none custom-scrollbar leading-relaxed"
              placeholder="Comece a digitar sua anotação aqui... Suas mudanças são salvas automaticamente."
              value={activeNote.content}
              onChange={(e) => handleUpdateNoteContent(activeNote.id, e.target.value)}
              autoFocus
            />
          </motion.div>
        ) : (
          // GRID VIEW
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 p-6 flex flex-col h-full"
          >
            <AnimatePresence>
              {isCreating && (
                <motion.div
                  initial={{ opacity: 0, y: -20, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -20, height: 0 }}
                  className="mb-6 overflow-hidden shrink-0"
                >
                  <form 
                    onSubmit={handleCreateNote}
                    className="bg-[#27272A]/50 border border-violet-500/30 rounded-xl p-4 flex gap-3 items-end"
                  >
                    <div className="flex-1 flex flex-col gap-1.5">
                      <label htmlFor="note-title" className="text-sm font-semibold text-[#A1A1AA]">
                        Título da Anotação
                      </label>
                      <input
                        id="note-title"
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Ex: Mistério da Casa Assombrada..."
                        className="bg-[#09090B] border border-[#3F3F46] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 w-full"
                        autoFocus
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsCreating(false)
                          setNewTitle('')
                        }}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-[#A1A1AA] hover:bg-[#3F3F46] hover:text-white transition"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={!newTitle.trim()}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        Criar
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {notes.length === 0 ? (
              <div className="flex flex-col items-center justify-center flex-1 h-full text-[#A1A1AA] opacity-50 py-10">
                <FileText size={48} className="mb-4" />
                <p className="text-lg font-semibold text-white mb-1">Nenhuma anotação ainda</p>
                <p className="text-sm">Clique em "Nova Anotação" para começar a escrever.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-10">
                <AnimatePresence>
                  {notes.map((note) => (
                    <motion.div
                      key={note.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      onClick={() => setActiveNoteId(note.id)}
                      className="group bg-[#09090B] border border-[#27272A] hover:border-violet-500/50 rounded-xl p-4 flex flex-col gap-3 cursor-pointer transition-colors shadow-sm hover:shadow-violet-900/10 min-h-[160px]"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="font-bold text-white line-clamp-2 leading-tight group-hover:text-violet-400 transition-colors">
                          {note.title}
                        </h3>
                      </div>
                      
                      <div className="flex-1">
                        <p className="text-sm text-[#A1A1AA] line-clamp-3 whitespace-pre-wrap">
                          {note.content || 'Anotação vazia... Clique para editar.'}
                        </p>
                      </div>
                      
                      <div className="flex justify-between items-center pt-3 border-t border-[#27272A]/50 mt-auto">
                        <span className="text-xs font-mono text-[#71717A]">{new Date(note.updatedAt || note.createdAt).toLocaleString('pt-BR')}</span>
                        <div className="text-xs font-medium text-violet-500 group-hover:text-violet-400 opacity-60 group-hover:opacity-100 transition-opacity">
                          Escrever →
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
