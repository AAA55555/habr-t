import type { ISuggestEntity } from './../api'
import type { Ref } from 'vue'
import { handleApiError } from './utils.ts'

export interface SuggestStateOptions {
  notificationMessage: Ref<string | null>
  isLoading: Ref<boolean>
  suggestionResponse: Ref<ISuggestEntity[]>
  selectedIndex: Ref<number | null>
}

export interface SuggestState {
  reset: () => void
  setLoading: (message?: string) => void
  setError: (error: unknown | string) => void
  setSuccess: (data: ISuggestEntity[]) => void
  isValidQuery: (query: string, minLength?: number) => boolean
  sendQuery: (
    query: string,
    fetchApi: (query: string) => Promise<unknown>,
    processResponse?: (responseData: unknown, state: SuggestState) => void,
  ) => Promise<void>
}

export function createSuggestState(options: SuggestStateOptions): SuggestState {
  return {
    reset() {
      options.notificationMessage.value = null
      options.isLoading.value = true
      options.suggestionResponse.value = []
      options.selectedIndex.value = null
    },

    setLoading(message: string = 'Идет поиск...') {
      options.isLoading.value = true
      options.notificationMessage.value = message
    },

    setError(error: unknown | string) {
      options.notificationMessage.value = typeof error === 'string' ? error : handleApiError(error)
      options.isLoading.value = false
      options.suggestionResponse.value = []
    },

    setSuccess(data: ISuggestEntity[]) {
      options.suggestionResponse.value = data
      options.notificationMessage.value = data.length ? null : 'По вашему запросу ничего не найдено'
      options.isLoading.value = false
    },

    isValidQuery(query: string, minLength: number = 3): boolean {
      return query.trim().length >= minLength
    },

    async sendQuery(
      query: string,
      fetchApi: (query: string) => Promise<unknown>,
      processResponse?: (responseData: unknown, state: SuggestState) => void,
    ) {
      this.reset()
      this.setLoading()

      if (!this.isValidQuery(query)) {
        this.setError('Введите не менее 3 символов')
        return
      }

      try {
        const responseData = await fetchApi(query)

        if (processResponse) {
          processResponse(responseData, this)
        } else {
          this.setSuccess(responseData as ISuggestEntity[])
        }
      } catch (error) {
        this.setError(error)
      }
    },
  }
}
