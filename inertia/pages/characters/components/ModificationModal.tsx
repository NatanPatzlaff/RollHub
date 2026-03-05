import React, { useState, useMemo } from 'react'
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Chip,
    Card,
    CardBody,
    Divider,
} from '@heroui/react'
import { Edit3, Check, Activity, Plus, Ghost } from 'lucide-react'

interface Modification {
    id: number
    name: string
    description: string
    category: number
    type: string
    element?: string
    protectionTypeRestriction?: string // JSON string
}

interface ItemMod {
    id: number
    modificationId: number
    name: string
    type: string
    element?: string
    category: number
}

interface Item {
    id: number
    name: string
    type: string
    protectionType?: string
    modifications?: ItemMod[]
}

interface ModificationModalProps {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void
    item: Item | null
    itemType: 'Weapon' | 'Protection' | 'Accessory'
    catalog: Modification[]
    isUpdating: boolean
    onToggle: (itemId: number, modId: number, action: 'add' | 'remove') => void
    canApplyModification: (item: any, modCategory: number) => { allowed: boolean; reason?: string }
}

const elementColors: Record<string, string> = {
    Sangue: 'text-red-400',
    Morte: 'text-zinc-400',
    Energia: 'text-purple-400',
    Conhecimento: 'text-amber-400',
    Varia: 'text-zinc-400',
}

const elementBgs: Record<string, string> = {
    Sangue: 'bg-red-500/10 border-red-500/20',
    Morte: 'bg-zinc-500/10 border-zinc-500/20',
    Energia: 'bg-purple-500/10 border-purple-500/20',
    Conhecimento: 'bg-amber-500/10 border-amber-500/20',
    Varia: 'bg-zinc-500/10 border-zinc-500/20',
}

const elementSolidBgs: Record<string, string> = {
    Sangue: 'bg-red-600 border-red-500',
    Morte: 'bg-zinc-800 border-zinc-600',
    Energia: 'bg-purple-600 border-purple-500',
    Conhecimento: 'bg-yellow-600 border-yellow-500',
    Varia: 'bg-zinc-600 border-zinc-500',
}

