import { useToast } from 'primevue/usetoast'

export function useErrorToast() {
  const toast = useToast()

  function showError(message: string, duration = 3000) {
    toast.add({ severity: 'error', summary: 'Erro', detail: message, life: duration })
  }

  function showSuccess(message: string, duration = 2000) {
    toast.add({ severity: 'success', summary: 'Sucesso', detail: message, life: duration })
  }

  function showWarning(message: string, duration = 2500) {
    toast.add({ severity: 'warn', summary: 'Aviso', detail: message, life: duration })
  }

  return { showError, showSuccess, showWarning }
}
