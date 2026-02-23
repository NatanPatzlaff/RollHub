export const skillDescriptions: Record<string, Array<{ title: string; description: string }>> = {
  'Acrobacia': [
    {
      title: 'Amortecer Queda (Veterano, DT 15)',
      description: 'Quando cai, você pode gastar uma reação e fazer um teste de Acrobacia para reduzir o dano. Se passar, reduz o dano da queda em 1d6, mais 1d6 para cada 5 pontos pelos quais o resultado do teste exceder a DT. Se reduzir o dano a zero, você cai de pé.'
    },
    {
      title: 'Equilíbrio',
      description: 'Se estiver andando por superfícies precárias, você precisa fazer testes de Acrobacia para não cair. Cada ação de movimento exige um teste. Se passar, você avança metade do seu deslocamento. Se falhar, não avança. Se falhar por 5 ou mais, cai.'
    },
    {
      title: 'Escapar',
      description: 'Você pode escapar de amarras. A DT é igual ao resultado do teste de Agilidade de quem o amarrou +10, se você estiver preso por cordas, ou 30, se você estiver preso por algemas. Este uso gasta uma ação completa.'
    },
    {
      title: 'Levantar-se Rapidamente (Treinado, DT 20)',
      description: 'Se estiver caído, você pode fazer um teste de Acrobacia para ficar de pé. Você precisa ter uma ação de movimento disponível. Se passar no teste, se levanta como uma ação livre. Se falhar, gasta sua ação de movimento, mas continua caído.'
    },
    {
      title: 'Passar por Espaço Apertado (Treinado, DT 25)',
      description: 'Você pode se espremer por lugares estreitos, por onde apenas sua cabeça normalmente passaria. Você gasta uma ação completa e avança metade do deslocamento.'
    },
    {
      title: 'Passar por Inimigo',
      description: 'Você pode atravessar um espaço ocupado por um inimigo como parte de seu movimento. Faça um teste de Acrobacia oposto ao teste de Acrobacia, Iniciativa ou Luta do oponente (o que for melhor). Se você passar, atravessa o espaço; se falhar, não atravessa e sua ação de movimento termina.'
    }
  ],
  'Adestramento': [
    {
      title: 'Acalmar Animal (DT 25)',
      description: 'Você acalma um animal nervoso ou agressivo. Isso permite a você controlar um touro furioso ou convencer um cão de guarda a não atacá-lo. Este uso gasta uma ação completa.'
    },
    {
      title: 'Cavalgar',
      description: 'Você pode andar a cavalo. Montar exige uma ação de movimento, mas você pode montar como uma ação livre com um teste de Adestramento contra DT 20.'
    },
    {
      title: 'Manejar Animal (DT 15)',
      description: 'Você faz um animal realizar uma tarefa para a qual foi treinado. Isso permite usar Adestramento como Pilotagem para veículos de tração animal, como carroças. Este uso gasta uma ação de movimento.'
    }
  ],
  'Artes': [
    {
      title: 'Impressionar',
      description: 'Faça um teste de Artes oposto pelo teste de Vontade de quem você está tentando impressionar. Se você passar, recebe +2 em testes de perícia originalmente baseadas em Presença contra essa pessoa na mesma cena.'
    }
  ],
  'Atletismo': [
    {
      title: 'Corrida',
      description: 'Gaste uma ação completa e faça um teste de Atletismo. Você avança um número de quadrados de 1,5m igual ao seu deslocamento mais o resultado do teste. Você só pode correr em linha reta e não pode correr em terreno difícil.'
    },
    {
      title: 'Escalar',
      description: 'Gaste uma ação de movimento e faça um teste de Atletismo. Se passar, você avança metade do seu deslocamento. Se falhar, não avança. Se falhar por 5 ou mais, você cai.'
    },
    {
      title: 'Natação',
      description: 'Se estiver na água, você precisa gastar uma ação de movimento e fazer um teste de Atletismo por rodada para não afundar. A DT é 10 para água calma, 15 para agitada e 20 ou mais para tempestuosa.'
    },
    {
      title: 'Saltar',
      description: 'Você pode pular sobre buracos ou obstáculos ou alcançar algo elevado. Para um salto longo, a DT é 5 por quadrado de 1,5m. Para um salto em altura, a DT é 15 por quadrado de 1,5m. Saltar é parte de seu movimento.'
    }
  ],
  'Atualidades': [
    {
      title: 'Informação',
      description: 'Você é um conhecedor de assuntos gerais, como política, esporte e entretenimento. A DT é 15 para informações comuns, 20 para informações específicas, e 25 para informações quase desconhecidas.'
    }
  ],
  'Ciências': [
    {
      title: 'Conhecimento Científico',
      description: 'Você estudou diversos campos científicos como matemática, física, química e biologia. Questões simples não exigem teste. Questões complexas exigem teste contra DT 20. Questões envolvendo campos experimentais exigem teste contra DT 30.'
    }
  ],
  'Crime': [
    {
      title: 'Arrombar',
      description: 'Você abre uma fechadura trancada. A DT é 20 para fechaduras comuns, 25 para reforçadas e 30 para avançadas. Este uso gasta uma ação completa. Exige um kit.'
    },
    {
      title: 'Furto (DT 20)',
      description: 'Você pega um objeto de outra pessoa (ou planta um objeto nas posses dela). Gaste uma ação padrão e faça um teste de Crime.'
    },
    {
      title: 'Ocultar',
      description: 'Você esconde um objeto em você mesmo. Gaste uma ação padrão e faça um teste de Crime oposto pelo teste de Percepção de qualquer um que possa vê-lo.'
    },
    {
      title: 'Sabotar (Veterano)',
      description: 'Você desabilita um dispositivo. Uma ação simples tem DT 20. Uma ação complexa tem DT 30. Este uso gasta 1d4+1 ações completas. Exige um kit.'
    }
  ],
  'Diplomacia': [
    {
      title: 'Acalmar (Treinado, DT 20)',
      description: 'Você estabiliza um personagem adjacente que esteja enlouquecendo, fazendo com que ele fique com Sanidade 1. Este uso gasta uma ação padrão.'
    },
    {
      title: 'Mudar Atitude',
      description: 'Você muda a categoria de atitude de um NPC em relação a você. Faça um teste de Diplomacia oposto pelo teste de Vontade do alvo. Este uso gasta um minuto.'
    },
    {
      title: 'Persuasão (DT 20)',
      description: 'Você convence uma pessoa a fazer alguma coisa. Se for custosa sofre –5. Se for perigosa sofre –10 ou falha automaticamente. Este uso gasta um minuto ou mais.'
    }
  ],
  'Enganação': [
    {
      title: 'Disfarce (Treinado)',
      description: 'Você muda sua aparência ou a de outra pessoa. Faça um teste de Enganação oposto pelo teste de Percepção. Um disfarce exige pelo menos dez minutos e um kit.'
    },
    {
      title: 'Falsificação (Veterano)',
      description: 'Você falsifica um documento. Faça um teste de Enganação oposto pelo teste de Percepção. Se o documento é muito complexo, você sofre –2d no teste.'
    },
    {
      title: 'Fintar (Treinado)',
      description: 'Você pode gastar uma ação padrão e fazer um teste de Enganação oposto a um teste de Reflexos. Se passar, ele fica desprevenido contra seu próximo ataque.'
    },
    {
      title: 'Insinuação (DT 20)',
      description: 'Você fala algo para alguém sem que outras pessoas entendam. Se passar, o receptor entende sua mensagem.'
    },
    {
      title: 'Intriga (DT 20)',
      description: 'Você espalha uma fofoca. Intrigas muito improváveis têm DT 30. Este uso exige pelo menos um dia.'
    },
    {
      title: 'Mentir',
      description: 'Você faz uma pessoa acreditar em algo que não é verdade. Seu teste é oposto pelo teste de Intuição da vítima.'
    }
  ],
  'Fortitude': [
    {
      title: 'Resistência',
      description: 'Você usa esta perícia para testes de resistência contra efeitos que exigem vitalidade, como doenças e venenos. Também para manter seu fôlego quando está correndo ou sem respirar.'
    }
  ],
  'Furtividade': [
    {
      title: 'Esconder-se',
      description: 'Faça um teste de Furtividade oposto pelos testes de Percepção. Esconder-se é uma ação livre no final do seu turno.'
    },
    {
      title: 'Seguir',
      description: 'Faça um teste de Furtividade oposto ao teste de Percepção da pessoa sendo seguida. Você sofre –5 em lugares sem esconderijos.'
    }
  ],
  'Iniciativa': [
    {
      title: 'Reação',
      description: 'Esta perícia determina sua velocidade de reação. Quando uma cena de ação começa, cada ser envolvido faz um teste de Iniciativa. Eles então agem em ordem decrescente dos resultados.'
    }
  ],
  'Intimidação': [
    {
      title: 'Assustar (Treinado)',
      description: 'Gaste uma ação padrão e faça um teste de Intimidação oposto pelo teste de Vontade. Se passar, ela fica abalada pelo resto da cena.'
    },
    {
      title: 'Coagir',
      description: 'Faça um teste de Intimidação oposto pelo teste de Vontade. Se passar, ela obedece uma ordem sua. Este uso gasta um minuto ou mais.'
    }
  ],
  'Intuição': [
    {
      title: 'Perceber Mentira',
      description: 'Você descobre se alguém está mentindo.'
    },
    {
      title: 'Pressentimento (Treinado, DT 20)',
      description: 'Você analisa uma pessoa ou situação para perceber qualquer fato estranho. Este uso apenas indica se há algo anormal.'
    }
  ],
  'Investigação': [
    {
      title: 'Interrogar',
      description: 'Você descobre informações perguntando. Informações gerais não exigem teste. Restritas têm DT 20. Confidenciais têm DT 30. Este uso gasta desde uma hora até um dia.'
    },
    {
      title: 'Procurar',
      description: 'Você examina um local. A DT varia: 15 para um item discreto; 20 para escondido; 30 para muito bem escondido.'
    }
  ],
  'Luta': [
    {
      title: 'Ataque Corpo a Corpo',
      description: 'Você usa Luta para fazer ataques corpo a corpo. A DT é a Defesa do alvo. Se acertar, causa dano de acordo com a arma utilizada.'
    }
  ],
  'Medicina': [
    {
      title: 'Primeiros Socorros (DT 20)',
      description: 'Um personagem adjacente que esteja morrendo perde essas condições e fica com 1 PV. Este uso gasta uma ação padrão.'
    },
    {
      title: 'Cuidados Prolongados (Veterano, DT 20)',
      description: 'Durante uma cena de interlúdio, você pode gastar uma de suas ações para tratar até um ser por ponto de Intelecto.'
    },
    {
      title: 'Necropsia (Treinado, DT 20)',
      description: 'Você examina um cadáver para determinar a causa e o momento aproximado da morte. Este uso leva dez minutos.'
    },
    {
      title: 'Tratamento (Treinado)',
      description: 'Você ajuda a vítima de uma doença ou veneno. Gaste uma ação completa e faça um teste. Exige um kit.'
    }
  ],
  'Ocultismo': [
    {
      title: 'Identificar Criatura',
      description: 'Você analisa uma criatura paranormal. A DT é igual à DT para resistir à Presença Perturbadora. Gasta uma ação completa.'
    },
    {
      title: 'Identificar Item Amaldiçoado (DT 20)',
      description: 'Você pode gastar uma ação de interlúdio para estudar um item amaldiçoado e identificar seus poderes.'
    },
    {
      title: 'Identificar Ritual (DT 10 +5 por círculo)',
      description: 'Quando alguém lança um ritual, você pode descobrir qual é. Este uso é uma reação.'
    },
    {
      title: 'Informação',
      description: 'Responde dúvidas sobre o Outro Lado. Simples não exigem teste; complexas DT 20; mistérios DT 30.'
    }
  ],
  'Percepção': [
    {
      title: 'Observar',
      description: 'Você vê coisas discretas ou escondidas. A DT varia de 15 a 30. Você também pode ler lábios (DT 20).'
    },
    {
      title: 'Ouvir',
      description: 'Você escuta barulhos sutis. Conversa próxima tem DT 0; sussurro DT 15; ouvir do outro lado de uma porta +5.'
    }
  ],
  'Pilotagem': [
    {
      title: 'Operar Veículos',
      description: 'Você sabe operar veículos terrestres e aquáticos. Situações comuns não exigem teste. Ruins exigem DT 15. Terríveis exigem DT 25. Se for veterano, pode pilotar veículos aéreos.'
    }
  ],
  'Pontaria': [
    {
      title: 'Ataque à Distância',
      description: 'Você usa Pontaria para fazer ataques à distância. A DT é a Defesa do alvo. Se acertar, causa dano de acordo com a arma utilizada.'
    }
  ],
  'Profissão': [
    {
      title: 'Exercer Profissão',
      description: 'Você sabe exercer uma profissão específica. Um advogado pode argumentar com a polícia, um administrador pode investigar documentos corporativos. Converse com o mestre para detalhes.'
    }
  ],
  'Reflexos': [
    {
      title: 'Resistência Rápida',
      description: 'Você usa esta perícia para testes de resistência contra efeitos que exigem reação rápida, como armadilhas e explosões. Também para evitar fintas.'
    }
  ],
  'Religião': [
    {
      title: 'Acalmar (DT 20)',
      description: 'Você pode usar Religião como Diplomacia para acalmar um personagem que esteja enlouquecendo.'
    },
    {
      title: 'Informação',
      description: 'Responde dúvidas sobre mitos, profecias, relíquias. DT 10 para simples, 20 para complexas e 30 para mistérios.'
    },
    {
      title: 'Rito (Veterano, DT 20)',
      description: 'Você realiza uma cerimônia religiosa (batizado, casamento, funeral...).'
    }
  ],
  'Sobrevivência': [
    {
      title: 'Acampamento (Treinado)',
      description: 'Você pode conseguir abrigo e alimento nos ermos. A DT é 15 para campo aberto, 20 para mata fechada e 25 para regiões extremas.'
    },
    {
      title: 'Identificar Animal (Treinado, DT 20)',
      description: 'Com uma ação completa, você pode identificar um animal exótico.'
    },
    {
      title: 'Orientar-se',
      description: 'Faz um teste por dia para avançar. Se passar, avança deslocamento normal; se falhar, metade; se falhar por 5 ou mais, se perde.'
    },
    {
      title: 'Rastrear (Treinado)',
      description: 'Identifica e segue rastros. DT 15 para solo macio, 20 para comum, 25 para duro. Seu deslocamento é reduzido à metade.'
    }
  ],
  'Tática': [
    {
      title: 'Analisar Terreno (DT 20)',
      description: 'Com uma ação de movimento, você observa o campo de batalha para descobrir vantagens como cobertura ou terreno elevado.'
    },
    {
      title: 'Plano de Ação (Veterano, DT 20)',
      description: 'Com uma ação padrão, você orienta um aliado. Se passar, fornece +5 na Iniciativa dele.'
    }
  ],
  'Tecnologia': [
    {
      title: 'Falsificação (Veterano)',
      description: 'Falsifica documentos eletrônicos.'
    },
    {
      title: 'Hackear',
      description: 'Você invade um computador protegido. A DT é 15 para pessoais, 20 para redes profissionais e 25 para grandes servidores. Gasta 1d4+1 ações completas.'
    },
    {
      title: 'Localizar Arquivo',
      description: 'Procura um arquivo específico em um sistema. A DT varia de 15 a 25. Gasta de uma ação completa a 1d6+2 ações completas.'
    },
    {
      title: 'Operar Dispositivo',
      description: 'Você opera um dispositivo complexo (câmeras, alarmes). A DT é 15 para comuns, 20 para profissionais e 25 para protegidos. Exige um kit.'
    }
  ],
  'Vontade': [
    {
      title: 'Resistência Mental',
      description: 'Você usa esta perícia para testes de resistência contra efeitos que exigem determinação, como intimidação e rituais que afetam a mente. Também para conjurar rituais em condições adversas.'
    }
  ]
}
