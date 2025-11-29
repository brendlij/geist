<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import GeistLogo from './GeistLogo.vue'
import SwapyGrid from './SwapyGrid.vue'
import HeaderClock from '@/components/headerWidgets/HeaderClock.vue'
import HeaderWeather from '@/components/headerWidgets/HeaderWeather.vue'
import { useHeaderLayoutStore } from '@/stores/headerLayout'

const router = useRouter()
const showMenu = ref(false)
const menuWrapper = ref<HTMLElement | null>(null)

const headerLayoutStore = useHeaderLayoutStore()

function navigateToSettings() {
  router.push('/settings')
  showMenu.value = false
}

function handleClickOutside(event: MouseEvent) {
  if (menuWrapper.value && !menuWrapper.value.contains(event.target as Node)) {
    showMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Header widget slots - 8 small slots
const headerSlots = [
  { id: 'h1' },
  { id: 'h2' },
  { id: 'h3' },
  { id: 'h4' },
  { id: 'h5' },
  { id: 'h6' },
  { id: 'h7' },
  { id: 'h8' },
]

// Header widget registry
const headerWidgetRegistry = {
  'header-clock': {
    id: 'header-clock',
    title: 'Clock',
    component: HeaderClock,
    configurable: true,
    removable: false,
  },
  'header-weather': {
    id: 'header-weather',
    title: 'Weather',
    component: HeaderWeather,
    configurable: true,
    removable: false,
  },
}
</script>

<template>
  <header class="app-header">
    <div class="header-left">
      <GeistLogo :size="48" color="var(--accent)" />
      <h1 class="app-title">Geist</h1>
    </div>

    <div class="header-center">
      <SwapyGrid
        :slots="headerSlots"
        :widget-registry="headerWidgetRegistry"
        :layout="headerLayoutStore.layout"
        :compact="true"
        class="header-grid"
        @update:layout="headerLayoutStore.setLayout"
      />
    </div>

    <div class="header-right">
      <div ref="menuWrapper" class="menu-wrapper">
        <button class="hamburger-button" @click="showMenu = !showMenu">
          <Icon icon="mdi:menu" width="24" height="24" />
        </button>
        <div v-if="showMenu" class="menu-dropdown">
          <button class="menu-item" @click="navigateToSettings">
            <Icon icon="mdi:cog" width="20" height="20" />
            <span>Settings</span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-sm) var(--space-xl);
  border-bottom: 1px solid var(--border);
  background-color: var(--surface);
  box-shadow: var(--shadow-sm);
  gap: 1rem;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  z-index: 1000;
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  flex-shrink: 0;
}

.app-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  letter-spacing: 0.1em;
  color: var(--text);
  margin: 0;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
  min-width: 0; /* Allows flex item to shrink below content size */
}

.header-grid {
  --grid-columns: 8;
  --grid-row-height: 44px;
  --slot-border-radius: 0.75rem;
  --widget-border-radius: 0.75rem;
  --widget-padding: 0.25rem;
  --widget-border: none;
  width: 100%;
}

.header-grid :deep(.swapy-grid) {
  gap: 0.5rem;
  padding: 0;
  overflow: visible;
}

.header-grid :deep(.slot) {
  height: 44px;
  overflow: visible;
}

.header-grid :deep(.item) {
  overflow: visible;
}

/* Ensure dragging item appears above everything */
.header-grid :deep([data-swapy-dragging]) {
  z-index: 1000 !important;
}

.header-grid :deep(.widget-wrapper) {
  border: none;
  background: transparent;
  overflow: visible;
}

.header-grid :deep(.swapy-grid.edit-mode .slot) {
  border: 2px dashed var(--border);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}

.menu-wrapper {
  position: relative;
}

.hamburger-button {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  min-width: 2.5rem;
  min-height: 2.5rem;
  border: none;
  background: var(--surface-soft);
  border-radius: 0.5rem;
  color: var(--text);
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.hamburger-button:hover {
  background: var(--accent-soft);
  color: var(--accent);
}

.menu-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 180px;
  overflow: hidden;
  z-index: 10000;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  color: var(--text);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.menu-item:hover {
  color: var(--accent-soft);
}

@media (max-width: 768px) {
  .header-center {
    display: none;
  }
}

@media (max-width: 640px) {
  .app-header {
    padding: var(--space-md) var(--space-lg);
  }
}
</style>
