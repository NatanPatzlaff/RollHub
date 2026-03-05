import { Button, Chip } from '@heroui/react'
import { Link } from '@inertiajs/react'
import { User, Edit3, Menu } from 'lucide-react'

interface CharacterTopBarProps {
    character: {
        name: string
        nex: number
        class?: { id: number; name: string }
        origin?: { id: number; name: string }
    }
    onEditModal: (step: number) => void
}

export default function CharacterTopBar({ character, onEditModal }: CharacterTopBarProps) {
    return (
        <div className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/">
                        <Button isIconOnly variant="light" className="text-zinc-400 hover:text-white">
                            <User size={20} />
                        </Button>
                    </Link>
                    <div>
                        <h1
                            className="font-bold text-white text-lg leading-tight cursor-pointer hover:text-blue-400 transition-colors flex items-center gap-1 group"
                            onClick={() => onEditModal(4)}
                        >
                            {character.name}
                            <Edit3 size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h1>
                        <div className="text-xs text-zinc-500 flex items-center gap-2">
                            <span
                                className="uppercase tracking-wider cursor-pointer hover:text-blue-400 transition-colors"
                                onClick={() => onEditModal(2)}
                            >
                                {character.class?.name || 'Classe Desconhecida'}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                            <span
                                className="uppercase tracking-wider cursor-pointer hover:text-blue-400 transition-colors"
                                onClick={() => onEditModal(3)}
                            >
                                {character.origin?.name || 'Origem Desconhecida'}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                            <span
                                className="text-blue-400 font-bold cursor-pointer hover:text-blue-300 transition-colors"
                                onClick={() => onEditModal(1)}
                            >
                                {character.nex}% NEX
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button size="sm" variant="flat" className="bg-zinc-800 text-zinc-300">
                        <Menu size={16} />
                    </Button>
                </div>
            </div>
        </div>
    )
}
