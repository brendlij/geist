<script setup lang="ts">
import { provide, ref, computed } from 'vue'
import AppHeader from './components/app/AppHeader.vue'
import { useBackgroundSettingsStore } from '@/stores/backgroundSettings'
import { useTheme } from '@/theme/useTheme'

const editMode = ref(false)
provide('editMode', editMode)

const backgroundSettingsStore = useBackgroundSettingsStore()
const { themeId } = useTheme()

const backgroundStyle = computed(() => {
  // Only apply background image if glass theme is active
  if (themeId.value !== 'glass' || !backgroundSettingsStore.imageUrl) return {}
  return {
    backgroundImage: `url(${backgroundSettingsStore.imageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  }
})
</script>

<template>
  <div class="app-container" :style="backgroundStyle">
    <AppHeader />

    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background-color: var(--background);
  color: var(--text);
  transition: background 0.3s ease;
}

.app-main {
  flex: 1;
  overflow-y: auto;
}

@media (max-width: 640px) {
  .app-main {
    padding: var(--space-md);
  }
}
</style>
