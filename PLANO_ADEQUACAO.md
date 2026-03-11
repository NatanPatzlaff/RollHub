# RollHub — Plano de Adequação às Boas Práticas

> Auditoria realizada em 06/03/2026.  
> Baseado nas regras definidas em `.github/copilot-instructions.md`.

---

## Resumo Executivo

| # | Área | Severidade | Status |
|---|------|-----------|--------|
| 1 | SQLite WAL (`config/database.ts`) | **Crítica** | Pendente |
| 2 | Tailwind v4 CSS-First (CSS + Vite + PostCSS) | **Alta** | Pendente |
| 3 | Framer Motion — `LazyMotion` (13 arquivos) | **Alta** | Pendente |
| 4 | VineJS — `characters_controller.ts` (17+ rotas sem validação) | **Alta** | Pendente |
| 5 | N+1 Queries (`characters_controller.ts`) | **Alta** | Pendente |
| 6 | Inertia imports — `@adonisjs/inertia/react` (10 arquivos) | **Média** | Pendente |
| 7 | VineJS — `character_stats_controller.ts` | **Média** | Pendente |
| 8 | dddice-js — `disconnect()` no cleanup | **Baixa** | Pendente |

---

## 1. SQLite WAL — `config/database.ts`

**Regra violada:** *"Configure obrigatoriamente `PRAGMA journal_mode=WAL;` via hook `afterCreate` do Knex."*

**Estado atual:** Conexão SQLite básica sem nenhum hook `afterCreate`.

**Ação:**
```ts
// config/database.ts
sqlite: {
  client: 'sqlite3',
  connection: { filename: './database.sqlite' },
  useNullAsDefault: true,
  pool: {
    afterCreate: (conn: any, done: Function) => {
      conn.run('PRAGMA journal_mode=WAL;', done)
    },
  },
  migrations: { naturalSort: true, paths: ['database/migrations'] },
},
```

---

## 2. Tailwind v4 — Migração CSS-First

**Regras violadas:**
- `@tailwind base/components/utilities` em `inertia/css/app.css` (diretivas legadas v3).
- `tailwind.config.cjs` existe e está ativo (obsoleto no v4).
- `postcss.config.cjs` usa `@tailwindcss/postcss` + `autoprefixer` — deve ser substituído pelo plugin Vite.
- `vite.config.ts` não inclui `@tailwindcss/vite`.
- Falta `@source` para tree-shaking do HeroUI.

**Ações:**

### 2.1 `vite.config.ts` — Adicionar plugin `@tailwindcss/vite`
```ts
import tailwindcss from '@tailwindcss/vite'
// ...
plugins: [tailwindcss(), inertia(...), react(), adonisjs(...)],
```

### 2.2 `inertia/css/app.css` — Migrar para CSS-First
```css
/* ANTES (legado v3) */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* DEPOIS (v4 CSS-First) */
@import "tailwindcss";

@source '../../node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}';

@theme {
  --color-background: hsl(220 20% 10%);
  --color-foreground: hsl(220 10% 92%);
  --color-card: hsl(220 18% 14%);
  --color-card-foreground: hsl(220 10% 92%);
  --color-primary: hsl(28 100% 50%);
  --color-primary-foreground: hsl(0 0% 100%);
  --color-secondary: hsl(220 16% 20%);
  --color-secondary-foreground: hsl(220 10% 85%);
  --color-muted: hsl(220 14% 18%);
  --color-muted-foreground: hsl(220 10% 55%);
  --color-accent: hsl(265 70% 55%);
  --color-accent-foreground: hsl(0 0% 100%);
  --color-destructive: hsl(0 72% 51%);
  --color-destructive-foreground: hsl(0 0% 100%);
  --color-border: hsl(220 14% 22%);
  --color-input: hsl(220 14% 22%);
  --color-ring: hsl(28 100% 50%);
  --color-success: hsl(142 70% 45%);
  --color-warning: hsl(38 92% 50%);
  --color-info: hsl(210 80% 55%);
  --radius: 0.75rem;
  --font-sans: 'Inter', sans-serif;
  --font-display: 'Cinzel', serif;
}
```

### 2.3 Remover arquivos obsoletos
- Deletar `tailwind.config.cjs`
- Deletar `postcss.config.cjs`

---

## 3. Framer Motion — `LazyMotion` + `m.div`

**Regra violada:** *"A instrução `import { motion } from 'framer-motion'` está banida em componentes da árvore principal."*

