<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { themeList } from '@/theme/themes'
import { useTheme } from '@/theme/useTheme'
import { useBackgroundSettingsStore } from '@/stores/backgroundSettings'

const router = useRouter()
const activeTab = ref<'appearance'>('appearance')
const { themeId } = useTheme()
const backgroundSettingsStore = useBackgroundSettingsStore()

const fileInputRef = ref<HTMLInputElement | null>(null)

const goBack = () => {
  router.push('/')
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    alert('Please select an image file')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result as string
    if (result) {
      backgroundSettingsStore.setBackgroundImage(result)
    }
  }
  reader.readAsDataURL(file)
}

const triggerFileUpload = () => {
  fileInputRef.value?.click()
}

const removeBackground = () => {
  backgroundSettingsStore.removeBackground()
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

const hasBackground = computed(() => !!backgroundSettingsStore.imageUrl)
</script>

<template>
  <div class="settings-view">
    <div class="settings-header">
      <button class="back-button" @click="goBack" title="Back to Home">
        <Icon icon="mdi:arrow-left" />
      </button>
      <h1>Settings</h1>
    </div>

    <div class="settings-tabs">
      <button
        class="tab-button"
        :class="{ active: activeTab === 'appearance' }"
        @click="activeTab = 'appearance'"
      >
        Appearance
      </button>
    </div>

    <div class="settings-content">
      <div v-if="activeTab === 'appearance'" class="tab-panel">
        <section class="settings-section">
          <h2 class="section-title">Theme</h2>
          <p class="section-description">Choose your preferred color theme</p>

          <div class="theme-grid">
            <div
              v-for="theme in themeList"
              :key="theme.id"
              class="theme-card"
              :class="{ active: themeId === theme.id }"
              @click="themeId = theme.id"
            >
              <div class="theme-preview">
                <div class="preview-bar" :style="{ backgroundColor: theme.background }">
                  <div class="preview-dot" :style="{ backgroundColor: theme.accent }"></div>
                  <div class="preview-dot" :style="{ backgroundColor: theme.accent }"></div>
                  <div class="preview-dot" :style="{ backgroundColor: theme.accent }"></div>
                </div>
                <div class="preview-content" :style="{ backgroundColor: theme.surface }">
                  <div class="preview-block" :style="{ backgroundColor: theme.surfaceSoft }"></div>
                  <div class="preview-block" :style="{ backgroundColor: theme.surfaceSoft }"></div>
                </div>
              </div>
              <div class="theme-info">
                <h3 class="theme-name">
                  {{ theme.name }}
                  <Icon v-if="theme.id === 'glass'" icon="mdi:image" class="theme-image-icon" />
                </h3>
                <div v-if="themeId === theme.id" class="active-badge">Active</div>
              </div>
            </div>
          </div>
        </section>

        <section class="settings-section">
          <h2 class="section-title">Background Image</h2>
          <p class="section-description">Upload a custom background image for your dashboard</p>
          <div class="hint-box">
            <Icon icon="mdi:information-outline" />
            <span
              >Background images are only visible when using themes with the
              <Icon icon="mdi:image" class="inline-icon" /> icon (e.g., Glass theme)</span
            >
          </div>

          <div class="background-controls">
            <input
              ref="fileInputRef"
              type="file"
              accept="image/*"
              style="display: none"
              @change="handleFileUpload"
            />

            <div v-if="hasBackground" class="background-preview">
              <img :src="backgroundSettingsStore.imageUrl!" alt="Background preview" />
            </div>

            <div class="background-actions">
              <button class="action-button primary" @click="triggerFileUpload">
                <Icon icon="mdi:image-plus" />
                {{ hasBackground ? 'Change Image' : 'Upload Image' }}
              </button>
              <button v-if="hasBackground" class="action-button danger" @click="removeBackground">
                <Icon icon="mdi:image-remove" />
                Remove Image
              </button>
            </div>

            <div v-if="hasBackground" class="blur-control">
              <label class="blur-label">
                <span>Blur Amount: {{ backgroundSettingsStore.blur }}px</span>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  :value="backgroundSettingsStore.blur"
                  @input="
                    (e) =>
                      backgroundSettingsStore.setBlur(Number((e.target as HTMLInputElement).value))
                  "
                  class="blur-slider"
                />
              </label>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-view {
  min-height: 100vh;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.settings-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.back-button {
  background: var(--surface);
  border-radius: 0.5rem;
  width: 2.5rem;
  height: 2.5rem;
  min-width: 2.5rem;
  min-height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;
  color: var(--text);
  transition: all 0.2s;
  padding: 0;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.back-button:hover {
  background: var(--surface-soft);
  border-color: var(--accent);
  color: var(--accent);
}

.back-button svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.settings-header h1 {
  font-size: 2rem;
  font-weight: 600;
  color: var(--text);
  margin: 0;
}

.settings-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  background: var(--surface);
  border-radius: 1rem;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.tab-button {
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: all 0.2s;
}

.tab-button:hover {
  color: var(--text);
}

.tab-button.active {
  color: var(--text);
  background-color: var(--surface-soft);
  border-radius: 1rem;
}

.settings-content {
  background: var(--surface);
  border-radius: 1rem;
  padding: 2rem;
  border: 1px solid var(--border);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.settings-section {
  margin-bottom: 2rem;
}

.settings-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text);
  margin: 0 0 0.5rem 0;
}

.section-description {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin: 0 0 1.5rem 0;
}

.theme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.theme-card {
  border: 2px solid var(--border);
  border-radius: 0.75rem;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
  background: var(--surface-soft);
}

.theme-card:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
}

.theme-card.active {
  border-color: var(--accent);
}

.theme-preview {
  height: 120px;
  position: relative;
}

.preview-bar {
  height: 30%;
  display: flex;
  align-items: center;
  padding: 0 0.75rem;
  gap: 0.5rem;
}

.preview-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.preview-content {
  height: 70%;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.preview-block {
  flex: 1;
  border-radius: 0.25rem;
}

.theme-info {
  padding: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.theme-name {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.theme-image-icon {
  width: 16px;
  height: 16px;
  color: var(--accent);
  flex-shrink: 0;
}

.active-badge {
  font-size: 0.75rem;
  color: var(--accent);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.hint-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--surface-soft);
  border-radius: 0.5rem;
  border: 1px solid var(--border);
  margin-bottom: 1.5rem;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.hint-box svg:first-child {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: var(--accent);
}

.inline-icon {
  width: 14px;
  height: 14px;
  vertical-align: middle;
  margin: 0 2px;
  color: var(--accent);
}

.background-controls {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.background-preview {
  width: 100%;
  max-width: 600px;
  aspect-ratio: 16 / 9;
  border-radius: 0.75rem;
  overflow: hidden;
  border: 2px solid var(--border);
}

.background-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.background-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.action-button svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.action-button.primary {
  background: var(--accent);
  color: white;
}

.action-button.primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.action-button.danger {
  background: var(--surface);
  color: #ef4444;
  border: 1px solid var(--border);
}

.action-button.danger:hover {
  background: #ef4444;
  color: white;
  border-color: #ef4444;
}

.blur-control {
  max-width: 600px;
}

.blur-label {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.blur-label span {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text);
}

.blur-slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: var(--surface-soft);
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
}

.blur-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--accent);
  cursor: pointer;
  transition: all 0.2s;
}

.blur-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.blur-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--accent);
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.blur-slider::-moz-range-thumb:hover {
  transform: scale(1.2);
}

@media (max-width: 640px) {
  .settings-view {
    padding: 1rem;
  }

  .settings-content {
    padding: 1rem;
  }

  .theme-grid {
    grid-template-columns: 1fr;
  }

  .background-actions {
    flex-direction: column;
  }

  .action-button {
    width: 100%;
    justify-content: center;
  }
}
</style>
