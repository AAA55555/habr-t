<script setup lang="ts">
import ResultList from '@/components/suggest/ui/ResultList.vue'

type LabelType<T = unknown> = {
  required?: boolean
  tags: T[]
  maxTags?: number
  results: T[]
  isShowResults?: boolean
  selectedIndex: number | null
}

const { maxTags = 1, isShowResults = true, ...props } = defineProps<LabelType>()
</script>

<template>
  <div class="ui-label" role="group">
    <p class="ui-label-text">
      <sup v-if="required" class="badge">*</sup>
      <slot />
    </p>
    <ul class="tags" role="list">
      <template v-if="tags.length">
        <li v-for="(item, index) in tags.slice(0, maxTags)" :key="index" role="listitem">
          <slot name="item" v-bind="{ item }"></slot>
        </li>
      </template>

      <li v-if="$slots.input && tags.length < maxTags" :class="{ 'item-full': tags.length === 0 }">
        <slot name="input" v-bind="{ ...props }" />
      </li>
    </ul>
    <div class="wrapper-results">
      <div class="results-absolute">
        <ResultList
          :is-multiselectable="maxTags > 1"
          :selected-index
          :items="results"
          v-if="results.length && isShowResults"
        >
          <template #result="{ el, index }">
            <slot name="result" v-bind="{ el, index }" />
          </template>
        </ResultList>
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>
<style scoped>
.ui-label {
  display: block;
  font-weight: 700;
  width: 100%;
  padding: 0.3rem;
}

.ui-label-text {
  margin-bottom: 0.5rem;
}

.badge {
  color: red;
}

.tags {
  border-radius: 0.25rem;
  border: 1px solid var(--color-border);
  padding: 0.5rem;
  list-style: none;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.item-full {
  width: 100%;
}

.wrapper-results {
  position: relative;
}

.wrapper-results .results-absolute {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  z-index: 10;
  background: var(--color-l-bg);
}
</style>
