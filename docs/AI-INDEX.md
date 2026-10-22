# Índice para agentes de IA

## Por tipo de tarefa

### Alterar interface ou navegação
- `src/app/router/index.ts` — Rotas da aplicação
- `src/app/layouts/AppLayout.vue` — Layout responsivo com sidebar (desktop) e bottom tabs (mobile)
- `src/components/` — Componentes reutilizáveis (ui, feedback)
- `src/styles/global.css` — Estilos globais mínimos (variáveis CSS do PrimeVue)

### Alterar dados ou persistência
- `src/core/database/db.ts` — Esquema do banco (Dexie.js/IndexedDB)
- `src/core/database/repositories/` — Repositórios de acesso a dados
- `src/core/storage/export.ts` — Exportação de dados
- `src/core/storage/import.ts` — Importação e validação de dados

### Adicionar funcionalidade
- `src/features/` — Cada funcionalidade em pasta isolada
- `src/app/config/app.config.ts` — Configuração central e feature flags

### Alterar sincronização
- `src/core/sync/queue.ts` — Fila de sincronização persistente
- `src/core/sync/sync-engine.ts` — Motor de sincronização com adaptador
- `src/core/sync/sync-status.ts` — Estado reativo da sincronização

### Alterar validação
- `src/features/*/schemas/` — Schemas Zod por funcionalidade
- `src/core/validation/` — Validações compartilhadas

### Testes
- `tests/unit/` — Testes unitários (Vitest)
- `tests/e2e/` — Testes end-to-end (Playwright)
- `vitest.config.ts` — Configuração do Vitest

### CI/CD
- `.github/workflows/ci.yml` — Pipeline de integração contínua

## Framework de UI

- **PrimeVue 4.x** com tema Aura (`@primeuix/themes/aura`), licença MIT.
- **PrimeIcons** para ícones.
- Não utilizar Tailwind CSS, Bootstrap, Vuetify ou outras bibliotecas de UI.
- Usar variáveis CSS do PrimeVue (`var(--p-*)`) para estilização.
- Layout responsivo: `AppLayout.vue` com sidebar para desktop e bottom tabs para mobile.

## Regras
- Ler `AGENTS.md` antes de qualquer alteração
- Executar `npm run check` após alterações
