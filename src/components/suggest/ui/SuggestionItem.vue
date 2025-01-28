<script setup lang="ts">
import { computed, defineProps, type HTMLAttributes } from 'vue'
import { type ISuggestEntity } from '@/components/suggest/api'
import AvatarSVG from '@/assets/icons/avatar.svg'

type SuggestionItem = {
  item: ISuggestEntity
  as?: string
  attrs?: HTMLAttributes
  isSelected: boolean
  tabindex?: number
}

const { item, as = 'div', attrs, tabindex = 0, ...props } = defineProps<SuggestionItem>()
const avatar = computed(() => item.avatar || AvatarSVG)

const emit = defineEmits(['click', 'onEnter'])
</script>

<template>
  <component
    :is="as"
    class="suggestion-item"
    :class="{ selected: props.isSelected }"
    @click="emit('click')"
    v-bind="attrs"
    :tabindex="tabindex"
  >
    <img :src="avatar" class="suggestion-item-avatar" alt="Аватар пользователя" />
    <div class="suggestion-item-content">
      <span class="suggestion-item-name">{{ item.name ?? item.alias }}</span>
      <span class="suggestion-item-alias">{{ item.alias }}</span>
    </div>
  </component>
</template>

<style scoped>
.suggestion-item.selected {
  background-color: #d0eaff;
}

.suggestion-item {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  cursor: pointer;
}

.suggestion-item:focus,
.suggestion-item:hover {
  background-color: #f0f0f0;
}

.suggestion-item-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  margin-right: 1rem;
}

.suggestion-item-content {
  display: flex;
  flex-direction: column;
}

.suggestion-item-name {
  font-weight: bold;
}

.suggestion-item-alias {
  color: #666;
  font-size: 0.8rem;
}
</style>
