import type { ISuggestEntity, ResponseSuggestApi } from './../api'

export function isResponseSuggestApi(response: unknown): response is ResponseSuggestApi {
  return Array.isArray(response) && response.every(isSuggestEntity)
}

export function isSuggestEntity(item: unknown): item is ISuggestEntity {
  return (
    typeof item === 'object' &&
    item !== null &&
    'alias' in item &&
    'type' in item &&
    ((item as ISuggestEntity).type === 'user' || (item as ISuggestEntity).type === 'company')
  )
}
