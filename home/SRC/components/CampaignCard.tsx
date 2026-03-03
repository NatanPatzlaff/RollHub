import EntityCard from "./EntityCard";
import { Campaign } from "@/types";
import { Map, Users } from "lucide-react";

interface CampaignCardProps {
  campaign: Campaign;
  index: number;
}

const statusColors: Record<Campaign["status"], string> = {
  active: "text-success",
  paused: "text-warning",
  completed: "text-muted-foreground",
};

const statusLabels: Record<Campaign["status"], string> = {
  active: "Ativa",
  paused: "Pausada",
  completed: "Finalizada",
};

const CampaignCard = ({ campaign, index }: CampaignCardProps) => {
  return (
    <EntityCard index={index}>
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-secondary">
          <Map className="h-7 w-7 text-accent" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-foreground font-sans">
            {campaign.name}
          </h3>
          <p className="truncate text-sm text-muted-foreground">
            {campaign.description}
          </p>
          <div className="mt-1 flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {campaign.playerCount} jogadores
              </span>
            </div>
            <span className={`text-xs font-medium ${statusColors[campaign.status]}`}>
              {statusLabels[campaign.status]}
            </span>
          </div>
        </div>
      </div>
    </EntityCard>
  );
};

export default CampaignCard;
