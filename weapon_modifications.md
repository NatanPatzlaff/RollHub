# Mapeamento de Modificações de Armas

Este documento detalha o estado atual da implementação automática das modificações de armas no sistema RollHub.

## 1. Melhorias (Enhancements)

- [x] **Alongada**
    - **Status**: Sim (Ataque +2 Funcional)
    - **Localização**: `inertia/pages/characters/show.tsx` (~2855)
    - **O que falta**: Nada (Bônus de ataque automático).
    - **Descrição**: Com um cano mais longo, que aumenta a precisão dos disparos, a arma fornece +2 nos testes de ataque.

- [x] **Calibre Grosso**
    - **Status**: Sim (Dano Modificado Automático)
    - **Localização**: `inertia/pages/characters/show.tsx` (~48, ~2860), `CharacterTabsCard.tsx` (~30, ~1279)
    - **O que falta**: Nada.
    - **Descrição**: A arma é modificada para disparar munição de maior calibre, aumentando seu dano em mais um dado do mesmo tipo. Por exemplo, um revólver de calibre grosso causa 3d6 de dano. Requer munição específica de calibre grosso.

- [x] **Certeira**
    - **Status**: Sim (Ataque +2 Funcional)
    - **Localização**: `inertia/pages/characters/show.tsx` (~2855)
    - **O que falta**: Nada.
    - **Descrição**: Fabricada para ser mais precisa e balanceada, a arma fornece +2 nos testes de ataque.

- [ ] **Compensador**
    - **Status**: Dados Semeados (Lógica Pendente)
    - **Localização**: `database/seeders/weapon_modifications_seeder.ts`
    - **O que falta**: Lógica para anular a penalidade de rajada no `AttributesDiceTrayCard`.
    - **Descrição**: Apenas para armas automáticas. Um sistema de amortecimento reduz o coice da arma, anulando a penalidade em testes de ataque por disparar rajadas.

- [x] **Cruel**
    - **Status**: Sim (Dano +2 Funcional)
    - **Localização**: `inertia/pages/characters/show.tsx` (~2856)
    - **O que falta**: Nada.
    - **Descrição**: A arma possui lâmina especialmente afiada ou foi fabricada com materiais mais densos. Fornece um bônus de +2 nas rolagens de dano.

- [x] **Discreta**
    - **Status**: Sim (Bônus Crime e Espaço Funcionais)
    - **Localização**: `show.tsx` (~2785), `SkillsCard.tsx` (~69, ~276, ~328)
    - **O que falta**: Nada.
    - **Descrição**: A arma possui modificações para ocupar menos espaço e chamar menos atenção. Reduz o número de espaços ocupados em 1, fornece +5 em testes de Crime para ser ocultada e permite fazer esse teste mesmo sem ser treinado na perícia.

- [ ] **Dum-Dum**
    - **Status**: Dados Semeados (Lógica Pendente)
    - **Localização**: `database/seeders/weapon_modifications_seeder.ts`
    - **O que falta**: Implementar o bônus de multiplicador de crítico (+1x).
    - **Descrição**: Balas feitas para se expandir durante o impacto, produzindo ferimentos terríveis. Aumenta o multiplicador de crítico em +1. Apenas para balas curtas e longas.

- [ ] **Explosiva**
    - **Status**: Dados Semeados (Lógica Pendente)
    - **Localização**: `database/seeders/weapon_modifications_seeder.ts`
    - **O que falta**: Suporte para o bônus de +2d6 no dano automático.
    - **Descrição**: Munições com uma gota de mercúrio ou glicerina que fazem a bala explodir ao atingir o alvo. Aumenta o dano causado em +2d6. Apenas para cartuchos.

- [ ] **Ferrolho Automático**
    - **Status**: Dados Semeados
    - **Localização**: `database/seeders/weapon_modifications_seeder.ts`
    - **O que falta**: Lógica para habilitar o modo automático no seletor de armas.
    - **Descrição**: O mecanismo de ação da arma é modificado para disparar várias vezes em sequência. A arma se torna automática.

- [x] **Mira Laser**
    - **Status**: Sim (Margem +2 Funcional)
    - **Localização**: `inertia/pages/characters/show.tsx` (~2857)
    - **O que falta**: Nada.
    - **Descrição**: Um laser interno cria um reflexo vermelho num retículo luminoso, ajudando a realizar disparos mais letais. Aumenta a margem de ameaça em +2.

