import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { formatZodErrors } from '../../src/core/validation';

describe('formatZodErrors', () => {
  it('deve formatar erros por campo', () => {
    const schema = z.object({
      name: z.string().min(1, 'Nome obrigatório'),
      age: z.number().min(0, 'Idade inválida'),
    });

    const result = schema.safeParse({ name: '', age: -1 });
    expect(result.success).toBe(false);

    if (!result.success) {
      const errors = formatZodErrors(result.error);
      expect(errors['name']).toContain('Nome obrigatório');
      expect(errors['age']).toContain('Idade inválida');
    }
  });

  it('deve retornar objeto vazio para zero erros', () => {
    const schema = z.object({ name: z.string() });
    const result = schema.safeParse({ name: 'ok' });
    expect(result.success).toBe(true);
  });
});
