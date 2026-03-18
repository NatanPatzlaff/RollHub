import React, { useState } from 'react'
import { Head, router } from '@inertiajs/react'
import { Map, Users, Shield, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Card, CardBody, Select, SelectItem, Avatar } from "@heroui/react"

interface Campaign {
  id: number
  name: string
  description: string
  inviteCode: string
  gameMaster: {
    username: string
  }
}

interface Character {
  id: number
  name: string
  level: number
}

interface JoinProps {
  campaign: Campaign
  myCharacters: Character[]
}

export default function JoinCampaign({ campaign, myCharacters }: JoinProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<string>('')
  const [isJoining, setIsJoining] = useState(false)

  const handleJoin = () => {
    if (!selectedCharacter) return
    
    setIsJoining(true)
    router.post('/campaigns/join', {
      campaignId: campaign.id,
      characterId: parseInt(selectedCharacter)
    })
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white font-sans flex items-center justify-center p-4">
      <Head title={`Entrar em ${campaign.name}`} />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <Card className="bg-[#18181B] border-[#27272A] shadow-2xl">
          <CardBody className="p-8">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="bg-[#F97316]/10 p-4 rounded-2xl mb-4">
                <Map size={48} className="text-[#F97316]" />
              </div>
              <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">Convite de Campanha</h1>
              <p className="text-[#A1A1AA]">
                Você foi convidado por <span className="text-white font-bold">{campaign.gameMaster.username}</span> para se juntar à aventura.
              </p>
            </div>

            <div className="bg-[#101012] border border-[#27272A] rounded-xl p-6 mb-8">
              <h2 className="text-xl font-bold text-white mb-1">{campaign.name}</h2>
              <p className="text-sm text-[#A1A1AA] mb-4 italic">"{campaign.description}"</p>
              
              <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-[#52525B]">
                <div className="flex items-center gap-1.5">
                  <Users size={14} />
                  <span>Mesa Privada</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield size={14} />
                  <span>Ordem Paranormal</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase text-[#F97316] mb-3 tracking-widest">Escolha seu Personagem</label>
                
                {myCharacters.length > 0 ? (
                  <Select
                    placeholder="Selecione um personagem"
                    className="max-w-full"
                    selectedKeys={selectedCharacter ? [selectedCharacter] : []}
                    onSelectionChange={(keys) => setSelectedCharacter(Array.from(keys)[0] as string)}
                    classNames={{
                      trigger: "bg-[#101012] border-[#27272A] data-[hover=true]:bg-[#1C1C1E] transition-colors",
                      value: "text-white font-bold",
                      listbox: "bg-[#101012] border-[#27272A]",
                      popoverContent: "bg-[#101012] border-[#27272A]"
                    }}
                  >
                    {myCharacters.map((char) => (
                      <SelectItem 
                        key={char.id} 
                        textValue={char.name}
                        className="text-white data-[hover=true]:bg-[#1C1C1E] data-[selectable=true]:focus:bg-[#1C1C1E]"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar size="sm" name={char.name} className="bg-secondary" />
                          <div className="flex flex-col">
                            <span className="text-sm font-bold">{char.name}</span>
                            <span className="text-[10px] text-[#A1A1AA]">NEX {char.level}%</span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </Select>
                ) : (
                  <div className="bg-danger/10 border border-danger/20 rounded-lg p-4 text-center">
                    <p className="text-danger text-sm font-bold">Você não tem personagens disponíveis para esta campanha.</p>
                    <Button 
                      variant="light" 
                      color="danger" 
                      size="sm" 
                      className="mt-2 font-black"
                      onPress={() => router.visit('/')}
                    >
                      Voltar para Home
                    </Button>
                  </div>
                )}
              </div>

              <Button
                color="primary"
                className="w-full h-14 bg-[#F97316] hover:bg-[#EA580C] text-[#09090B] font-black text-lg uppercase tracking-tighter"
                onPress={handleJoin}
                isDisabled={!selectedCharacter}
                isLoading={isJoining}
                startContent={!isJoining && <CheckCircle2 size={20} />}
              >
                Entrar na Campanha
              </Button>
              
              <p className="text-center text-[10px] text-[#52525B] uppercase font-bold tracking-widest">
                Ao clicar em entrar, sua ficha será visível para o mestre.
              </p>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  )
}
