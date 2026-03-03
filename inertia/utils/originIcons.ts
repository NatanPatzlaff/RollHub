import {
    // já existentes
    BookOpen, Stethoscope, HelpCircle, Palette, Dumbbell,
    UserX, Ghost, Tent, Wrench, Briefcase,
    Search, Sword, Target, Shield, HardHat,
    Siren, Church, Building2, Monitor, Sprout,
    Shuffle, GraduationCap, HeartCrack,
    // novos
    ChefHat, Microscope, Clapperboard, PenLine, Bike,
    Activity, Newspaper, Crown, Satellite, BookMarked,
    Zap, PawPrint, Rocket, Skull, Backpack, Sparkles,
    Handshake, Map, FlaskConical, Bug, Camera, Cpu,
    Star, Moon, TreePine, Waves, Car, Gamepad2,
    Brain, Hourglass, FileSearch,
    User,
} from 'lucide-react';

export const getOriginIcon = (name: string) => {
    const map: Record<string, any> = {
        // ── A ────────────────────────────────────────────────
        'Acadêmico':               BookOpen,
        'Agente de Saúde':         Stethoscope,
        'Amnésico':                HelpCircle,
        'Amigo dos Animais':       PawPrint,
        'Artista':                 Palette,
        'Astronauta':              Rocket,
        'Atleta':                  Dumbbell,
        // ── C ────────────────────────────────────────────────
        'Chef':                    ChefHat,
        'Chef do Outro Lado':      Skull,
        'Cientista Forense':       Microscope,
        'Colegial':                Backpack,
        'Cosplayer':               Sparkles,
        'Criminoso':               UserX,
        'Cultista Arrependido':    Ghost,
        // ── D ────────────────────────────────────────────────
        'Desgarrado':              Tent,
        'Diplomata':               Handshake,
        'Dublê':                   Clapperboard,
        // ── E ────────────────────────────────────────────────
        'Engenheiro':              Wrench,
        'Escritor':                PenLine,
        'Executivo':               Briefcase,
        'Explorador':              Map,
        'Experimento':             FlaskConical,
        // ── F ────────────────────────────────────────────────
        'Fanático por Criaturas':  Bug,
        'Fotógrafo':               Camera,
        // ── G ────────────────────────────────────────────────
        'Gaudério Abutre':         Bike,
        'Ginasta':                 Activity,
        // ── I ────────────────────────────────────────────────
        'Inventor Paranormal':     Cpu,
        'Investigador':            Search,
        // ── J ────────────────────────────────────────────────
        'Jornalista':              Newspaper,
        'Jovem Místico':           Star,
        // ── L ────────────────────────────────────────────────
        'Legista do Turno da Noite': Moon,
        'Lutador':                 Sword,
        // ── M ────────────────────────────────────────────────
        'Magnata':                 Crown,
        'Mateiro':                 TreePine,
        'Mercenário':              Target,
        'Mergulhador':             Waves,
        'Militar':                 Shield,
        'Motorista':               Car,
        // ── N ────────────────────────────────────────────────
        'Nerd Entusiasta':         Gamepad2,
        // ── O ────────────────────────────────────────────────
        'Operário':                HardHat,
        // ── P ────────────────────────────────────────────────
        'Policial':                Siren,
        'Professor':               GraduationCap,
        'Profetizado':             Hourglass,
        'Psicólogo':               Brain,
        // ── R ────────────────────────────────────────────────
        'Religioso':               Church,
        'Repórter Investigativo':  FileSearch,
        'Revoltado':               Zap,
        // ── S ────────────────────────────────────────────────
        'Servidor Público':        Building2,
        // ── T ────────────────────────────────────────────────
        'T.I.':                    Monitor,
        'Teórico da Conspiração':  Satellite,
        'Trabalhador Rural':       Sprout,
        'Trambiqueiro':            Shuffle,
        // ── U ────────────────────────────────────────────────
        'Universitário':           BookMarked,
        // ── V ────────────────────────────────────────────────
        'Vítima':                  HeartCrack,
    };

    return map[name] || User;
};
