import EntityCard from "./EntityCard";
import { Character } from "@/types";
import { Shield, Zap } from "lucide-react";

interface CharacterCardProps {
  character: Character;
  index: number;
}

const CharacterCard = ({ character, index }: CharacterCardProps) => {
  return (
    <EntityCard index={index}>
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-secondary">
          <Shield className="h-7 w-7 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-foreground font-sans">
            {character.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {character.class} • {character.origin}
          </p>
          <div className="mt-1 flex items-center gap-1">
            <Zap className="h-3.5 w-3.5 text-success" />
            <span className="text-xs font-medium text-success">
              {character.nex}% NEX
            </span>
          </div>
        </div>
      </div>
    </EntityCard>
  );
};

export default CharacterCard;
