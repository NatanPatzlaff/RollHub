import {
    // Combatente
    Target,       // Aniquilador
    Crown,        // Comandante de Campo
    Swords,       // Guerreiro
    Zap,          // Operações Especiais
    Shield,       // Tropa de Choque
    // Especialista
    Crosshair,    // Atirador de Elite
    EyeOff,       // Infiltrador
    Stethoscope,  // Médico de Campo
    Handshake,    // Negociador
    Wrench,       // Técnico
    // Ocultista
    Radio,        // Conduíte
    Flame,        // Flagelador
    BookOpen,     // Graduado
    Brain,        // Intuitivo
    Sword,        // Lâmina Paranormal
    // Fallback
    Star,
} from 'lucide-react'

export const getTrailIcon = (name: string) => {
    const map: Record<string, any> = {
        // ── Combatente ───────────────────────────────────────────
        'Aniquilador': Target,
        'Comandante de Campo': Crown,
        'Guerreiro': Swords,
        'Operações Especiais': Zap,
        'Tropa de Choque': Shield,
        // ── Especialista ─────────────────────────────────────────
        'Atirador de Elite': Crosshair,
        'Infiltrador': EyeOff,
        'Médico de Campo': Stethoscope,
        'Negociador': Handshake,
        'Técnico': Wrench,
        // ── Ocultista ────────────────────────────────────────────
        'Conduíte': Radio,
        'Flagelador': Flame,
        'Graduado': BookOpen,
        'Intuitivo': Brain,
        'Lâmina Paranormal': Sword,
    }

    return map[name] || Star
}
