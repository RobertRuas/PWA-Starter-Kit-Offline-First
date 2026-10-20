import { v4 as uuidv4 } from 'uuid';
import { db } from '../database/db';
import type { SyncOperation, SyncOperationType } from './types';
import { logger } from '../logging/logger';

const MAX_RETRY_ATTEMPTS = 10;
const BASE_DELAY_MS = 1000;

function calculateNextAttempt(attemptCount: number): string {
  const delay = Math.min(BASE_DELAY_MS * Math.pow(2, attemptCount), 5 * 60 * 1000);
  return new Date(Date.now() + delay).toISOString();
}

export async function enqueueOperation(
  entityType: string,
  entityId: string,
  operation: SyncOperationType,
  payload: unknown,
): Promise<string> {
  const op: SyncOperation = {
    id: uuidv4(),
    entityType,
    entityId,
    operation,
    payload: JSON.stringify(payload),
    createdAt: new Date().toISOString(),
    attemptCount: 0,
    nextAttemptAt: new Date().toISOString(),
    status: 'pending',
    lastError: null,
  };

  await db.syncQueue.add(op);
  logger.info(`Operação de sincronização enfileirada: ${operation} ${entityType}/${entityId}`);
  return op.id;
}

export async function getPendingOperations(): Promise<SyncOperation[]> {
  const now = new Date().toISOString();
  return db.syncQueue
    .where('status')
    .equals('pending')
    .and((op) => op.nextAttemptAt <= now)
    .toArray();
}

export async function markSending(id: string): Promise<void> {
  await db.syncQueue.update(id, { status: 'sending' });
}

export async function markCompleted(id: string): Promise<void> {
  await db.syncQueue.update(id, { status: 'completed' });
}

export async function markFailed(id: string, error: string): Promise<void> {
  const op = await db.syncQueue.get(id);
  if (!op) return;

  const attemptCount = op.attemptCount + 1;
  const isPermanent = attemptCount >= MAX_RETRY_ATTEMPTS;

  await db.syncQueue.update(id, {
    status: isPermanent ? 'failed' : 'pending',
    attemptCount,
    nextAttemptAt: isPermanent ? op.nextAttemptAt : calculateNextAttempt(attemptCount),
    lastError: error.substring(0, 500),
  });

  if (isPermanent) {
    logger.error(`Operação ${id} falhou permanentemente após ${attemptCount} tentativas`);
  }
}

export async function getPendingCount(): Promise<number> {
  return db.syncQueue.where('status').anyOf(['pending', 'sending']).count();
}

export async function getFailedOperations(): Promise<SyncOperation[]> {
  return db.syncQueue.where('status').equals('failed').toArray();
}

export async function retryFailed(id: string): Promise<void> {
  await db.syncQueue.update(id, {
    status: 'pending',
    attemptCount: 0,
    nextAttemptAt: new Date().toISOString(),
    lastError: null,
  });
}

export async function clearCompleted(): Promise<void> {
  await db.syncQueue.where('status').equals('completed').delete();
}
