# Boas Práticas — RollHub

## 1. Diretrizes de Fluxo de Trabalho (Context-Driven Development)

- **Plan First:** Nunca comece a gerar ou refatorar código sem antes apresentar um plano em tópicos do que será feito. Aguarde a confirmação antes de alterar arquivos.
- **Singularidade de Escopo:** Modifique apenas o necessário. Divida funções longas e arquivos massivos. Evite o "Spaghetti Code" limitando a amplitude das suas refatorações e não introduza dependências sem autorização explícita.
- **Avanço Iterativo:** O desenvolvimento deve ser modular, focado em implementar uma funcionalidade de cada vez, permitindo commits estáveis e reversões fáceis.

## 2. Arquitetura de Backend (Node.js, AdonisJS v6, Lucid, VineJS)

- **Separação de Escopos:** Todo o código do backend reside no diretório `/app`. Nenhuma biblioteca do ecossistema DOM ou React deve ser referenciada dentro dos Controladores ou Modelos.
- **Otimização de Concorrência SQLite:** Como a aplicação suporta tráfego intenso (sockets/rolagens de dados multijogador), o modo DELETE padrão do SQLite travará o sistema. Você DEVE configurar o modo WAL (Write-Ahead Logging). Injete o comando `PRAGMA journal_mode=WAL;` persistente através do hook `afterCreate` do gerenciador de conexões do Knex, dentro do arquivo `config/database.ts`.
- **ORM e Active Record (Lucid):**
  - **N+1:** É proibido iterar consultas. Use sempre o método `.preload()` nas consultas do Knex/Lucid para hidratação de relacionamentos aninhados.
  - **Hooks:** Lógicas de mutação (ex: criação de UUIDs ou hashing de senhas) devem obrigatoriamente residir nos decoradores do Model (ex: `@beforeSave`), checando alterações prévias usando o marcador transacional `$dirty`.
- **Validação (VineJS):** A camada de validação e criação de Clear Trust Boundaries ocorre exclusivamente nos Controladores via VineJS. Se a validação exigir verificação cruzada com o banco (ex: regra de exclusão `unique`), utilize a injeção contextual `.withMetaData<T>()`.

## 3. Roteamento e Frontend React (Inertia.js e Vite)

- **Pontes de Comunicação:** A renderização é governada inteiramente pelo Inertia via `inertia.render()`.
- **Tipagem Estática End-to-End:** Não crie interfaces TS no frontend que dupliquem entidades do banco de dados.
  - Use **Transformadores (Transformers)** do AdonisJS no controlador para serializar instâncias Lucid.
  - O Adonis gerará os contratos JSON automaticamente em `.adonisjs/client/data.d.ts`.
  - No frontend (`/inertia`), importe os tipos pelo alias `~/generated/data` e envolva-os em `InertiaProps`.
- **Carregamento Assíncrono e Otimizado:**
  - Para carregamento de métricas e painéis de dados demorados: Utilize `inertia.defer()`, permitindo renderização imediata de skeletons no React.
  - Para listas contínuas (logs de chat/dados): Utilize paginação por empilhamento via `inertia.merge()` ao invés de sobrescrever propriedades.
- **Componentes de Integração:** Utilize APENAS as tags `<Link>` e `<Form>` importadas do pacote wrapper oficial `@adonisjs/inertia/react`. Para interações mutacionais (POST, PUT), gerencie submissões exclusivamente com o hook `useForm` deste mesmo pacote para garantir captura nativa de erros VineJS e proteção CSRF automática.

## 4. Design System e Estilização (Tailwind v4, HeroUI, Radix)

- **Paradigma CSS-First do Tailwind v4:** A configuração em `tailwind.config.js` é obsoleta. O estilo principal será regido por declarações diretas de CSS (ex: `app.css`) usando `@import "tailwindcss";` e customizado via variáveis sob a diretiva `@theme`. O processamento ocorrerá DIRETAMENTE pelo plugin oficial do Vite (`@tailwindcss/vite`), dispensando e substituindo por completo o ecossistema e plugins arcaicos do PostCSS.
- **Otimização do HeroUI (Tree-Shaking):** Para não engolfar o bundle com a UI inteira, garanta que os caminhos modulares estejam mapeados de forma absoluta com a instrução de rastreamento no arquivo raiz de estilo: `@source '../../node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}'`.
- **Acessibilidade Nativa (Radix UI):** Para interações modulares abstratas e de navegação acessível WAI-ARIA profundas não sanadas nativamente pelo HeroUI, integre as primitivas invisíveis do Radix e estilize-as atômicamente com Tailwind.

## 5. Performance e Processamento Pesado (Framer, Recharts, WebAssembly)

- **Gerenciamento de Bundle no Framer Motion:**
  - A instrução padrão genérica `import { motion } from 'framer-motion'` está **banida** em componentes renderizados de forma imediata na árvore principal.
  - Envolva a aplicação de animações pesadas com o contêiner de fracionamento de código assíncrono `<LazyMotion features={domAnimation}>`.
  - Use exclusivamente a variante leve e desidratada do componente: `<m.div>`.
- **Estabilização Recharts:** A biblioteca é sensível a quebras de renderização na árvore do DOM. Todo objeto embutido repassado e, em especial, métodos assinalados como chaves ativas (a propriedade condicional iterativa `dataKey`), DEVEM ter sua referência temporal congelada via ganchos `useCallback` ou `useMemo` para não disparar recálculos desastrosos e layout thrashing durante mutações superficiais da tela.
- **Isolamento Tridimensional (dddice-js):**
  - As injeções de instâncias `ThreeDDiceAPI` e suas conexões de túnel contínuo WebSockets devem ser isoladas. A desmontagem temporal no React (cleanup retornado pelo `useEffect`) deve obrigatoriamente destruir a instância e desligar a rede para barrar imperativamente vazamentos catastróficos de alocação temporal de memória (memory leaks).
  - Para o rolamento vetorial no histórico de mensagens de logs físicos, o mapeamento clássico linear via `.map()` no DOM deve dar lugar à virtualização forçada de listas baseadas na exibição de blocos da janela de visão do cliente limitante nativo.
- **Isolamento e OCR Client-Side (Tesseract.js):** O processamento de imagens e o cálculo matemático por WebAssembly sobrecarrega e estrangula a Thread Principal. A extração geométrica do Tesseract.js SÓ PODE ser executada se apartada assincronamente (Offloading) em instâncias estritas de Web Workers. Inicialize via sintaxe padrão modular atada do Vite: `new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });`. Finalize o pipeline algorítmico invocando estritamente `worker.terminate()` logo após a resolução transiente, devolvendo a memória imediatamente ao sistema.
