import type { ISuggestEntity } from './types.ts'
import type { SuggestConfig } from './api.service.ts'

export const defaultSuggestConfig: SuggestConfig<ISuggestEntity, { data?: ISuggestEntity[] }> = {
  apiEndpoint: 'https://habr.com/kek/v2/publication/suggest-mention',
  minQueryLength: 3,
  transformQuery: (query) => query,
  transformResponse: (response: { data?: ISuggestEntity[] }) => response.data || [],
  handleError: (error) => {
    if ('httpCode' in error && error.httpCode !== undefined) {
      if (error.httpCode >= 400 && error.httpCode < 500)
        return 'Некорректный запрос. Проверьте введенные данные.'
      if (error.httpCode >= 500) return 'Внутренняя ошибка сервера. Попробуйте позже.'
    }
    return error.message || 'Неизвестная ошибка'
  },
  queryParamName: 'q',
}

export const defaultSuggestConfigError: SuggestConfig<ISuggestEntity, { data?: ISuggestEntity[] }> =
  {
    apiEndpoint: 'https://habr.com/kek/v2/publication/suggest-mention?q=',
    minQueryLength: 3,
    transformQuery: (query) => query,
    transformResponse: (response: { data?: ISuggestEntity[] }) => response.data || [],
    handleError: (error) => {
      if ('httpCode' in error && error.httpCode !== undefined) {
        if (error.httpCode >= 400 && error.httpCode < 500)
          return 'Некорректный запрос. Проверьте введенные данные.'
        if (error.httpCode >= 500) return 'Внутренняя ошибка сервера. Попробуйте позже.'
      }
      return error.message || 'Неизвестная ошибка'
    },
    queryParamName: '',
  }
