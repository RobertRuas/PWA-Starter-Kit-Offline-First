# Regras para Agentes de IA

Este documento define as regras que qualquer ferramenta de IA deve seguir ao editar este projeto.

## Antes de editar

1. Leia este arquivo e a documentação da área afetada.
2. Inspecione o código existente e reutilize padrões já implementados.
3. Entenda a separação entre interface, casos de uso e persistência.

## Regras obrigatórias

- **Não recriar** componentes ou serviços que já existem sem justificativa.
- **Não adicionar** dependências sem necessidade comprovada.
- **Manter** a separação entre interface → serviços → repositórios.
- **Não importar** Dexie diretamente em componentes Vue.
- **Não fazer** chamadas de rede para operações que devem funcionar offline.
- **Não apagar** ou recriar o banco para resolver uma migração.
- **Criar ou atualizar** testes para toda mudança de regra importante.
- **Executar** `npm run check` e relatar claramente os resultados.
- **Atualizar** a documentação quando mudar comportamento ou arquitetura.
- **Não afirmar** que testou algo que não executou.
- **Não incluir** dados reais, credenciais ou informações privadas.

## Idioma

- Nomes técnicos (variáveis, funções, tipos): inglês
- Comentários úteis: português do Brasil
- Mensagens da interface: português do Brasil
- Commits: inglês

## Estrutura do projeto

```
src/
  app/          → Configuração, rotas, layouts
  components/   → Componentes reutilizáveis
  features/     → Funcionalidades específicas (ex: example-records)
  core/         → Banco, sync, exportação, rede, erros, validação
  composables/  → Composables Vue reutilizáveis
  stores/       → Stores Pinia
  styles/       → Tokens CSS e estilos globais
```

## Camadas e dependências

```
Interface → Serviços/Casos de uso → Repositórios → Dexie (IndexedDB)
```

Componentes não devem acessar o banco diretamente.
O núcleo não deve importar funcionalidades específicas.

## Comandos

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run type-check   # Verificação de tipos
npm run lint         # Verificação de código
npm run format       # Formatação
npm run test         # Testes unitários
npm run check        # Todas as verificações
```
