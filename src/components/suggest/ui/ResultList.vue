<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'

type Props<T> = {
  maxVisibleItems?: number
  items: T[]
  selectedIndex: number | null
  isMultiselectable: boolean
}

const { maxVisibleItems = 4, isMultiselectable = false, ...props } = defineProps<Props<unknown>>()

const resultsRef = ref<HTMLElement | null>(null)
const itemHeight = ref(0)

onMounted(() => {
  nextTick(() => {
    const firstItem = resultsRef.value?.querySelector('li')
    if (firstItem) {
      itemHeight.value = firstItem.getBoundingClientRect().height || 0
    }
  })
})
</script>

<template>
  <div class="results" id="results">
    <ul
      id="results-list"
      ref="resultsRef"
      class="results-list"
      :style="{ maxHeight: `${itemHeight * maxVisibleItems}px` }"
      role="listbox"
      aria-label="Список результатов"
      :aria-multiselectable="isMultiselectable"
    >
      <li
        v-for="(item, index) in props.items"
        :key="index"
        role="option"
        :id="`result-item-${index}`"
        :aria-selected="selectedIndex === index"
      >
        <slot name="result" v-bind="{ el: item, index }" />
      </li>
    </ul>
  </div>
</template>

<style scoped>
.results {
  overflow: hidden;
}

.results-list {
  display: flex;
  flex-direction: column;
  list-style: none;
  border: 1px solid var(--color-border);
  border-radius: 0.3rem;
  max-height: 150px;
  overflow-y: auto;
}
</style>
