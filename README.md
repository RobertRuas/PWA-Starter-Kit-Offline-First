# PWA Starter Kit — Offline-First

Base reutilizável para aplicações mobile-first, instaláveis e com dados locais.

## Stack

- **Vue 3** + **TypeScript** — framework de interface
- **Ionic Vue** — componentes mobile-first
- **Vite** — build e desenvolvimento
- **Pinia** — estado global
- **Dexie.js** — persistência local (IndexedDB)
- **Zod** — validação de dados
- **Vitest** — testes unitários
- **ESLint + Prettier** — qualidade de código

## Início rápido

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build de produção
npm run build

# Visualizar build de produção
npm run preview
```

## Comandos

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run preview` | Visualizar build localmente |
| `npm run type-check` | Verificação de tipos TypeScript |
| `npm run lint` | Verificação de código com ESLint |
| `npm run format` | Formatação com Prettier |
| `npm run test` | Testes unitários com Vitest |
| `npm run check` | Todas as verificações de uma vez |

## Estrutura de pastas

```
src/
  app/            Configuração, rotas e layouts
  components/     Componentes reutilizáveis (ui, forms, feedback)
  features/       Funcionalidades específicas
  core/           Banco de dados, sync, exportação, rede, erros
  composables/    Composables Vue
  stores/         Stores Pinia
  styles/         Tokens CSS e estilos globais
public/
  icons/          Ícones da PWA
tests/
  unit/           Testes unitários
  integration/    Testes de integração
  e2e/            Testes de ponta a ponta
docs/             Documentação de arquitetura
```

## Funcionalidades

- **Offline-first**: funciona sem internet após o primeiro carregamento
- **Dados locais**: CRUD completo com IndexedDB via Dexie.js
- **Exportação/Importação**: backup e restauração de dados em JSON
- **PWA instalável**: manifest, ícones e Service Worker
- **Sincronização opcional**: fila persistente com retry automático
- **Diagnóstico**: versão, estado do banco e conexão

## Configuração

A identidade da aplicação é definida em `src/app/config/app.config.ts`:

```typescript
export const appConfig = {
  name: 'PWA Starter Kit',
  shortName: 'PWA Kit',
  theme: { primary: '#24527A', accent: '#26736B' },
  features: {
    localDatabase: true,
    dataExport: true,
    sync: false,
    // ...
  },
};
```

## Criando uma nova aplicação

1. Use este repositório como template no GitHub
2. Altere `app.config.ts` com nome, cores e features
3. Atualize `vite.config.ts` (manifest) e `index.html`
4. Substitua os ícones em `public/icons/`
5. Remova ou adapte `features/example-records/`
6. Crie sua funcionalidade em `features/sua-feature/`

## Dependências principais

| Pacote | Motivo |
|--------|--------|
| vue | Framework de interface |
| @ionic/vue | Componentes mobile-first |
| dexie | Persistência local estruturada |
| zod | Validação de dados e formulários |
| pinia | Estado global da aplicação |
| uuid | Identificadores únicos |

## Navegadores suportados

- Safari iOS 16.4+
- Chrome Android 100+
- Chrome Desktop 100+
- Edge 100+
- Firefox 100+

## Licença

MIT
