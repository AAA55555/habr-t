<script setup lang="ts">
import type { ISuggestEntity } from '@/components/suggest/api'

const props = defineProps<{ value: ISuggestEntity }>()
const emit = defineEmits(['remove'])
</script>

<template>
  <div class="ui-tag">
    <span class="alias">{{ props.value.alias }}</span>
    <button @click="emit('remove', props.value)" title="Удалить" class="button">X</button>
  </div>
</template>

<style scoped>
.ui-tag {
  padding: 0.25rem;
  background: var(--color-primary);
  border-radius: 0.25rem;
  height: 100%;
  display: flex;
  align-items: center;
  color: var(--white);
  gap: 0.5rem;

  &:has(button:active),
  &:has(button:focus) {
    opacity: 80%;
    outline: 1px solid var(--color-primary);
  }
}

.button {
  height: 100%;
  display: inline-block;
  border: none;
  background: none;
  cursor: pointer;
  color: var(--white);
  box-sizing: border-box;

  &:hover {
    opacity: 70%;
  }

  &:active,
  &:focus {
    outline: none;
  }
}
</style>
