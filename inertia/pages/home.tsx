import { Card, CardHeader, CardBody, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Slider, Input } from "@heroui/react";
import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState } from "react";
import { getOriginIcon } from "../utils/originIcons";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Plus, Minus, Trash2 } from "lucide-react";

interface Attributes {
  strength: number;
  agility: number;
  intellect: number;
  presence: number;
  vigor: number;
}

interface Origin {
  id: number;
  name: string;
  description: string;
  trainedSkills: string[] | string | null;
  abilityName: string | null;
  abilityDescription: string | null;
}

export default function Home({ classes, origins, characters = [] }: { classes: any[], origins: Origin[], characters?: any[] }) {
  const { user } = usePage().props as any
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteOpenChange } = useDisclosure();

  const [step, setStep] = useState(1);
  const [nex, setNex] = useState(5);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [focusedOrigin, setFocusedOrigin] = useState<Origin | null>(null);
  const [characterName, setCharacterName] = useState("");
  const [originSearch, setOriginSearch] = useState("");
  const [characterToDelete, setCharacterToDelete] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Function to format ability descriptions with paragraph breaks
  const formatAbilityDescription = (text: string | null) => {
    if (!text) return [];
    
    // Split by sentences (. followed by space) but keep the period
    const sentences = text.split(/(?<=[.!?])\s+/);
    
    // Group sentences into paragraphs (3-4 sentences per paragraph)
    const paragraphs = [];
    for (let i = 0; i < sentences.length; i += 3) {
      paragraphs.push(sentences.slice(i, i + 3).join(' '));
    }
    
    return paragraphs;
  };
  
  // Attribute distribution
  const defaultAttributes: Attributes = { strength: 1, agility: 1, intellect: 1, presence: 1, vigor: 1 };
  const [attributes, setAttributes] = useState<Attributes>(defaultAttributes);
  const BASE_POINTS = 4;
  
  // Calculate available points (gain +1 for each attribute at 0)
  const calculatePoints = () => {
    let points = BASE_POINTS;
    // Points spent = sum of (attribute - 1) for attributes > 1
    Object.values(attributes).forEach(val => {
      if (val > 1) points -= (val - 1);
      if (val === 0) points += 1; // Bonus for reducing to 0
    });
    return points;
  };
  
  const availablePoints = calculatePoints();
  
  const handleAttributeChange = (attr: keyof Attributes, delta: number) => {
    const current = attributes[attr];
    const newValue = current + delta;
    
    // Constraints: min 0, max 5
    if (newValue < 0 || newValue > 5) return;
    
    // Check if we have points to spend (when increasing)
    if (delta > 0) {
      // Calculate how many points this increase would cost
      const pointsNeeded = newValue > 1 ? 1 : 0;
      // Special case: going from 0 to 1 is free (returns the bonus point)
      if (current === 0 && newValue === 1) {
        // This costs 0 points (just returning the bonus)
      } else if (availablePoints < pointsNeeded) {
        return; // Not enough points
      }
    }
    
    setAttributes({ ...attributes, [attr]: newValue });
  };

  const handleLogout = () => {
    router.post('/logout')
  }

  const handleOpenModal = () => {
    if (!user) {
      router.visit('/login');
      return;
    }
    setStep(1);
    setNex(5);
    setSelectedClass(null);
    setFocusedOrigin(null);
    setCharacterName("");
    setOriginSearch("");
    onOpen();
  }

  const handleNextStep = () => {
    // Clear origin search when leaving the origin selection step
    if (step === 3) {
      setOriginSearch("");
    }
    setStep(step + 1);
  }

  const handleSelectClass = (classId: number) => {
    setSelectedClass(classId);
    handleNextStep();
  }

  const confirmOrigin = (originId: number) => {
    setFocusedOrigin(origins.find(o => o.id === originId) || null);
    handleNextStep();
  }

  const submitCharacter = () => {
    router.post('/characters', {
      nex,
      classId: selectedClass,
      originId: focusedOrigin?.id,
      name: characterName
    }, {
      onSuccess: () => {
        onOpenChange(false);
      },
      onError: (errors) => {
        console.error('Character creation failed:', errors);
      }
    })
  }

  const handleOpenDeleteModal = (char: any) => {
    setCharacterToDelete(char);
    onDeleteOpen();
  }

  const handleDeleteCharacter = () => {
    if (!characterToDelete) return;
    
    setIsDeleting(true);
    router.delete(`/characters/${characterToDelete.id}`, {
      onSuccess: () => {
        onDeleteOpenChange(false);
        setCharacterToDelete(null);
        setIsDeleting(false);
      },
      onError: () => {
        setIsDeleting(false);
        console.error('Character deletion failed');
      }
    });
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="flex flex-col gap-6 items-center justify-center py-4">
            <h3 className="text-xl font-bold text-white">Nível de Exposição Paranormal (NEX)</h3>
            <p className="text-gray-400 text-center text-sm mb-4">
              Determine o quão exposto ao paranormal seu agente já foi.
            </p>
            <Slider
              label="NEX"
              step={1}
              maxValue={99}
              minValue={5}
              value={nex}
              onChange={(v) => {
                let val = Array.isArray(v) ? v[0] : v;
                if (val > 95) {
                  val = 99;
                } else {
                  val = Math.round(val / 5) * 5;
                }
                setNex(val);
              }}
              className="max-w-md w-full"
              color="primary"
              size="lg"
              classNames={{
                track: "bg-zinc-800 h-2",
                filler: "bg-blue-500",
                thumb: "bg-blue-500"
              }}
            />
            <div className="text-4xl font-bold text-blue-500 mt-4">{nex}%</div>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-white mb-2">Escolha sua Classe</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {classes.map((c) => (
                <Card
                  key={c.id}
                  isPressable
                  onPress={() => handleSelectClass(c.id)}
                  className="bg-zinc-900 border border-zinc-700 hover:border-blue-500 hover:bg-zinc-800 transition-all p-4"
                >
                  <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                    <h4 className="font-bold text-large text-white">{c.name}</h4>
                  </CardHeader>
                  <CardBody className="overflow-visible py-2">
                    <p className="text-tiny text-gray-400">{c.description}</p>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        );
      case 3:
        const filteredOrigins = origins.filter(origin =>
          origin.name.toLowerCase().includes(originSearch.toLowerCase()) ||
          origin.description.toLowerCase().includes(originSearch.toLowerCase())
        );

        return (
          <div className="relative h-[60vh] w-full flex flex-col">
            <h3 className="text-xl font-bold text-white mb-4">Escolha sua Origem</h3>

            {/* Search Bar */}
            <div className="mb-4 w-full">
              <Input
                isClearable
                placeholder="Pesquisar origem..."
                value={originSearch}
                onValueChange={setOriginSearch}
                className="w-full"
                classNames={{
                  input: "text-white bg-zinc-800 border-zinc-700",
                  inputWrapper: "bg-zinc-800 border border-zinc-700 hover:border-blue-500"
                }}
              />
            </div>

            {/* Backdrop quando card está expandido */}
            <AnimatePresence>
              {focusedOrigin && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setFocusedOrigin(null)}
                  className="fixed inset-0 bg-black/50 z-20"
                />
              )}
            </AnimatePresence>

            {/* Grid of Origins */}
            <motion.div
              layout
              className={`grid grid-cols-2 md:grid-cols-4 gap-4 flex-1 pr-2 pb-20 content-start ${focusedOrigin ? 'overflow-hidden' : 'overflow-y-auto custom-scrollbar'}`}
            >
              {filteredOrigins.length === 0 ? (
                <div className="col-span-4 text-center py-8">
                  <p className="text-gray-400">Nenhuma origem encontrada</p>
                </div>
              ) : (
                filteredOrigins.map((origin) => {
                const Icon = getOriginIcon(origin.name);
                const isFocused = focusedOrigin?.id === origin.id;

                // Se está expandido, não renderiza no grid
                if (isFocused) return null;

                return (
                  <motion.div
                    layout
                    key={origin.id}
                    onClick={() => setFocusedOrigin(origin)}
                    className={`
                        cursor-pointer rounded-xl overflow-hidden border bg-zinc-900 flex flex-col group transition-all
                        relative border-zinc-800 hover:border-blue-500 h-48
                      `}
                  >
                    {/* Image Area */}
                    <motion.div
                      className="bg-zinc-950 flex items-center justify-center p-4 transition-colors w-full h-36 group-hover:bg-zinc-900"
                    >
                      <Icon
                        size={48}
                        className="transition-all duration-500 text-zinc-600 group-hover:text-blue-500"
                      />
                    </motion.div>

                    {/* Content Area */}
                    <div className="bg-zinc-800 h-12 px-4 flex items-center justify-between gap-2 border-t border-zinc-700 w-full">
                      {/* Name */}
                      <span className="text-sm font-bold text-gray-300 uppercase tracking-wider truncate group-hover:text-white">
                        {origin.name}
                      </span>

                      {/* Quick Select Button */}
                      <div className="shrink-0 rounded-xl overflow-hidden">
                        <Button
                          color="primary"
                          radius="xl"
                          size="md"
                          className="shadow-lg shadow-blue-500/20 font-bold"
                          startContent={<Check size={18} />}
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmOrigin(origin.id);
                          }}
                          title="Escolher origem"
                        >
                          ESCOLHER
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
              )}
            </motion.div>

            {/* Expanded Origin Card - renderizado fora da grid */}
            <AnimatePresence>
              {focusedOrigin && (() => {
                const Icon = getOriginIcon(focusedOrigin.name);
                return (
                  <motion.div
                    key="expanded-origin"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] h-auto max-h-[80vh] z-30 rounded-xl overflow-hidden border border-blue-500 bg-zinc-900 shadow-2xl flex flex-col"
                  >
                    {/* Header with image */}
                    <div className="bg-zinc-950 flex items-center justify-center p-6 border-b border-zinc-700">
                      <Icon size={64} className="text-blue-500" />
                    </div>

                    {/* Title */}
                    <div className="px-6 pt-4 pb-2">
                      <h2 className="text-2xl font-bold text-white">{focusedOrigin.name}</h2>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-6">
                      <div className="space-y-4">
                        {/* Description */}
                        <p className="text-gray-400 text-sm leading-relaxed border-b border-zinc-700 pb-4">
                          {focusedOrigin.description}
                        </p>

                        {/* Skills */}
                        <div>
                          <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            Perícias Treinadas
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {(() => {
                              const skills = typeof focusedOrigin.trainedSkills === 'string'
                                ? JSON.parse(focusedOrigin.trainedSkills || '[]')
                                : (focusedOrigin.trainedSkills || []);
                              return skills.map((skillName: string, i: number) => (
                                <span key={i} className="px-2 py-1 bg-zinc-950 rounded text-xs text-gray-300 border border-zinc-700">
                                  {skillName}
                                </span>
                              ));
                            })()}
                          </div>
                        </div>

                        {/* Abilities */}
                        {focusedOrigin.abilityName && (
                          <div>
                            <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                              Poder da Origem
                            </h4>
                            <div className="bg-zinc-950/50 p-4 rounded border border-zinc-700/50 relative overflow-hidden group/ability">
                              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 group-hover/ability:bg-blue-400 transition-colors"></div>
                              <strong className="block text-white text-sm mb-3 pl-2">{focusedOrigin.abilityName}</strong>
                              <div className="text-gray-400 text-xs pl-2 space-y-3 leading-relaxed">
                                {formatAbilityDescription(focusedOrigin.abilityDescription).map((paragraph, idx) => (
                                  <p key={idx}>{paragraph}</p>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer with action button */}
                    <div className="px-6 py-4 border-t border-zinc-700 bg-zinc-800/50 flex gap-2">
                      <Button
                        variant="bordered"
                        className="flex-1 border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600"
                        onPress={() => setFocusedOrigin(null)}
                      >
                        Fechar
                      </Button>
                      <Button
                        color="primary"
                        className="flex-1 font-bold"
                        startContent={<Check size={18} />}
                        onClick={(e) => {
                          confirmOrigin(focusedOrigin.id);
                        }}
                      >
                        CONFIRMAR ORIGEM
                      </Button>
                    </div>
                  </motion.div>
                );
              })()}
            </AnimatePresence>
          </div>
        );
      case 4:
        return (
          <div className="flex flex-col gap-6 items-center justify-center py-4">
            <h3 className="text-xl font-bold text-white">Nome do Agente</h3>
            <p className="text-gray-400 text-center text-sm mb-4">
              Dê um nome ao seu novo agente.
            </p>
            <Input
              aria-label="Nome do Agente"
              placeholder="Ex: Arthur Cervero"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              className="max-w-md w-full"
              size="lg"
              classNames={{
                input: "text-white",
                inputWrapper: "bg-zinc-900 border-zinc-700 hover:border-blue-500 focus-within:!border-blue-500",
              }}
            />
            <Button
              color="primary"
              size="lg"
              className="font-bold mt-4 w-full max-w-md"
              onPress={submitCharacter}
            >
              CRIAR AGENTE
            </Button>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <>
      <Head title="Início - Escudo do Mestre" />

      <div className="min-h-screen bg-black flex items-center justify-center p-4 relative">
        {/* Botão de Login / Logout */}
        <div className="absolute top-4 right-4 z-50">
          {user ? (
            <Button
              color="danger"
              variant="flat"
              radius="full"
              className="font-bold"
              onPress={handleLogout}
            >
              LOGOUT
            </Button>
          ) : (
            <Link href="/login">
              <Button color="primary" variant="ghost" radius="full" className="font-bold hover:text-black">
                LOGIN
              </Button>
            </Link>
          )}
        </div>
        <div className="flex flex-row gap-6 w-full max-w-7xl h-[80vh]">

          {/* Card Agentes */}
          <Card className="flex-1 bg-gradient-to-br from-blue-900/50 to-slate-900 border border-blue-500/30 hover:border-blue-500 transition-all duration-300 group cursor-pointer">
            <CardHeader className="absolute z-10 top-1 w-full !items-start">
              <div className="flex flex-col">
                <p className="text-tiny text-blue-300 uppercase font-bold tracking-widest">Acesso Restrito</p>
                <h4 className="text-white font-medium text-4xl mt-2 group-hover:text-blue-400 transition-colors">Agentes</h4>
              </div>
              <div className="absolute top-4 right-4">
                <Button
                  size="sm"
                  className="font-bold bg-zinc-900 text-white hover:bg-zinc-800"
                  onPress={handleOpenModal}
                >
                  NOVO AGENTE
                </Button>
              </div>
            </CardHeader>
            <CardBody className="overflow-visible p-0 relative h-full flex flex-col pt-24 pb-4 px-4">
              <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
              
              {characters && characters.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto custom-scrollbar z-10 h-full content-start">
                  {characters.map((char) => (
                    <div 
                      key={char.id}
                      onClick={() => router.visit(`/characters/${char.id}`)}
                      className="bg-zinc-900/80 border border-zinc-700 hover:border-blue-400 transition-colors rounded-lg p-4 flex flex-col gap-2 cursor-pointer group"
                    >
                      <div className="flex justify-between items-start">
                        <h5 className="text-white font-bold text-lg truncate flex-1 group-hover:text-blue-400">{char.name || 'Agente Sem Nome'}</h5>
                        <div className="flex items-center gap-2">
                          <span className="bg-blue-900/50 text-blue-300 text-xs px-2 py-1 rounded font-bold">NEX {char.nex}%</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDeleteModal(char);
                            }}
                            className="p-1.5 rounded bg-red-500/10 text-red-600 hover:bg-red-500/20 hover:text-red-500 transition-colors"
                            title="Deletar personagem"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 text-sm text-gray-400">
                        <p>Classe: <span className="text-gray-300">{char.class?.name || 'N/A'}</span></p>
                        <p>Origem: <span className="text-gray-300">{char.origin?.name || 'N/A'}</span></p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-gray-400 text-lg px-10 text-center z-10">
                    Acesse suas fichas, gerencie seus status e visualize missões ativas.
                  </p>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Card Mestre */}
          <Card className="flex-1 bg-gradient-to-br from-red-900/50 to-slate-900 border border-red-500/30 hover:border-red-500 transition-all duration-300 group cursor-pointer">
            <CardHeader className="absolute z-10 top-1 w-full !items-start">
              <div className="flex flex-col">
                <p className="text-tiny text-red-300 uppercase font-bold tracking-widest">Apenas Autorizados</p>
                <h4 className="text-white font-medium text-4xl mt-2 group-hover:text-red-400 transition-colors">Mestre</h4>
              </div>
              <div className="absolute top-4 right-4">
                <Button size="sm" className="font-bold bg-zinc-900 text-white hover:bg-zinc-800">
                  NOVA CAMPANHA
                </Button>
              </div>
            </CardHeader>
            <CardBody className="overflow-visible p-0 relative h-full flex items-center justify-center">
              <div className="absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              <p className="text-gray-400 text-lg px-10 text-center z-10">
                Gerencie combates, NPCs, cenários e o destino dos agentes.
              </p>
            </CardBody>
          </Card>

        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="5xl"
        backdrop="blur"
        classNames={{
          base: "bg-zinc-950 border border-zinc-800 h-[80vh]",
          header: "border-b border-zinc-800",
          footer: "border-t border-zinc-800",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <span className="text-2xl font-bold text-white">Novo Agente</span>
                <span className="text-sm text-gray-500 uppercase tracking-widest">
                  Passo {step} de 4
                </span>
              </ModalHeader>
              <ModalBody className={`py-6 ${focusedOrigin ? 'overflow-hidden' : 'overflow-y-auto'} custom-scrollbar`}>
                {renderStepContent()}
              </ModalBody>
              <ModalFooter>
                {step === 1 && (
                  <Button color="primary" onPress={handleNextStep}>
                    Próximo
                  </Button>
                )}
                {/* Steps 2 and 3 advance automatically on selection, but we could add back buttons if needed */}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Modal de Confirmação de Delete */}
      <Modal
        isOpen={isDeleteOpen}
        onOpenChange={onDeleteOpenChange}
        backdrop="blur"
        classNames={{
          base: "bg-zinc-950 border border-zinc-800",
          header: "border-b border-zinc-800",
          footer: "border-t border-zinc-800",
          closeButton: "hover:bg-white/5",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <span className="text-xl font-bold text-white">Deletar Agente</span>
              </ModalHeader>
              <ModalBody>
                <p className="text-gray-300">
                  Tem certeza que deseja deletar o agente <span className="font-bold text-white">"{characterToDelete?.name}"</span>?
                </p>
                <p className="text-sm text-gray-500">Esta ação é irreversível.</p>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="light"
                  onPress={onClose}
                  className="text-zinc-400 hover:text-white"
                >
                  Cancelar
                </Button>
                <Button
                  color="danger"
                  onPress={handleDeleteCharacter}
                  isLoading={isDeleting}
                  className="font-bold text-red-600"
                >
                  DELETAR
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}