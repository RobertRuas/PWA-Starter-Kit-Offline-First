import { toastController } from '@ionic/vue'

export function useErrorToast() {
  async function showError(message: string, duration = 3000) {
    const toast = await toastController.create({
      message,
      duration,
      color: 'danger',
      buttons: [
        {
          text: '📋',
          role: 'cancel',
          handler: async () => {
            try {
              await navigator.clipboard.writeText(message)
              const confirmToast = await toastController.create({
                message: 'Copiado!',
                duration: 1500,
                color: 'success',
              })
              await confirmToast.present()
            } catch (err) {
              console.error('Erro ao copiar:', err)
            }
          },
        },
      ],
    })
    await toast.present()
  }

  async function showSuccess(message: string, duration = 2000) {
    const toast = await toastController.create({
      message,
      duration,
      color: 'success',
    })
    await toast.present()
  }

  async function showWarning(message: string, duration = 2500) {
    const toast = await toastController.create({
      message,
      duration,
      color: 'warning',
    })
    await toast.present()
  }

  return { showError, showSuccess, showWarning }
}
