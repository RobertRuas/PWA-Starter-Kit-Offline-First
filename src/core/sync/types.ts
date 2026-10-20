export type SyncOperationType = 'create' | 'update' | 'delete';
export type SyncStatus = 'pending' | 'sending' | 'completed' | 'failed';

export interface SyncOperation {
  id: string;
  entityType: string;
  entityId: string;
  operation: SyncOperationType;
  payload: string;
  createdAt: string;
  attemptCount: number;
  nextAttemptAt: string;
  status: SyncStatus;
  lastError: string | null;
}
