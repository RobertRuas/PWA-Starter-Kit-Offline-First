import { defineStore } from 'pinia'

export const usePreferencesStore = defineStore('preferences', () => {
  function ensureLightTheme() {
    document.documentElement.classList.remove('p-dark')
  }

  ensureLightTheme()

  return { ensureLightTheme }
})
