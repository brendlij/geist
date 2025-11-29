import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const STORAGE_KEY = 'geist:background-settings'

export interface BackgroundSettings {
  imageUrl: string | null
  blur: number
}

export const useBackgroundSettingsStore = defineStore('backgroundSettings', () => {
  const imageUrl = ref<string | null>(null)
  const blur = ref<number>(0)

  function loadSettings() {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return

    try {
      const parsed = JSON.parse(raw) as BackgroundSettings
      imageUrl.value = parsed.imageUrl ?? null
      blur.value = parsed.blur ?? 0
    } catch (err) {
      console.error('Failed to load background settings:', err)
    }
  }

  function saveSettings() {
    const settings: BackgroundSettings = {
      imageUrl: imageUrl.value,
      blur: blur.value,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }

  function setBackgroundImage(url: string | null) {
    imageUrl.value = url
    saveSettings()
  }

  function setBlur(value: number) {
    blur.value = value
    saveSettings()
  }

  function removeBackground() {
    imageUrl.value = null
    saveSettings()
  }

  // Auto-save on changes
  watch([imageUrl, blur], saveSettings)

  loadSettings()

  return {
    imageUrl,
    blur,
    setBackgroundImage,
    setBlur,
    removeBackground,
  }
})