- [ ] **Mira Telescópica**
    - **Status**: Dados Semeados (Lógica Pendente)
    - **Localização**: `database/seeders/weapon_modifications_seeder.ts`
    - **O que falta**: Bônus de alcance e permissão de Ataque Furtivo em qualquer alcance.
    - **Descrição**: A arma possui uma luneta com marcações de medidas, ideal para disparos precisos de longa distância. Aumenta o alcance da arma em uma categoria e permite que a habilidade Ataque Furtivo seja usada em qualquer alcance.

- [x] **Perigosa**
    - **Status**: Sim (Margem +2 Funcional)
    - **Localização**: `inertia/pages/characters/show.tsx` (~2857)
    - **O que falta**: Nada.
    - **Descrição**: A arma possui lâmina afiada como uma navalha ou foi fabricada com materiais macuços. Seus golpes possuem impacto terrível. Aumenta a margem de ameaça em +2.

- [ ] **Silenciador**
    - **Status**: Dados Semeados (Lógica Pendente)
    - **Localização**: `database/seeders/weapon_modifications_seeder.ts`
    - **O que falta**: Redução de penalidade em Furtividade (-10).
    - **Descrição**: Um silenciador reduz em -10 a penalidade em Furtividade para se esconder no mesmo turno em que atacou com a arma de fogo.

- [ ] **Tática**
    - **Status**: Dados Semeados
    - **Localização**: `database/seeders/weapon_modifications_seeder.ts`
    - **O que falta**: Lógica de saque como ação livre.
    - **Descrição**: A arma possui cabo texturizado, bandoleira e outros acessórios que facilitam seu manuseio. Você pode sacar a arma como uma ação livre.

- [ ] **Visão de Calor**
    - **Status**: Dados Semeados (Lógica Pendente)
    - **Localização**: `database/seeders/weapon_modifications_seeder.ts`
    - **O que falta**: Lógica para ignorar camuflagem.
    - **Descrição**: A mira tem um sistema eletrônico que sobrepõe imagens visíveis e em infravermelho. Ao disparar com a arma, você ignora qualquer camuflagem do alvo.

---

## 2. Maldições (Curses)

- [/] **Energética**
    - **Status**: Parcial
    - **Localização**: `inertia/pages/characters/show.tsx` (~2855)
    - **O que falta**: Conversão automática do tipo de dano para Energia e ignorar RD.
    - **Descrição**: Dano torna-se Energia, ignora RD e fornece +2 de ataque.

- [ ] **Flamejante**
    - **Status**: Não Implementado
    - **Localização**: -
    - **O que falta**: Inclusão de 1d6 de Sangue extra e efeito de incêndio em crítico.
    - **Descrição**: Adiciona +1d6 de dano de Sangue; críticos incendeiam o alvo.

- [ ] **Gélida**
    - **Status**: Não Implementado
    - **Localização**: -
    - **O que falta**: Inclusão de 1d6 de Morte extra e redutor de AGI no alvo.
    - **Descrição**: Adiciona +1d6 de dano de Morte e reduz a Defesa/AGI do alvo.

- [ ] **Sanguinária**
    - **Status**: Não Implementado
    - **Localização**: -
    - **O que falta**: Inclusão de 1d6 de Sangue extra e acúmulo de Sangramento.
    - **Descrição**: Adiciona +1d6 de dano de Sangue e causa Sangramento cumulativo.

- [ ] **Amaldiçoada**
    - **Status**: Não Implementado
    - **Localização**: -
    - **O que falta**: Inclusão de 1d6 de Energia extra.
    - **Descrição**: Adiciona +1d6 de dano de Energia.

- [x] **Vibrante**
    - **Status**: Sim (UI Implementada)
    - **Localização**: `CharacterTabsCard.tsx` (~1311)
    - **O que falta**: Nada.
    - **Descrição**: Recebe Ataque Extra. Se já tiver, o custo da habilidade diminui em -1 PE.

---

## 3. Modificações Extras

- [x] **Empuxo**
    - **Status**: Sim (Lógica de Arremesso Ativa)
    - **Localização**: `inertia/pages/characters/show.tsx` (~2902)
    - **O que falta**: Nada.
    - **Descrição**: A arma pode ser arremessada, causa +1 dado de dano e volta voando para você.
