import { describe, it, expect } from 'vitest';
import {
  exampleRecordSchema,
  exampleRecordFormSchema,
} from '../../src/features/example-records/schemas/example-record.schema';

describe('exampleRecordSchema', () => {
  it('deve validar um registro completo', () => {
    const record = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      title: 'Teste',
      description: 'Descrição de teste',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    };
    expect(exampleRecordSchema.safeParse(record).success).toBe(true);
  });

  it('deve rejeitar registro sem id válido', () => {
    const record = {
      id: 'invalido',
      title: 'Teste',
      description: '',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    };
    expect(exampleRecordSchema.safeParse(record).success).toBe(false);
  });

  it('deve rejeitar registro sem título', () => {
    const record = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      title: '',
      description: '',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    };
    expect(exampleRecordSchema.safeParse(record).success).toBe(false);
  });

  it('deve rejeitar título muito longo', () => {
    const record = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      title: 'a'.repeat(201),
      description: '',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    };
    expect(exampleRecordSchema.safeParse(record).success).toBe(false);
  });
});

describe('exampleRecordFormSchema', () => {
  it('deve validar dados de formulário válidos', () => {
    expect(exampleRecordFormSchema.safeParse({ title: 'Teste', description: '' }).success).toBe(
      true,
    );
  });

  it('deve rejeitar formulário sem título', () => {
    expect(exampleRecordFormSchema.safeParse({ title: '', description: '' }).success).toBe(false);
  });
});
