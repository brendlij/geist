<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  columns?: number
  gap?: number
  rowHeight?: number
  maxRow?: number
  draggedCardColSpan?: number
  draggedCardRowSpan?: number
}

const props = withDefaults(defineProps<Props>(), {
  columns: 12,
  gap: 16,
  rowHeight: 80,
  maxRow: 1,
  draggedCardColSpan: 6,
  draggedCardRowSpan: 2,
})

const emit = defineEmits<{
  gridDrop: [col: number, row: number]
}>()

const hoverCol = ref(0)
const hoverRow = ref(0)
const isDraggingOver = ref(false)

const gridStyle = computed(() => {
  const totalHeight = props.maxRow * props.rowHeight + (props.maxRow - 1) * props.gap
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${props.columns}, 1fr)`,
    gridTemplateRows: `repeat(${props.maxRow}, ${props.rowHeight}px)`,
    gap: `${props.gap}px`,
    height: `${totalHeight}px`,
  } as Record<string, string | number>
})

const ghostBoxStyle = computed(() => ({
  gridColumn: `${hoverCol.value} / span ${props.draggedCardColSpan}`,
  gridRow: `${hoverRow.value} / span ${props.draggedCardRowSpan}`,
  pointerEvents: 'none',
}))

function calculateGridPosition(clientX: number, clientY: number, rect: DOMRect) {
  const x = clientX - rect.left
  const y = clientY - rect.top

  // Calculate grid column and row from mouse position
  const colWidth = rect.width / props.columns
  const col = Math.ceil((x + props.gap / 2) / (colWidth + props.gap))
  const row = Math.ceil((y + props.gap / 2) / (props.rowHeight! + props.gap))

  return {
    col: Math.max(1, Math.min(col, props.columns)),
    row: Math.max(1, row),
  }
}

function handleGridDrop(e: DragEvent) {
  e.preventDefault()
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const pos = calculateGridPosition(e.clientX, e.clientY, rect)

  isDraggingOver.value = false
  emit('gridDrop', pos.col, pos.row)
}

function handleGridDragOver(e: DragEvent) {
  e.preventDefault()
  e.dataTransfer!.dropEffect = 'move'

  isDraggingOver.value = true
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const pos = calculateGridPosition(e.clientX, e.clientY, rect)

  hoverCol.value = pos.col
  hoverRow.value = pos.row
}

function handleGridDragLeave() {
  isDraggingOver.value = false
}
</script>

<template>
  <div
    class="dashboard-grid"
    :style="gridStyle"
    @drop="handleGridDrop"
    @dragover="handleGridDragOver"
    @dragleave="handleGridDragLeave"
  >
    <div v-if="isDraggingOver" class="ghost-box" :style="ghostBoxStyle" />
    <slot />
  </div>
</template>

<style scoped>
.dashboard-grid {
  background-color: transparent;
  padding: 0;
  border-radius: 0;
  border: none;
  overflow: visible;
}

.ghost-box {
  background-color: var(--accent-soft);
  border: 2px dashed var(--accent);
  border-radius: var(--radius-lg);
  opacity: 0.7;
  pointer-events: none;
}
</style>
