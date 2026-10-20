# Dados e estratégia offline

## Banco de dados local

- **Tecnologia**: IndexedDB via Dexie.js
- **Localização**: `src/core/database/`
- **Versionamento**: esquema versionado no Dexie

### Regras do modelo

- Cada entidade tem UUID como identificador
- Datas em ISO 8601 UTC
- Campos obrigatórios validados com Zod
- Índices definidos pelas consultas reais

### Migrações

- Toda alteração de esquema incrementa a versão
- Migrações preservam dados existentes
- Nunca apagar e recriar o banco como solução

## Estratégia offline

### Cache de recursos

- **Estáticos**: cache-first via Service Worker (Workbox)
- **API**: network-first com fallback

### Promessa offline

Após um carregamento online bem-sucedido e a instalação do Service Worker,
os recursos essenciais abrem offline.

### Detecção de conexão

- `navigator.onLine` como sinal aproximado
- Validação real pelo resultado das requisições
- Composable `useConnectivity()` disponível

## Exportação e importação

- Formato: JSON com metadados (versão, data, app)
- Validação completa antes de importar
- Modos: mesclar ou substituir
- Resumo: importados, duplicados, rejeitados

## Sincronização

- Opcional, habilitada via `app.config.ts`
- Fila persistente em IndexedDB
- Retry com backoff exponencial
- Máximo de 10 tentativas por operação
- Falhas permanentes ficam visíveis
