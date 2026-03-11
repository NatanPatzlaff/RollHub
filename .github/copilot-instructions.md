# RollHub — Instruções de Boas Práticas para o Copilot

Este arquivo define os padrões obrigatórios para todas as ações de geração, edição e refatoração de código neste workspace.

---

## 1. Fluxo de Trabalho (Context-Driven Development)

- **Plan First:** Nunca comece a gerar ou refatorar código sem antes apresentar um plano em tópicos do que será feito. Aguarde confirmação antes de alterar arquivos.
- **Singularidade de Escopo:** Modifique apenas o necessário. Divida funções longas e arquivos massivos. Evite "Spaghetti Code" limitando a amplitude das refatorações. Não introduza dependências sem autorização explícita.
- **Avanço Iterativo:** Desenvolvimento modular, uma funcionalidade de cada vez, permitindo commits estáveis e reversões fáceis.

---

## 2. Backend (AdonisJS v6, Lucid, VineJS)

- **Separação de Escopos:** Todo código de backend reside em `/app`. Nenhuma lib do ecossistema DOM ou React deve ser referenciada em Controllers ou Models.
- **SQLite WAL:** Configure obrigatoriamente `PRAGMA journal_mode=WAL;` via hook `afterCreate` do Knex em `config/database.ts`.
- **ORM Lucid:**
  - Proibido iterar consultas (N+1). Use sempre `.preload()` para relacionamentos.
  - Lógicas de mutação (UUID, hash de senha) devem residir em decoradores do Model (`@beforeSave`), verificando `$dirty`.
- **Validação (VineJS):** Exclusivamente nos Controllers. Para validações com banco (ex: `unique`), use `.withMetaData<T>()`.

---

## 3. Frontend (React 19, Inertia.js, Vite)

- **Renderização:** Exclusivamente via `inertia.render()`.
- **Tipagem End-to-End:** Não duplique interfaces TS no frontend. Use Transformers do AdonisJS para serializar Lucid. Importe tipos pelo alias `~/generated/data` e envolva em `InertiaProps`.
- **Carregamento assíncrono:** Use `inertia.defer()` para métricas demoradas (renderiza skeletons). Use `inertia.merge()` para listas contínuas (chat/logs).
- **Componentes de Integração:** Use APENAS `<Link>` e `<Form>` de `@adonisjs/inertia/react`. Submissões mutacionais (POST, PUT) exclusivamente via `useForm` do mesmo pacote.

---

## 4. Design System (Tailwind v4, HeroUI, Radix UI)

- **Tailwind v4 CSS-First:** `tailwind.config.js` é obsoleto. Use `@import "tailwindcss"` e customize via `@theme` no CSS principal. Use o plugin oficial do Vite (`@tailwindcss/vite`), sem PostCSS legado.
- **HeroUI Tree-Shaking:** Adicione no CSS raiz: `@source '../../node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}';`
- **Radix UI:** Para acessibilidade WAI-ARIA profunda não coberta pelo HeroUI. Estilize atomicamente com Tailwind.

---

## 5. Performance e Processamento Pesado

- **Framer Motion:**
  - Proibido `import { motion } from 'framer-motion'` em componentes da árvore principal.
  - Use `<LazyMotion features={domAnimation}>` + `<m.div>` (variante leve).
- **Recharts:** Congele referências de `dataKey` e objetos embutidos com `useCallback` / `useMemo`.
- **dddice-js:**
  - Isole instâncias `ThreeDDiceAPI` e WebSockets.
  - Destrua a instância e desligue a rede no cleanup do `useEffect` para evitar memory leaks.
  - Virtualize listas de log de rolagens (não usar `.map()` linear no DOM).
- **Tesseract.js:**
  - OCR SOMENTE em Web Workers (nunca na thread principal).
  - Inicialize via: `new Worker(new URL('./worker.js', import.meta.url), { type: 'module' })`.
  - Chame `worker.terminate()` imediatamente após a resolução.
