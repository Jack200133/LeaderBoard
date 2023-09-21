import { useEffect, useState } from 'react'

const useStickyState = (defaultValue, key, overrides = {}) => {
  const [value, setValue] = useState(() => {
    const stickyValue = window.localStorage.getItem(key)
    // Verificamos si el valor obtenido de localStorage es un array.
    const parsedStickyValue = JSON.parse(stickyValue)
    const isStickyArray = Array.isArray(parsedStickyValue)

    if (stickyValue !== null) {
      if (isStickyArray) {
        // Si el valor es un array, simplemente lo retornamos.
        return parsedStickyValue
      }
      // Si no es un array, fusionamos los objetos.
      return { ...defaultValue, ...parsedStickyValue, ...overrides }
    }
    return defaultValue
  })

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}

export default useStickyState
