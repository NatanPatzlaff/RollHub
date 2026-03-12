import { Head, router, usePage } from '@inertiajs/react'
import { m } from 'framer-motion'
import { Button, Card, CardBody, CardHeader, Divider, Select, SelectItem } from '@heroui/react'
import { Map, Users, Shield, Check, UserCircle } from 'lucide-react'
import { useState } from 'react'

interface Props {
  campaign: {
    id: number
    name: string
    description: string | null
    gameMaster: {
      id: number
      username: string
    }
    playerCount: number
  }
  token: string
  myCharacters: Array<{ id: number; name: string }>
}

export default function InviteShow({ campaign, token, myCharacters }: Props) {
  const { user } = usePage().props as any
  const errors = usePage().props.errors as any
  const [selectedCharacter, setSelectedCharacter] = useState<string>('')

  const handleJoin = () => {
    if (!user) {
      router.visit(`/login?redirect=/invite/${token}`)
      return
    }

    if (!selectedCharacter && myCharacters.length > 0) {
      alert('Por favor, selecione um personagem para entrar na campanha.')
      return
    }

    router.post(`/invite/${token}/accept`, {
      characterId: selectedCharacter
    })
  }

  return (
    <>
      <Head title={`Convite: ${campaign.name}`} />

      <div className="flex min-h-screen items-center justify-center bg-background p-4 sm:p-6">
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px]" />
          <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
        </div>

        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-xl"
        >
          <Card className="bg-zinc-950/60 border-zinc-800 backdrop-blur-xl">
            <CardHeader className="flex flex-col gap-4 p-8 text-center bg-zinc-900/40">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-accent/20 shadow-xl shadow-accent/10 ring-1 ring-accent/30">
                <Map className="h-10 w-10 text-accent" />
              </div>
              <div>
                <p className="text-xs font-bold text-accent uppercase tracking-[0.2em] mb-1">
                  Convite para Campanha
                </p>
                <h1 className="text-3xl font-black text-white tracking-tight">
                  {campaign.name}
                </h1>
              </div>
            </CardHeader>

            <Divider className="bg-zinc-800" />

            <CardBody className="p-8 gap-8">
              {(errors?.invite || errors?.characterId) && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-medium flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  {errors.invite || errors.characterId}
                </div>
              )}

              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/50">
                  <div className="p-2.5 bg-zinc-800 rounded-xl text-zinc-400">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-300">Mestre da Mesa</h4>
                    <p className="text-lg text-white font-medium">{campaign.gameMaster.username}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/50">
                  <div className="p-2.5 bg-zinc-800 rounded-xl text-zinc-400">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-300">Participantes</h4>
                    <p className="text-lg text-white font-medium">{campaign.playerCount} agentes na ativa</p>
                  </div>
                </div>

                {user && myCharacters.length > 0 && (
                  <div className="space-y-3 p-4 rounded-2xl bg-accent/5 border border-accent/20">
                    <div className="flex items-center gap-2 mb-2">
                       <UserCircle className="h-4 w-4 text-accent" />
                       <h4 className="text-sm font-bold text-accent uppercase tracking-wider">Escolha seu Personagem</h4>
                    </div>
                    <Select
                      labelPlacement="outside"
                      placeholder="Selecione seu personagem"
                      className="max-w-full"
                      selectedKeys={selectedCharacter ? [selectedCharacter] : []}
                      onChange={(e) => setSelectedCharacter(e.target.value)}
                      variant="bordered"
                      classNames={{
                        trigger: "bg-zinc-900 border-zinc-800 text-white min-h-[48px]",
                        value: "text-white font-medium",
                        popoverContent: "bg-zinc-900 border-zinc-800",
                      }}
                    >
                      {myCharacters.map((char) => (
                        <SelectItem key={char.id} textValue={char.name}>
                          {char.name}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                )}

                {user && myCharacters.length === 0 && (
                  <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl text-orange-400 text-sm">
                    Você não possui personagens disponíveis para esta campanha.
                    <Button 
                      variant="light" 
                      color="warning" 
                      size="sm" 
                      className="mt-2"
                      onPress={() => router.visit('/')}
                    >
                      Criar um Personagem
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  onPress={handleJoin}
                  size="lg"
                  isDisabled={user && myCharacters.length === 0}
                  className="bg-accent text-white font-black text-lg py-8 rounded-2xl shadow-2xl shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  startContent={<Check className="h-6 w-6" />}
                >
                  {user ? 'ENTRAR NA CAMPANHA' : 'LOGAR PARA ENTRAR'}
                </Button>
                <p className="text-center text-xs text-zinc-500">
                  {user ? (
                    `Agente: ${user.fullName || user.email}`
                  ) : (
                    'Necessário autenticação oficial da Ordem'
                  )}
                </p>
              </div>
            </CardBody>
          </Card>
        </m.div>
      </div>
    </>
  )
}
