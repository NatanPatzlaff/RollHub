import { Sword, Wrench, Eye, User, User2 } from 'lucide-react'

export interface ClassStyle {
  color: string
  bg: string
  border: string
  Icon: React.ComponentType<{ className?: string }>
}

const CLASS_STYLES: Record<string, ClassStyle> = {
  'Combatente':   { color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/60',    Icon: Sword  },
  'Especialista': { color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/60',   Icon: Wrench },
  'Ocultista':    { color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/60', Icon: Eye    },
  'Mundano':      { color: 'text-amber-300',  bg: 'bg-amber-500/10',  border: 'border-amber-500/40',  Icon: User2  },
}

const DEFAULT_CLASS_STYLE: ClassStyle = {
  color: 'text-zinc-400',
  bg: 'bg-zinc-800/40',
  border: 'border-zinc-600/60',
  Icon: User,
}

export function getClassStyle(className: string | null | undefined): ClassStyle {
  if (!className) return DEFAULT_CLASS_STYLE
  return CLASS_STYLES[className] ?? DEFAULT_CLASS_STYLE
}
