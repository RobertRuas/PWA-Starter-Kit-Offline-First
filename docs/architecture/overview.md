# Visão geral da arquitetura

## Camadas

```
Interface (páginas e componentes Vue/Ionic)
    ↓
Serviços / Casos de uso (regras de negócio)
    ↓
Repositórios (contratos de dados)
    ↓
Persistência (Dexie.js / IndexedDB)
```

## Regras

- A interface chama serviços, nunca repositórios diretamente.
- Componentes não importam Dexie.
- O núcleo (`core/`) não importa funcionalidades específicas (`features/`).
- Dados externos são sempre validados com Zod antes de entrar no modelo.
- Cada feature fica em sua pasta dentro de `features/`.

## Fluxo de gravação

1. Usuário preenche formulário
2. Validação no componente (Zod)
3. Serviço valida regras de negócio
4. Repositório grava via transação local
5. Se sync habilitado, operação entra na fila
6. Interface confirma "Salvo neste dispositivo"
7. Sync tenta enviar quando houver conexão

## Módulos

- **database**: Dexie, migrações, repositórios base
- **sync**: fila, motor de sincronização, status
- **storage**: exportação e importação
- **network**: detecção de conectividade
- **errors**: classes de erro tipadas
- **logging**: logger com níveis
- **validation**: utilitários Zod
