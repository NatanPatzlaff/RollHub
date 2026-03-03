export interface Character {
  id: string;
  name: string;
  class: string;
  origin: string;
  nex: number;
  imageUrl?: string;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  playerCount: number;
  imageUrl?: string;
  status: "active" | "paused" | "completed";
}

export interface DashboardProps {
  characters: Character[];
  campaigns: Campaign[];
  isAuthenticated?: boolean;
  userName?: string;
}
