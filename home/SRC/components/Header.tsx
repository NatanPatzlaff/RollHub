import { LogIn, User, Dice5 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  isAuthenticated: boolean;
  userName?: string;
}

const Header = ({ isAuthenticated, userName }: HeaderProps) => {
  return (
    <header className="flex items-center justify-between border-b border-border px-6 py-4">
      <div className="flex items-center gap-3">
        <Dice5 className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold tracking-wider text-foreground">
          RollHub
        </h1>
      </div>
      {isAuthenticated ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 text-foreground hover:bg-secondary">
              <User className="h-5 w-5" />
              <span className="text-sm font-medium">{userName}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card border-border">
            <DropdownMenuItem className="text-foreground focus:bg-secondary">
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem className="text-foreground focus:bg-secondary">
              Configurações
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive focus:bg-secondary">
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <LogIn className="mr-2 h-4 w-4" />
          Login
        </Button>
      )}
    </header>
  );
};

export default Header;
