import { defaultSuggestConfig } from './configs'

export interface ApiError {
  httpCode?: number
  message?: string
  data?: unknown
  errorCode?: string | number
}

export interface SuggestConfig<T, R = unknown> {
  apiEndpoint: string | ((query: string) => string)
  minQueryLength?: number
  transformQuery?: (query: string) => string
  transformResponse?: (response: R) => T[] | Promise<T[]>
  handleError?: (error: ApiError | Error) => string
  fetchOptions?: RequestInit
  headers?: Record<string, string>
  queryParamName?: string
}

export interface FetchResult<T> {
  data?: T[]
  abort?: boolean
}

export class ApiService<T, R = unknown> {
  private controller: AbortController
  private config: SuggestConfig<T, R>

  constructor(config: Partial<SuggestConfig<T, R>> = {}) {
    this.controller = new AbortController()
    this.config = Object.assign({}, defaultSuggestConfig, config) as SuggestConfig<T, R>
  }

  async fetchApi(query: string): Promise<FetchResult<T>> {
    this.controller.abort()
    this.controller = new AbortController()

    try {
      const transformedQuery = this.config.transformQuery!(query)

      if (transformedQuery.length < (this.config.minQueryLength || 3)) {
        return { data: [] }
      }

      const endpoint =
        typeof this.config.apiEndpoint === 'function'
          ? this.config.apiEndpoint(transformedQuery)
          : this.config.apiEndpoint

      const url = new URL(endpoint)
      url.searchParams.append(this.config.queryParamName!, transformedQuery)

      console.debug(`[ApiService] Fetching: ${url.toString()}`)

      const response = await fetch(url.toString(), {
        signal: this.controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
        ...this.config.fetchOptions,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)

        if (errorData && errorData.message) {
          throw errorData
        }

        throw {
          httpCode: response.status,
          message: this.config.handleError!({ httpCode: response.status }),
          data: errorData,
        }
      }

      const jsonResponse: R = await response.json()
      const data = await this.config.transformResponse!(jsonResponse)
      return { data }
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('The request was canceled')
        return { abort: true }
      } else {
        if (error && typeof error === 'object' && 'message' in error && 'httpCode' in error) {
          const handledError = error as ApiError
          const errorObject: ApiError = {
            ...handledError,
            message: handledError.message || this.config.handleError!(handledError),
          }
          return Promise.reject(errorObject)
        }

        return Promise.reject(error)
      }
    }
  }

  cancel() {
    console.log('Отмена запроса')
    this.controller.abort()
  }
}
