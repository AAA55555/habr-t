export interface ISuggestEntity {
  avatar: string
  name?: string
  alias: string
  type: 'user' | 'company'
}

export type ResponseSuggestApi = ISuggestEntity[]
