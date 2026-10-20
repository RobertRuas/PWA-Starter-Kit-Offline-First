# PWA Starter Kit — Offline-First

Base reutilizável para aplicações mobile-first, instaláveis e com dados locais.

## Funcionalidades

- **Vue 3 + TypeScript + Ionic Vue** — Framework mobile-first com componentes nativos
- **Offline-first** — Funciona sem internet após o primeiro carregamento
- **IndexedDB com Dexie.js** — Persistência local estruturada com versionamento
- **Exportação/importação** — Backup e recuperação de dados do dispositivo
- **PWA** — Instalável com manifest, Service Worker e cache controlado
- **Design system próprio** — Tokens CSS, tema claro/escuro, tipografia compacta
- **Validação com Zod** — Formulários e dados externos validados
- **Testes** — Vitest para unitários, estrutura para E2E com Playwright
- **CI** — GitHub Actions com type-check, lint, testes e build

## Requisitos

- Node.js >= 22
- npm >= 10

## Início rápido

```bash
npm install
npm run dev
```

## Comandos

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build de produção |
| `npm run type-check` | Verificar tipos TypeScript |
| `npm run lint` | Verificar regras de código |
| `npm run format` | Formatar código |
| `npm run test` | Testes unitários |
| `npm run check` | Todas as verificações (types + lint + test + build) |

## Estrutura

```
src/
  app/          — App.vue, router, layouts, configuração central
  components/   — Componentes reutilizáveis (ui, forms, feedback)
  features/     — Funcionalidades isoladas (ex: example-records)
  core/         — Database, rede, storage, sync, erros
  stores/       — Estado global (Pinia)
  styles/       — Tokens CSS e estilos globais
```

## Dados locais

Os dados são armazenados no dispositivo usando IndexedDB via Dexie.js. O navegador ou o sistema operacional podem remover dados em situações de pressão de armazenamento. Use a exportação para manter backups.

## Offline

Após o primeiro carregamento online bem-sucedido, a aplicação funciona sem internet. Um Service Worker gerencia o cache dos recursos estáticos. Criar, editar e excluir registros funciona offline.

## Variáveis de ambiente

Copie `.env.example` para `.env` e configure conforme necessário. Variáveis `VITE_*` são públicas e incluídas no bundle do frontend — nunca coloque segredos nelas.

## Licença

MIT
