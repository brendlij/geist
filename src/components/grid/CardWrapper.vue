<script setup lang="ts">
interface Props {
  id: number
  col: number
  row: number
  colSpan: number
  rowSpan: number
  isDragging: boolean
  index: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  dragStart: [index: number]
  dragOver: [e: DragEvent]
  drop: [index: number]
}>()

function handleDragStart() {
  emit('dragStart', props.index)
}

function handleDragOver(e: DragEvent) {
  e.preventDefault()
  e.dataTransfer!.dropEffect = 'move'
  emit('dragOver', e)
}

function handleDrop(e: DragEvent) {
  e.preventDefault()
  emit('drop', props.index)
}
</script>

<template>
  <div
    draggable="true"
    @dragstart="handleDragStart"
    @dragover="handleDragOver"
    @drop="handleDrop"
    class="card-wrapper"
    :data-dragging="isDragging"
    :style="{
      gridColumn: `${col} / span ${colSpan}`,
      gridRow: `${row} / span ${rowSpan}`,
    }"
  >
    <slot />
  </div>
</template>

<style scoped>
.card-wrapper {
  background-color: var(--surface);
  border: 2px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  cursor: move;
  user-select: none;
  transition: all var(--transition-base);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  color: var(--text);
  text-align: center;
  height: 100%;
  overflow: hidden;
}

.card-wrapper:hover {
  border-color: var(--accent);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.card-wrapper[data-dragging='true'] {
  opacity: 0.5;
}
</style>
