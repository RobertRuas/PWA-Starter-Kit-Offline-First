# Modelo de tarefa para IA

Use este formato ao pedir alterações para um agente de IA:

```
## Objetivo
Descreva o resultado que precisa ser alcançado.

## Contexto
Explique a funcionalidade e os utilizadores envolvidos.

## Restrições
- Respeitar AGENTS.md e a arquitetura existente
- Reutilizar componentes e serviços existentes
- Manter funcionamento offline quando aplicável
- Não adicionar dependências sem justificativa
- Não quebrar o formato de dados sem migração

## Critérios de aceite
- [ ] Comportamento esperado implementado
- [ ] Estados de erro e vazio tratados
- [ ] Testes adicionados ou atualizados
- [ ] Type-check, lint, testes e build executados
- [ ] Documentação atualizada quando necessário

## Entrega
Resuma arquivos alterados, decisões tomadas, testes executados e limitações.
```
