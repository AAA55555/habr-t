import { ref } from 'vue'

export function useDebounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T,
  delay = 300,
) {
  const timeoutId = ref<number | null>(null)

  return (...args: Parameters<T>): void => {
    if (timeoutId.value !== null) {
      clearTimeout(timeoutId.value)
    }

    timeoutId.value = window.setTimeout(() => {
      void fn(...args)
      timeoutId.value = null
    }, delay)
  }
}
