<script setup lang="ts">
import UiInput from '@/components/shared/ui/UiInput.vue'
import UiLabel from '@/components/shared/ui/UiLabel.vue'
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { type ISuggestEntity, ApiService, type SuggestConfig } from '@/components/suggest/api'
import UiTag from '@/components/shared/ui/UiTag.vue'
import SuggestionItem from '@/components/suggest/ui/SuggestionItem.vue'
import { useDebounce } from '@/composables/useDebounce'
import UiNotificationMessage from '@/components/shared/ui/UiNotificationMessage.vue'
import { createSuggestState, processApiResponse } from '@/components/suggest/models'

const props = defineProps({
  apiConfig: {
    type: Object as () => SuggestConfig<ISuggestEntity, { data?: ISuggestEntity[] }>,
    required: true,
  },
  maxTags: { type: Number, default: 1 },
  required: { type: Boolean, default: true },
})

const baseValidationHTML = {
  minlength: 3,
  autocomplete: 'off',
  'aria-label': 'Поле ввода',
  'aria-controls': 'result-list',
  placeholder: 'Введите логин',
  name: 'text',
  type: 'text',
  required: props.required,
}

const tagsState = ref<ISuggestEntity[]>([])
const suggestionResponse = ref<ISuggestEntity[]>([])
const notificationMessage = ref<string | null>(null)
const isLoading = ref(false)
const multiselectCount = props.maxTags
const selectedIndex = ref<number | null>(null)
const inputRef = ref<InstanceType<typeof UiInput> | null>(null)

const suggestState = createSuggestState({
  notificationMessage,
  isLoading,
  suggestionResponse,
  selectedIndex,
})

const searchQuery = ref('')
const apiService = new ApiService(props.apiConfig)

const sendQuery = async (query: string) => {
  await suggestState.sendQuery(query, (q: string) => apiService.fetchApi(q), processApiResponse)
}

const debouncedSendQuery = useDebounce(sendQuery)

const handleInput = (event: Event) => {
  const queryElement = event.target as HTMLInputElement

  if (queryElement.value) {
    searchQuery.value = queryElement.value
    debouncedSendQuery(searchQuery.value)
  } else {
    suggestState.reset()
  }
}

const handleKeydownInput = (event: KeyboardEvent) => {
  const handlers = {
    ArrowDown: () => {
      selectedIndex.value = Math.min(
        suggestionResponse.value.length - 1,
        (selectedIndex.value ?? -1) + 1,
      )
    },
    ArrowUp: () => {
      selectedIndex.value = Math.max(0, (selectedIndex.value ?? 1) - 1)
    },
    Enter: () => {
      event.preventDefault()
      if (selectedIndex.value !== null) {
        addTag(suggestionResponse.value[selectedIndex.value])
      }
    },
  }

  const handler = handlers[event.key as keyof typeof handlers]
  handler?.()

  showResults.value = true

  nextTick(() => {
    const selectedElement = document.querySelector(
      `.results>.results-list li:nth-child(${(selectedIndex.value ?? 0) + 1})`,
    )
    selectedElement?.scrollIntoView({
      block: 'nearest',
      behavior: 'smooth',
    })
  })
}

const addTag = (event?: ISuggestEntity | null) => {
  if (!event || !event.alias) return

  if (multiselectCount >= tagsState.value.length) {
    tagsState.value.push(event)
  }
  if (multiselectCount <= tagsState.value.length && suggestionResponse.value.length > 0) {
    suggestionResponse.value = []
    selectedIndex.value = null
  }
  searchQuery.value = ''
}

const removeTag = (payload: ISuggestEntity) => {
  console.log(`Удаляем ${payload.alias}`)

  tagsState.value = tagsState.value.filter((tag) => tag.alias !== payload.alias)

  if (tagsState.value.length < multiselectCount) {
    suggestionResponse.value = []
  }

  nextTick(() => {
    inputRef.value?.$el.focus()
  })
}

const addAlias = (params: ISuggestEntity) => {
  return {
    ...params,
    alias: params.alias.startsWith('@') ? '' : `@${params.alias.trim()}`,
  }
}

const closeNotification = () => (notificationMessage.value = null)

// Hide the results when clicking outside
const showResults = ref(true)

const handleClickOutside = (event: MouseEvent) => {
  const labelElement = document.querySelector('#ui-label')
  if (labelElement && !labelElement.contains(event.target as Node)) {
    showResults.value = false
    suggestionResponse.value = []
    selectedIndex.value = null
    notificationMessage.value = null
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <form @submit.prevent>
    <UiLabel
      id="ui-label"
      :required="props.required"
      :tags="tagsState"
      :max-tags="multiselectCount"
      :results="suggestionResponse"
      :is-show-results="showResults && !isLoading"
      @click="showResults = true"
      :selected-index="selectedIndex"
    >
      <slot />
      <template #item="{ item }">
        <UiTag
          v-if="(item as ISuggestEntity).alias"
          :value="addAlias(item as ISuggestEntity)"
          @remove="removeTag(item as ISuggestEntity)"
        />
      </template>
      <template #input>
        <UiInput
          ref="inputRef"
          v-model="searchQuery"
          :attrs="baseValidationHTML"
          @input="handleInput"
          @keydown="handleKeydownInput"
          :aria-activedescendant="selectedIndex !== null ? `result-item-${selectedIndex}` : ''"
        />
      </template>

      <template #result="{ el, index }">
        <SuggestionItem
          :item="addAlias(el as ISuggestEntity)"
          :is-selected="selectedIndex === index"
          @click="addTag(el as ISuggestEntity)"
        />
      </template>
      <template #footer>
        <UiNotificationMessage
          v-if="notificationMessage"
          :message="notificationMessage"
          :type="isLoading ? 'loading' : suggestionResponse.length === 0 ? 'warning' : 'error'"
          @close="closeNotification"
          aria-live="polite"
        />
      </template>
    </UiLabel>
  </form>
</template>
