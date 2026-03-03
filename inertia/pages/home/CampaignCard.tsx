import { Map, Users } from 'lucide-react'
import EntityCard from './EntityCard'

interface Campaign {
  id: number | string
  name: string
  description: string
  playerCount?: number
  status?: 'active' | 'paused' | 'completed'
}

const statusColors: Record<string, string> = {
  active: 'text-success',
  paused: 'text-warning',
  completed: 'text-muted-foreground',
}

const statusLabels: Record<string, string> = {
  active: 'Ativa',
  paused: 'Pausada',
  completed: 'Finalizada',
}

interface CampaignCardProps {
  campaign: Campaign
  index: number
  onClick?: () => void
}

const CampaignCard = ({ campaign, index, onClick }: CampaignCardProps) => {
  const status = campaign.status ?? 'active'
  return (
    <EntityCard index={index} onClick={onClick}>
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-secondary">
          <Map className="h-7 w-7 text-accent" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-foreground">
            {campaign.name}
          </h3>
          <p className="truncate text-sm text-muted-foreground">
            {campaign.description}
          </p>
          <div className="mt-1 flex items-center gap-3">
            {campaign.playerCount != null && (
              <div className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {campaign.playerCount} jogadores
                </span>
              </div>
            )}
            <span className={`text-xs font-medium ${statusColors[status] ?? 'text-muted-foreground'}`}>
              {statusLabels[status] ?? status}
            </span>
          </div>
        </div>
      </div>
    </EntityCard>
  )
}

export default CampaignCard
