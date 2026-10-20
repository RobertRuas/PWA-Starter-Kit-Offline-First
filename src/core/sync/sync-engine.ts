import { ref } from 'vue';
import { getPendingOperations, markSending, markCompleted, markFailed } from './queue';
import { logger } from '../logging/logger';
import { isFeatureEnabled } from '../../app/config/feature-flags';

export type SyncAdapter = (operation: {
  entityType: string;
  entityId: string;
  operation: string;
  payload: unknown;
}) => Promise<void>;

let syncAdapter: SyncAdapter | null = null;
let syncInterval: ReturnType<typeof setInterval> | null = null;

const isSyncing = ref(false);
const lastSyncAt = ref<string | null>(null);
const lastSyncError = ref<string | null>(null);

export function registerSyncAdapter(adapter: SyncAdapter) {
  syncAdapter = adapter;
}

export async function processQueue(): Promise<void> {
  if (!isFeatureEnabled('sync') || !syncAdapter || isSyncing.value) return;

  isSyncing.value = true;
  lastSyncError.value = null;

  try {
    const operations = await getPendingOperations();
    for (const op of operations) {
      try {
        await markSending(op.id);
        await syncAdapter({
          entityType: op.entityType,
          entityId: op.entityId,
          operation: op.operation,
          payload: JSON.parse(op.payload),
        });
        await markCompleted(op.id);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro desconhecido';
        await markFailed(op.id, message);
        logger.warn(`Falha ao sincronizar operação ${op.id}: ${message}`);
      }
    }
    lastSyncAt.value = new Date().toISOString();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido';
    lastSyncError.value = message;
    logger.error(`Erro no motor de sincronização: ${message}`);
  } finally {
    isSyncing.value = false;
  }
}

export function startAutoSync(intervalMs: number = 30000) {
  stopAutoSync();
  syncInterval = setInterval(processQueue, intervalMs);
  processQueue();
}

export function stopAutoSync() {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
  }
}

export function useSyncEngine() {
  return {
    isSyncing,
    lastSyncAt,
    lastSyncError,
    processQueue,
    startAutoSync,
    stopAutoSync,
  };
}
