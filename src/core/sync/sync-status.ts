import { ref, onMounted, onUnmounted } from 'vue';
import { getPendingCount, getFailedOperations } from './queue';
import { useSyncEngine } from './sync-engine';
import type { SyncOperation } from './types';

export function useSyncStatus() {
  const pendingCount = ref(0);
  const failedOperations = ref<SyncOperation[]>([]);
  const { isSyncing, lastSyncAt, lastSyncError } = useSyncEngine();
  let refreshInterval: ReturnType<typeof setInterval> | null = null;

  async function refresh() {
    pendingCount.value = await getPendingCount();
    failedOperations.value = await getFailedOperations();
  }

  onMounted(() => {
    refresh();
    refreshInterval = setInterval(refresh, 5000);
  });

  onUnmounted(() => {
    if (refreshInterval) clearInterval(refreshInterval);
  });

  return {
    pendingCount,
    failedOperations,
    isSyncing,
    lastSyncAt,
    lastSyncError,
    refresh,
  };
}
