import { useEffect, useState } from 'react'

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(initialValue)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') {
      setHydrated(true)
      return
    }

    try {
      const item = window.localStorage.getItem(key)

      if (item === null) {
        window.localStorage.setItem(key, JSON.stringify(initialValue))
        setStoredValue(initialValue)
      } else {
        const parsedValue = JSON.parse(item)
        setStoredValue(parsedValue)
      }
    } catch (error) {
      console.warn(`Unable to restore ${key} from localStorage.`, error)
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
    } finally {
      setHydrated(true)
    }
  }, [key, initialValue])

  useEffect(() => {
    if (!hydrated || typeof window === 'undefined') {
      return
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
    } catch (error) {
      console.warn(`Unable to persist ${key} to localStorage.`, error)
    }
  }, [hydrated, key, storedValue])

  return [storedValue, setStoredValue, hydrated]
}

export default useLocalStorage
