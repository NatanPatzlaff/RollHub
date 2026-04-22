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
    Eye, Dog, Coins, Feather, Hammer, Smartphone, Syringe, Megaphone, Glasses, Plane, TestTubes, Medal, Brush
} from 'lucide-react';

export const getOriginIcon = (name: string) => {
    const map: Record<string, any> = {
        // ── A ────────────────────────────────────────────────
        'Acadêmico':               BookOpen,
        'Adepto ao Paranormal':    Eye,
        'Adestrador':              Dog,
        'Agente de Saúde':         Stethoscope,
        'Amnésico':                HelpCircle,
        'Amigo dos Animais':       PawPrint,
        'Apostador':               Coins,
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
        'Escritor Paranormal':     Feather,
        'Executivo':               Briefcase,
        'Explorador':              Map,
        'Experimento':             FlaskConical,
        // ── F ────────────────────────────────────────────────
        'Faz-tudo':                Hammer,
        'Fanático por Criaturas':  Bug,
        'Fotógrafo':               Camera,
        // ── G ────────────────────────────────────────────────
        'Gaudério Abutre':         Bike,
        'Ginasta':                 Activity,
        // ── I ────────────────────────────────────────────────
        'Influenciador':           Smartphone,
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
        'Médico 24 horas':         Syringe,
        'Mercenário':              Target,
        'Mergulhador':             Waves,
        'Militar':                 Shield,
        'Motorista':               Car,
        // ── N ────────────────────────────────────────────────
        'Nerd Entusiasta':         Gamepad2,
        // ── O ────────────────────────────────────────────────
        'Operário':                HardHat,
        // ── P ────────────────────────────────────────────────
        'Palestrinha':             Megaphone,
        'Pesquisador Paranormal':  Glasses,
        'Piloto':                  Plane,
        'Policial':                Siren,
        'Professor':               GraduationCap,
        'Profetizado':             Hourglass,
        'Psicólogo':               Brain,
        // ── Q ────────────────────────────────────────────────
        'Químico':                 TestTubes,
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
        'Treinador':               Medal,
        // ── U ────────────────────────────────────────────────
        'Universitário':           BookMarked,
        // ── V ────────────────────────────────────────────────
        'Vítima':                  HeartCrack,
        // ── Z ────────────────────────────────────────────────
        'Zelador':                 Brush,
    };

    return map[name] || User;
};
