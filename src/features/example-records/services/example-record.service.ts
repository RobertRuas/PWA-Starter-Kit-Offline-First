import { v4 as uuidv4 } from 'uuid';
import { exampleRecordRepository } from './example-record.repository';
import {
  exampleRecordFormSchema,
  type ExampleRecordFormData,
} from '../schemas/example-record.schema';
import { ValidationError, StorageError } from '../../../core/errors/app-error';
import { formatZodErrors } from '../../../core/validation';
import { enqueueOperation } from '../../../core/sync/queue';
import { isFeatureEnabled } from '../../../app/config/feature-flags';
import type { ExampleRecord } from '../types/example-record';
import { logger } from '../../../core/logging/logger';

export async function createRecord(data: ExampleRecordFormData): Promise<ExampleRecord> {
  const validation = exampleRecordFormSchema.safeParse(data);
  if (!validation.success) {
    throw new ValidationError('Dados inválidos', formatZodErrors(validation.error));
  }

  const now = new Date().toISOString();
  const record: ExampleRecord = {
    id: uuidv4(),
    title: validation.data.title,
    description: validation.data.description,
    createdAt: now,
    updatedAt: now,
  };

  try {
    await exampleRecordRepository.create(record);
  } catch (error) {
    logger.error('Falha ao salvar registro', error);
    throw new StorageError('Não foi possível salvar o registro. Verifique o espaço disponível.');
  }

  if (isFeatureEnabled('sync')) {
    await enqueueOperation('exampleRecords', record.id, 'create', record);
  }

  return record;
}

export async function updateRecord(
  id: string,
  data: ExampleRecordFormData,
): Promise<ExampleRecord> {
  const validation = exampleRecordFormSchema.safeParse(data);
  if (!validation.success) {
    throw new ValidationError('Dados inválidos', formatZodErrors(validation.error));
  }

  const existing = await exampleRecordRepository.getById(id);
  if (!existing) {
    throw new StorageError('Registro não encontrado');
  }

  const changes = {
    title: validation.data.title,
    description: validation.data.description,
    updatedAt: new Date().toISOString(),
  };

  try {
    await exampleRecordRepository.update(id, changes);
  } catch (error) {
    logger.error('Falha ao atualizar registro', error);
    throw new StorageError('Não foi possível atualizar o registro.');
  }

  const updated = { ...existing, ...changes };

  if (isFeatureEnabled('sync')) {
    await enqueueOperation('exampleRecords', id, 'update', updated);
  }

  return updated;
}

export async function deleteRecord(id: string): Promise<void> {
  try {
    await exampleRecordRepository.remove(id);
  } catch (error) {
    logger.error('Falha ao excluir registro', error);
    throw new StorageError('Não foi possível excluir o registro.');
  }

  if (isFeatureEnabled('sync')) {
    await enqueueOperation('exampleRecords', id, 'delete', { id });
  }
}

export async function getAllRecords(): Promise<ExampleRecord[]> {
  return exampleRecordRepository.getOrderedByDate();
}

export async function getRecord(id: string): Promise<ExampleRecord | undefined> {
  return exampleRecordRepository.getById(id);
}

export async function searchRecords(query: string): Promise<ExampleRecord[]> {
  if (!query.trim()) return getAllRecords();
  return exampleRecordRepository.searchByTitle(query);
}

export async function getRecordCount(): Promise<number> {
  return exampleRecordRepository.count();
}
