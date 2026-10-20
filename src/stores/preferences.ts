import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type ThemePreference = 'light' | 'dark' | 'system'

export const usePreferencesStore = defineStore('preferences', () => {
  const theme = ref<ThemePreference>(loadTheme())

  function loadTheme(): ThemePreference {
    try {
      const saved = localStorage.getItem('pwa-starter-theme')
      if (saved === 'light' || saved === 'dark' || saved === 'system') return saved
    } catch {
      // localStorage indisponível
    }
    return 'system'
  }

  function applyTheme(value: ThemePreference) {
    const root = document.documentElement
    if (value === 'system') {
      root.removeAttribute('data-theme')
    } else {
      root.setAttribute('data-theme', value)
    }
  }

  function setTheme(value: ThemePreference) {
    theme.value = value
    try {
      localStorage.setItem('pwa-starter-theme', value)
    } catch {
      // falha silenciosa
    }
    applyTheme(value)
  }

  // Aplicar tema ao inicializar
  applyTheme(theme.value)

  watch(theme, applyTheme)

  return { theme, setTheme }
})
