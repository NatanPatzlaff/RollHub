import { Dice5, LogIn, User } from 'lucide-react'
import { router } from '@inertiajs/react'
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react'

interface HomeHeaderProps {
  user?: { name?: string; email?: string } | null
  onLogout: () => void
}

const HomeHeader = ({ user, onLogout }: HomeHeaderProps) => {
  return (
    <header className="flex items-center justify-between border-b border-border px-6 py-4 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <Dice5 className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold tracking-wider text-foreground">
          RollHub
        </h1>
      </div>

      {user ? (
        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-foreground hover:bg-secondary"
            >
              <User className="h-5 w-5" />
              <span className="text-sm font-medium">{user.name ?? user.email}</span>
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Ações do usuário"
            classNames={{ base: 'bg-card border border-border' }}
          >
            <DropdownItem
              key="logout"
              className="text-destructive"
              onPress={onLogout}
            >
              Sair
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      ) : (
        <Button
          className="bg-primary text-white font-bold"
          onPress={() => router.visit('/login')}
        >
          <LogIn className="mr-2 h-4 w-4" />
          Login
        </Button>
      )}
    </header>
  )
}

export default HomeHeader