export const ModificationModal: React.FC<ModificationModalProps> = ({
    isOpen,
    onOpenChange,
    item,
    itemType,
    catalog,
    isUpdating,
    onToggle,
    canApplyModification,
}) => {
    const [modTypeFilter, setModTypeFilter] = useState<'Melhoria' | 'Maldição'>('Melhoria')
    const [modElementFilter, setModElementFilter] = useState<string>('Todos')

    const title = itemType === 'Weapon' ? 'Modificar Arma' :
        itemType === 'Protection' ? 'Modificar Proteção' : 'Modificar Acessório'

    const iconColor = itemType === 'Weapon' ? 'text-blue-400' :
        itemType === 'Protection' ? 'text-sky-400' : 'text-orange-400'

    const iconBg = itemType === 'Weapon' ? 'bg-blue-500/10' :
        itemType === 'Protection' ? 'bg-sky-500/10' : 'bg-orange-500/10'

    if (!item) return null

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="2xl"
            scrollBehavior="inside"
            className="dark"
            classNames={{
                backdrop: 'bg-black/80 backdrop-blur-sm',
                base: 'bg-[#0a0a0a] border border-zinc-800 shadow-2xl rounded-2xl',
                header: 'border-b border-zinc-800 p-6',
                footer: 'border-t border-zinc-800 p-4',
                body: 'p-6 custom-scrollbar',
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`p-1.5 rounded-lg ${iconBg} border border-white/5 ${iconColor}`}>
                                    <Activity size={18} />
                                </span>
                                <h2 className={`text-xl font-bold bg-gradient-to-r ${itemType === 'Weapon' ? 'from-blue-400 to-blue-200' : itemType === 'Protection' ? 'from-sky-400 to-sky-200' : 'from-orange-400 to-orange-200'} bg-clip-text text-transparent`}>
                                    {title}
                                </h2>
                            </div>
                            <p className="text-sm text-zinc-500 font-normal">
                                Gerencie modificações de{' '}
                                <span className="text-zinc-300 font-semibold">{item.name}</span>
                            </p>
                        </ModalHeader>
                        <ModalBody>
                            <div className="space-y-6">
                                {/* Modificações Atuais */}
                                <div>
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3">
                                        Modificações Atuais
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {item.modifications && item.modifications.length > 0 ? (
                                            item.modifications.map((mod: any) => {
                                                const isCurse = mod.type === 'Maldição'
                                                const element = mod.element || 'Varia'
                                                return (
                                                    <Chip
                                                        key={mod.id}
                                                        variant="flat"
                                                        isDisabled={isUpdating}
                                                        onClose={() => onToggle(item.id, mod.modificationId, 'remove')}
                                                        className={isCurse
                                                            ? `${elementBgs[element] || elementBgs.Varia} ${elementColors[element] || elementColors.Varia}`
                                                            : "bg-sky-500/10 text-sky-300 border border-sky-500/20"}
                                                    >
                                                        {mod.name}
                                                    </Chip>
                                                )
                                            })
                                        ) : (
                                            <span className="text-xs text-zinc-600 italic">
                                                Nenhuma modificação aplicada.
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <Divider className="bg-zinc-800/50" />

                                {/* Filtros de Tipos */}
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant={modTypeFilter === 'Melhoria' ? 'solid' : 'bordered'}
                                        onPress={() => { setModTypeFilter('Melhoria'); setModElementFilter('Todos') }}
                                        className={modTypeFilter === 'Melhoria'
                                            ? `${itemType === 'Weapon' ? 'bg-blue-900/50 text-blue-400 border-blue-500/50' : itemType === 'Protection' ? 'bg-sky-900/50 text-sky-400 border-sky-500/50' : 'bg-orange-900/50 text-orange-400 border-orange-500/50'} border`
                                            : 'border-zinc-800 text-zinc-500 hover:border-zinc-700'}
                                    >
                                        Melhorias
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant={modTypeFilter === 'Maldição' ? 'solid' : 'bordered'}
                                        onPress={() => setModTypeFilter('Maldição')}
                                        className={modTypeFilter === 'Maldição'
                                            ? 'bg-red-900/50 text-red-400 border border-red-500/50'
                                            : 'border-zinc-800 text-zinc-500 hover:border-zinc-700'}
                                    >
                                        Maldições
                                    </Button>
                                </div>

                                {modTypeFilter === 'Maldição' && (
                                    <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                                        {['Todos', 'Conhecimento', 'Energia', 'Morte', 'Sangue', 'Varia'].map((element) => (
                                            <Button
                                                key={element}
                                                size="sm"
                                                variant={modElementFilter === element ? 'solid' : 'bordered'}
                                                onPress={() => setModElementFilter(element)}
                                                className={modElementFilter === element
                                                    ? `${elementSolidBgs[element] || elementSolidBgs.Varia} text-white`
                                                    : 'border-zinc-800 text-zinc-500 hover:border-zinc-700'
                                                }
                                            >
                                                {element}
                                            </Button>
                                        ))}
                                    </div>
                                )}

                                {/* Catálogo - SEM overflow interno para evitar double scroll */}
                                <div className="space-y-6">
                                    {modTypeFilter === 'Maldição' ? (
                                        ['Conhecimento', 'Energia', 'Morte', 'Sangue', 'Varia'].map((elemento) => {
                                            if (modElementFilter !== 'Todos' && modElementFilter !== elemento) return null

                                            const mods = catalog.filter((m) => {
                                                if (m.type !== 'Maldição' || m.element !== elemento) return false

                                                // Restrições de tipo
                                                if (itemType === 'Accessory') {
                                                    const typeRestriction = m.protectionTypeRestriction ? JSON.parse(m.protectionTypeRestriction) : null
                                                    if (typeRestriction && !typeRestriction.includes('Acessório')) return false
                                                } else if (itemType === 'Protection') {
                                                    const typeRestriction = m.protectionTypeRestriction ? JSON.parse(m.protectionTypeRestriction) : null
                                                    if (typeRestriction && item.protectionType && !typeRestriction.includes(item.protectionType)) return false
                                                }

                                                return true
                                            })

                                            if (mods.length === 0) return null

                                            return (
                                                <div key={elemento} className="space-y-3">
                                                    <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${elementColors[elemento] || elementColors.Varia}`}>
                                                        <div className={`w-1.5 h-1.5 rounded-full ${elementSolidBgs[elemento] || elementSolidBgs.Varia} animate-pulse`} />
                                                        {elemento}
                                                    </h4>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        {mods.map((mod) => {
                                                            const isActive = item.modifications?.some(
                                                                (m: any) => m.modificationId === mod.id
                                                            )
                                                            const validation = !isActive ? canApplyModification(item, mod.category) : { allowed: true }
                                                            const isBlocked = !isActive && !validation.allowed

                                                            return (
                                                                <Card
                                                                    key={mod.id}
                                                                    isPressable={!isBlocked && !isUpdating}
                                                                    onPress={isBlocked || isUpdating ? undefined : () => onToggle(item.id, mod.id, isActive ? 'remove' : 'add')}
                                                                    className={`border transition-all ${isBlocked
                                                                        ? 'opacity-40 cursor-not-allowed bg-zinc-950/30 border-zinc-800'
                                                                        : isActive
                                                                            ? `${elementBgs[elemento] || elementBgs.Varia} border-${(elementColors[elemento] || 'text-zinc-400').replace('text-', '')}/50`
                                                                            : 'bg-zinc-950/50 border-zinc-800 hover:border-zinc-700'
                                                                        }`}
                                                                >
                                                                    <CardBody className="p-3">
                                                                        <div className="flex justify-between items-start mb-1">
                                                                            <span className={`text-xs font-bold ${isActive ? (elementColors[elemento] || elementColors.Varia) : 'text-zinc-300'}`}>
                                                                                {mod.name}
                                                                            </span>
                                                                            <Chip size="sm" variant="flat" className="text-[10px] h-4 bg-zinc-900 border border-zinc-700 text-zinc-300">
                                                                                +{mod.category} CAT
                                                                            </Chip>
                                                                        </div>
                                                                        <p className="text-[10px] text-zinc-500 leading-relaxed line-clamp-2">
                                                                            {mod.description}
                                                                        </p>
                                                                        <div className="mt-2 flex items-center justify-between">
                                                                            <span className={`text-[9px] uppercase font-bold ${isBlocked ? 'text-red-600' : 'text-zinc-600'}`}>
                                                                                {isBlocked ? validation.reason : 'MALDIÇÃO'}
                                                                            </span>
                                                                            {isActive && <Check size={12} className={elementColors[elemento]} />}
                                                                        </div>
                                                                    </CardBody>
                                                                </Card>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            )
                                        })
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {catalog
                                                .filter((m) => {
                                                    if (m.type === 'Maldição') return false

                                                    // Restrições de tipo
                                                    if (itemType === 'Accessory') {
                                                        const typeRestriction = m.protectionTypeRestriction ? JSON.parse(m.protectionTypeRestriction) : null
                                                        if (typeRestriction && !typeRestriction.includes('Acessório')) return false
                                                    } else if (itemType === 'Protection') {
                                                        const typeRestriction = m.protectionTypeRestriction ? JSON.parse(m.protectionTypeRestriction) : null
                                                        if (typeRestriction && item.protectionType && !typeRestriction.includes(item.protectionType)) return false
                                                    }

                                                    return true
                                                })
                                                .map((mod) => {
                                                    const isActive = item.modifications?.some(
                                                        (m: any) => m.modificationId === mod.id
                                                    )
                                                    const validation = !isActive ? canApplyModification(item, mod.category) : { allowed: true }
                                                    const isBlocked = !isActive && !validation.allowed
                                                    const highlightColor = itemType === 'Weapon' ? 'blue' : itemType === 'Protection' ? 'sky' : 'orange'

                                                    return (
                                                        <Card
                                                            key={mod.id}
                                                            isPressable={!isBlocked && !isUpdating}
                                                            onPress={isBlocked || isUpdating ? undefined : () => onToggle(item.id, mod.id, isActive ? 'remove' : 'add')}
                                                            className={`border transition-all ${isBlocked
                                                                ? 'opacity-40 cursor-not-allowed bg-zinc-950/30 border-zinc-800'
                                                                : isActive
                                                                    ? `bg-${highlightColor}-500/10 border-${highlightColor}-500/50`
                                                                    : 'bg-zinc-950/50 border-zinc-800 hover:border-zinc-700'
                                                                }`}
                                                        >
                                                            <CardBody className="p-3">
                                                                <div className="flex justify-between items-start mb-1">
                                                                    <span className={`text-xs font-bold ${isActive ? `text-${highlightColor}-400` : 'text-zinc-300'}`}>
                                                                        {mod.name}
                                                                    </span>
                                                                    <Chip size="sm" variant="flat" className="text-[10px] h-4 bg-zinc-900 border border-zinc-700 text-zinc-300">
                                                                        +{mod.category} CAT
                                                                    </Chip>
                                                                </div>
                                                                <p className="text-[10px] text-zinc-500 leading-relaxed line-clamp-2">
                                                                    {mod.description}
                                                                </p>
                                                                <div className="mt-2 flex items-center justify-between">
                                                                    <span className={`text-[9px] uppercase font-bold ${isBlocked ? 'text-red-600' : 'text-zinc-600'}`}>
                                                                        {isBlocked ? validation.reason : 'MELHORIA'}
                                                                    </span>
                                                                    {isActive && <Check size={12} className={`text-${highlightColor}-400`} />}
                                                                </div>
                                                            </CardBody>
                                                        </Card>
                                                    )
                                                })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose} size="sm" className="font-bold">
                                Fechar
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}
