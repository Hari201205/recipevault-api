import { useState } from 'react'

/**
 * useLocalStorage
 * Drop-in replacement for useState that persists the value in
 * localStorage under the given key.
 *
 * @param {string} key        - localStorage key
 * @param {*}      initialVal - value used when no stored entry exists
 */
export function useLocalStorage(key, initialVal) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialVal
    } catch {
      return initialVal
    }
  })

  const setValue = (value) => {
    try {
      // Support functional updates just like useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (err) {
      console.error(`useLocalStorage [${key}]:`, err)
    }
  }

  const removeValue = () => {
    try {
      setStoredValue(initialVal)
      window.localStorage.removeItem(key)
    } catch (err) {
      console.error(`useLocalStorage [${key}] remove:`, err)
    }
  }

  return [storedValue, setValue, removeValue]
}
