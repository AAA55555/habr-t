import { createSuggestState } from './suggestState.ts'
import { isResponseSuggestApi } from './typeGuards.ts'

export function handleApiError(error: unknown): string {
  if (error instanceof Error) return error.message
  if (error && typeof error === 'object' && 'message' in error) {
    return (error as { message: string }).message
  }
  return 'Неизвестная ошибка'
}

export function processApiResponse(
  responseData: unknown,
  state: ReturnType<typeof createSuggestState>,
) {
  if (responseData && typeof responseData === 'object' && 'data' in responseData) {
    const data = (responseData as { data: unknown }).data

    if (isResponseSuggestApi(data)) {
      state.setSuccess(data.length ? data : [])
    } else {
      state.setError('Неверный формат ответа от сервера')
    }
  } else {
    state.setError('Неверный формат ответа от сервера')
  }
}
