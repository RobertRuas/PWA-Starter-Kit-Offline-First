# Arquitetura

## Camadas

```
Interface (páginas/componentes)
       ↓
Serviços / Casos de uso
       ↓
Repositórios
       ↓
Persistência (IndexedDB/Dexie.js)
```

## Regras de dependência

- Interface chama serviços, nunca repositórios diretamente.
- Serviços usam repositórios e validação.
- Repositórios acessam o banco via `db.ts`.
- Core não importa features.
- Features importam core e components.

## Módulos

| Módulo | Diretório | Responsabilidade |
|--------|-----------|-----------------|
| App | `src/app/` | Router, layouts, configuração |
| Components | `src/components/` | UI reutilizável |
| Core | `src/core/` | Database, rede, sync, storage |
| Features | `src/features/` | Funcionalidades isoladas |
| Stores | `src/stores/` | Estado global (Pinia) |

## Fluxo de dados

1. Utilizador interage com a interface
2. Componente chama serviço/repositório
3. Repositório grava em transação no IndexedDB
4. Interface confirma "Salvo neste dispositivo"
5. Se sync habilitada, operação entra na fila
6. Fila processa quando há conexão