**Estado atual:** 13 arquivos importam `motion` e/ou `AnimatePresence` diretamente de `framer-motion`.

### Arquivos afetados:
| Arquivo | Import atual |
|---------|-------------|
| `inertia/pages/characters/show.tsx` | `motion, AnimatePresence` |
| `inertia/pages/home.tsx` | `motion` |
| `inertia/pages/home/EntityCard.tsx` | `motion` |
| `inertia/pages/home/CreateCharacterModal.tsx` | `motion, AnimatePresence` |
| `inertia/pages/characters/components/CharacterTabsCard.tsx` | `motion, AnimatePresence` |
| `inertia/pages/characters/components/AttributesDiceTrayCard.tsx` | `motion, AnimatePresence` |
| `inertia/pages/characters/components/AttributesPanel.tsx` | `motion` |
| `inertia/pages/characters/components/DiceTray.tsx` | `motion` |
| `inertia/pages/characters/components/AddItemModal.tsx` | `motion, AnimatePresence` |
| `inertia/pages/characters/components/RitualSelectModal.tsx` | `motion, AnimatePresence` |
| `inertia/pages/characters/components/TrailSelectModal.tsx` | `motion, AnimatePresence` |
| `inertia/pages/characters/components/AffinityModal.tsx` | `motion` |
| `inertia/pages/characters/components/ParanormalPowerModal.tsx` | `motion, AnimatePresence` |

### Ações:

**3.1 — Envolver a app em `LazyMotion` (`inertia/app/app.tsx`):**
```tsx
import { LazyMotion, domAnimation } from 'framer-motion'

createRoot(el).render(
  <HeroUIProvider>
    <LazyMotion features={domAnimation} strict>
      <App {...props} />
    </LazyMotion>
  </HeroUIProvider>
);
```

**3.2 — Em cada arquivo afetado, trocar:**
```tsx
// ANTES
import { motion, AnimatePresence } from 'framer-motion'
// <motion.div ...>

// DEPOIS
import { m, AnimatePresence } from 'framer-motion'
// <m.div ...>
```

---

## 4. VineJS — Validação em `characters_controller.ts`

**Regra violada:** *"A camada de validação ocorre exclusivamente nos Controllers via VineJS."*

**Estado atual:** Todas as 17+ rotas mutacionais usam `request.only()` cru sem nenhuma chamada a `request.validateUsing()`.

### Rotas sem validação (amostra):
| Método | Rota | Dados não validados |
|--------|------|---------------------|
| `store` | `POST /characters` | `nex, classId, originId, name` |
| `updateAttributes` | `PUT /characters/:id/attributes` | `strength, agility, intellect, vigor, presence` |
| `update` | `PUT /characters/:id` | `name, classId, originId, nex, rank` |
| `updateAffinity` | `PUT /characters/:id/affinity` | `affinity` |
| `updateTrailConfig` | `PUT /characters/:id/trail-config` | `selectedSkills, ritualName, element, favoriteWeapon` |
| `updateSkills` | `PUT /characters/:id/skills` | `trainedSkills, veteranSkills` |
| `addAbility` | `POST /characters/:id/abilities` | `abilityId` |
| `addPower` | `POST /characters/:id/paranormal-powers` | `powerId, transcendAbilityId` |
| `addRitual` | `POST /characters/:id/rituals` | `ritualId, transcendAbilityId` |
| `selectTrail` | `PUT /characters/:id/trail` | `trailId` |
| `addItem` | `POST /characters/:id/items` | `type, itemId, quantity` |
| `toggleEquip` | `PUT /characters/:id/items/:itemId/equip` | `equipped` |
| `addWeaponMod` | `POST .../modifications` | `modificationId` |

### Ação:
Criar arquivo `app/validators/character.ts` com validators VineJS para cada rota e substituir `request.only()` por `request.validateUsing()` no controller.

---

## 5. N+1 Queries — `characters_controller.ts`

**Regra violada:** *"Proibido iterar consultas. Use `.preload()` ou bulk queries."*

### 5.1 — `store()` — Loop de skills da origem
```ts
// PROBLEMA: query dentro de for
for (const skillName of origin.trainedSkills) {
  const skill = await Skill.query().where('name', skillName).first()
  // ...
}

// SOLUÇÃO: buscar todas de uma vez
const skills = await Skill.query().whereIn('name', origin.trainedSkills)
const skillMap = new Map(skills.map(s => [s.name, s]))
for (const skillName of origin.trainedSkills) {
  const skill = skillMap.get(skillName)
  // ...
}
```

