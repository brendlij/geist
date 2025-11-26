<script setup lang="ts">
import { ref, computed } from 'vue'
import DashboardGrid from '@/components/grid/DashboardGrid.vue'
import CardWrapper from '@/components/grid/CardWrapper.vue'

type GridWidget = {
  id: number
  title: string
  col: number
  row: number
  colSpan: number
  rowSpan: number
}

const gridColumns = ref(12)
const gridGap = ref(16)
const rowHeight = ref(80)

const widgets = ref<GridWidget[]>([
  { id: 1, title: '🎨 Beautiful Themes', col: 1, row: 1, colSpan: 6, rowSpan: 2 },
  { id: 2, title: '⚡ Fast & Responsive', col: 7, row: 1, colSpan: 6, rowSpan: 2 },
  { id: 3, title: '📦 Pocketbase Ready', col: 1, row: 3, colSpan: 6, rowSpan: 2 },
  { id: 4, title: '🎯 Simple Structure', col: 7, row: 3, colSpan: 6, rowSpan: 2 },
  { id: 5, title: ' Simple Structures', col: 7, row: 5, colSpan: 6, rowSpan: 2 },
])

const dragIndex = ref<number | null>(null)

function onDragStart(index: number) {
  dragIndex.value = index
  console.log('Drag started on card:', index)
}

function onDrop(index: number) {
  console.log('Drop on card:', index, 'from card:', dragIndex.value)
  if (dragIndex.value === null || dragIndex.value === index) return

  const updated = [...widgets.value]
  const draggedCard = updated[dragIndex.value]
  const targetCard = updated[index]

  if (!draggedCard || !targetCard) return

  // Swap positions
  const temp = {
    col: draggedCard.col,
    row: draggedCard.row,
    colSpan: draggedCard.colSpan,
    rowSpan: draggedCard.rowSpan,
  }
  draggedCard.col = targetCard.col
  draggedCard.row = targetCard.row
  draggedCard.colSpan = targetCard.colSpan
  draggedCard.rowSpan = targetCard.rowSpan

  targetCard.col = temp.col
  targetCard.row = temp.row
  targetCard.colSpan = temp.colSpan
  targetCard.rowSpan = temp.rowSpan

  widgets.value = updated
  dragIndex.value = null
  console.log('Cards positions swapped')
}

function onDragOver(e: DragEvent) {
  e.preventDefault()
  e.dataTransfer!.dropEffect = 'move'
}

function onGridDrop(col: number, row: number) {
  console.log('Dropped on grid position:', col, row, 'from card:', dragIndex.value)
  if (dragIndex.value === null) return

  const updated = [...widgets.value]
  const draggedCard = updated[dragIndex.value]

  if (!draggedCard) return

  // Move card to new position
  draggedCard.col = col
  draggedCard.row = row

  widgets.value = updated
  dragIndex.value = null
  console.log('Card moved to grid position')
}

// Calculate the maximum row needed
const maxRow = computed(() => {
  return Math.max(...widgets.value.map((w) => w.row + w.rowSpan - 1), 1)
})
</script>

<template>
  <div class="home-view">
    <div class="dashboard-header">
      <h1>Dashboard</h1>
      <div class="settings-panel">
        <div class="setting">
          <label>Columns:</label>
          <input v-model.number="gridColumns" type="range" min="4" max="24" />
          <span>{{ gridColumns }}</span>
        </div>
        <div class="setting">
          <label>Gap (px):</label>
          <input v-model.number="gridGap" type="range" min="0" max="48" />
          <span>{{ gridGap }}</span>
        </div>
        <div class="setting">
          <label>Row Height (px):</label>
          <input v-model.number="rowHeight" type="range" min="40" max="200" />
          <span>{{ rowHeight }}</span>
        </div>
      </div>
    </div>

    <DashboardGrid
      :columns="gridColumns"
      :gap="gridGap"
      :row-height="rowHeight"
      :max-row="maxRow"
      :dragged-card-col-span="dragIndex !== null ? widgets[dragIndex]?.colSpan || 6 : 6"
      :dragged-card-row-span="dragIndex !== null ? widgets[dragIndex]?.rowSpan || 2 : 2"
      @grid-drop="(col, row) => onGridDrop(col, row)"
    >
      <CardWrapper
        v-for="(widget, index) in widgets"
        :key="widget.id"
        :id="widget.id"
        :col="widget.col"
        :row="widget.row"
        :col-span="widget.colSpan"
        :row-span="widget.rowSpan"
        :is-dragging="dragIndex === index"
        :index="index"
        @drag-start="(idx) => onDragStart(idx)"
        @drag-over="onDragOver"
        @drop="(idx) => onDrop(idx)"
      >
        {{ widget.title }}
      </CardWrapper>
    </DashboardGrid>
  </div>
</template>

<style scoped>
.home-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  padding: var(--space-lg);
  overflow-y: auto;
  overflow-x: hidden;
}

.dashboard-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  background-color: var(--surface);
  padding: var(--space-lg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
}

.dashboard-header h1 {
  margin: 0;
  font-size: var(--font-size-2xl);
  color: var(--text);
}

.settings-panel {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-lg);
}

.setting {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.setting label {
  font-weight: 500;
  color: var(--text);
  min-width: 100px;
  font-size: var(--font-size-sm);
}

.setting input[type='range'] {
  width: 120px;
  cursor: pointer;
  accent-color: var(--accent);
  background-color: transparent;
}

.setting span {
  color: var(--accent);
  font-weight: 600;
  min-width: 30px;
  text-align: right;
  font-size: var(--font-size-sm);
}

@media (max-width: 768px) {
  .settings-panel {
    flex-direction: column;
  }

  .setting {
    flex-direction: column;
    gap: var(--space-xs);
  }

  .setting label {
    min-width: auto;
  }
}
</style>
