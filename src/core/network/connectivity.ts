import { ref, onMounted, onUnmounted } from 'vue';

export function useConnectivity() {
  const isOnline = ref(navigator.onLine);
  const lastChecked = ref<string | null>(null);

  function handleOnline() {
    isOnline.value = true;
    lastChecked.value = new Date().toISOString();
  }

  function handleOffline() {
    isOnline.value = false;
    lastChecked.value = new Date().toISOString();
  }

  onMounted(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
  });

  onUnmounted(() => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  });

  return {
    isOnline,
    lastChecked,
  };
}
