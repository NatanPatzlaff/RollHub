import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Shield, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import CharacterCard from "@/components/CharacterCard";
import CampaignCard from "@/components/CampaignCard";
import PaginationControl from "@/components/PaginationControl";
import { Character, Campaign, DashboardProps } from "@/types";

const ITEMS_PER_PAGE = 6;

const mockCharacters: Character[] = [
  { id: "1", name: "Viktor Draven", class: "Ocultista", origin: "Acadêmico", nex: 45 },
  { id: "2", name: "Luna Vasquez", class: "Combatente", origin: "Militar", nex: 30 },
  { id: "3", name: "Rafael Santos", class: "Especialista", origin: "Investigador", nex: 60 },
  { id: "4", name: "Marina Costa", class: "Ocultista", origin: "Religioso", nex: 15 },
  { id: "5", name: "Diego Almeida", class: "Combatente", origin: "Lutador", nex: 75 },
  { id: "6", name: "Isabela Ferreira", class: "Especialista", origin: "Médico", nex: 20 },
  { id: "7", name: "Carlos Ribeiro", class: "Combatente", origin: "Operações Especiais", nex: 50 },
  { id: "8", name: "Ana Beatriz", class: "Ocultista", origin: "Acadêmico", nex: 90 },
];

const mockCampaigns: Campaign[] = [
  { id: "1", name: "O Caso do Matadouro", description: "Uma investigação em um matadouro abandonado", playerCount: 4, status: "active" },
  { id: "2", name: "Sangue no Asfalto", description: "Eventos sobrenaturais nas ruas de São Paulo", playerCount: 5, status: "active" },
  { id: "3", name: "A Maldição de Varginha", description: "Mistérios na pequena cidade mineira", playerCount: 3, status: "paused" },
  { id: "4", name: "Protocolo Minerva", description: "Missão secreta da Ordem", playerCount: 6, status: "completed" },
  { id: "5", name: "Noite Sem Fim", description: "O sol não nasceu em uma cidade do interior", playerCount: 4, status: "active" },
  { id: "6", name: "Ecos do Outro Lado", description: "Portais para outra dimensão se abrem", playerCount: 3, status: "paused" },
  { id: "7", name: "Operação Blackout", description: "Queda de energia revela horrores ocultos", playerCount: 5, status: "active" },
];

const Dashboard = ({
  characters = mockCharacters,
  campaigns = mockCampaigns,
  isAuthenticated = true,
  userName = "Agente",
}: DashboardProps) => {
  const [charPage, setCharPage] = useState(1);
  const [campPage, setCampPage] = useState(1);

  const charTotalPages = Math.ceil(characters.length / ITEMS_PER_PAGE);
  const campTotalPages = Math.ceil(campaigns.length / ITEMS_PER_PAGE);

  const paginatedChars = characters.slice(
    (charPage - 1) * ITEMS_PER_PAGE,
    charPage * ITEMS_PER_PAGE
  );
  const paginatedCamps = campaigns.slice(
    (campPage - 1) * ITEMS_PER_PAGE,
    campPage * ITEMS_PER_PAGE
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header isAuthenticated={isAuthenticated} userName={userName} />

      <main className="flex flex-1 flex-col gap-6 p-6 lg:flex-row lg:gap-0 lg:divide-x lg:divide-border lg:p-0">
        <section className="flex flex-1 flex-col p-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-bold tracking-wide text-foreground">
                Meus Personagens
              </h2>
            </div>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Criar Personagem
            </Button>
          </motion.div>

          <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
            {paginatedChars.map((character, i) => (
              <CharacterCard key={character.id} character={character} index={i} />
            ))}
          </div>

          <PaginationControl
            currentPage={charPage}
            totalPages={charTotalPages}
            onPageChange={setCharPage}
          />
        </section>

        <section className="flex flex-1 flex-col p-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Map className="h-6 w-6 text-accent" />
              <h2 className="text-xl font-bold tracking-wide text-foreground">
                Minhas Campanhas
              </h2>
            </div>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Plus className="mr-2 h-4 w-4" />
              Criar Campanha
            </Button>
          </motion.div>

          <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
            {paginatedCamps.map((campaign, i) => (
              <CampaignCard key={campaign.id} campaign={campaign} index={i} />
            ))}
          </div>

          <PaginationControl
            currentPage={campPage}
            totalPages={campTotalPages}
            onPageChange={setCampPage}
          />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