### 5.2 — `syncMandatoryAbilities()` — Loop de abilities
```ts
// PROBLEMA: query dentro de for
for (const ability of allClassAbilities) {
  const exists = await CharacterClassAbility.query()
    .where('characterId', character.id)
    .where('classAbilityId', ability.id)
    .first()
  // ...
}

// SOLUÇÃO: buscar todas de uma vez
const existingAbilities = await CharacterClassAbility.query()
  .where('characterId', character.id)
const existingMap = new Set(existingAbilities.map(a => a.classAbilityId))
for (const ability of allClassAbilities) {
  const exists = existingMap.has(ability.id)
  // ...
}
```

---

## 6. Inertia Imports — `@adonisjs/inertia/react`

**Regra violada:** *"Use APENAS `<Link>` e `<Form>` importados de `@adonisjs/inertia/react`."*

**Estado atual:** Todos os imports vêm de `@inertiajs/react` (pacote base).

### Arquivos afetados:
| Arquivo | Imports |
|---------|---------|
| `characters/show.tsx` | `Head, Link, router, usePage` |
| `register.tsx` | `Head, useForm` |
| `login.tsx` | `Head, useForm` |
| `home.tsx` | `Head, router, usePage` |
| `home/HomeHeader.tsx` | `router` |
| `home/CreateCharacterModal.tsx` | `router` |
| `errors/server_error.tsx` | `Link` |
| `errors/not_found.tsx` | `Link` |
| `characters/components/CharacterTopBar.tsx` | `Link` |
| `app/app.tsx` | `createInertiaApp` |

### Ação:
Trocar `from '@inertiajs/react'` → `from '@adonisjs/inertia/react'` em todos os arquivos listados.

> **Nota:** Verificar se `@adonisjs/inertia/react` re-exporta `router`, `usePage`, `Head` e `createInertiaApp`. Caso contrário, manter apenas `Link`, `Form`, `useForm` do wrapper e os demais do pacote base.

---

## 7. VineJS — `character_stats_controller.ts`

**Mesmo problema do item 4**, porém menor escopo (1 rota).

```ts
// ANTES
const { currentHp, currentPe, currentSanity, permanentSanityLoss } = request.only([...])

// DEPOIS
const payload = await request.validateUsing(updateCharacterStatsValidator)
```

---

## 8. dddice-js — `disconnect()` no cleanup

**Regra violada:** *"Destrua a instância e desligue a rede no cleanup do `useEffect`."*

**Estado atual em `AttributesDiceTrayCard.tsx`:**
```ts
return () => {
  mounted = false
  if (dddiceRef.current) {
    try { dddiceRef.current.stop() } catch (_) {}
    // ⚠️ Falta disconnect() para fechar WebSocket
  }
  dddiceRef.current = null
}
```

**Ação:**
```ts
return () => {
  mounted = false
  if (dddiceRef.current) {
    try { dddiceRef.current.disconnect?.() } catch (_) {}
    try { dddiceRef.current.stop() } catch (_) {}
  }
  dddiceRef.current = null
}
```

---

## Itens em Conformidade (sem ação necessária)

| Área | Status |
|------|--------|
| Validação VineJS em `login_controller.ts` | ✅ Usa `request.validateUsing(loginValidator)` |
| Validação VineJS em `register_controller.ts` | ✅ Usa `request.validateUsing(registerValidator)` |
| `useMemo` / `useCallback` em Recharts | ✅ Dados congelados corretamente |
| Preloads no `home_controller.ts` | ✅ Usa `.preload()` |
| Preloads no `show()` de characters | ✅ Usa `.preload()` com nested |
| Model `User` com `AuthFinder` (hash) | ✅ Via mixin `withAuthFinder` |
| Tesseract.js | ✅ Sem uso no frontend (apenas dependência) |
| `inertia.render()` em todos os controllers | ✅ Conforme |

---

## Ordem de Execução Sugerida

1. **SQLite WAL** — 1 arquivo, impacto crítico em produção
2. **Tailwind v4 CSS-First** — migração estrutural de estilo
3. **Framer Motion LazyMotion** — 13 arquivos, impacto no bundle
4. **Inertia imports** — troca mecânica em 10 arquivos
5. **VineJS validators** — criação de validators + refatoração do controller
6. **N+1 queries** — refatoração de lógica no controller
7. **dddice disconnect** — 1 linha de código
