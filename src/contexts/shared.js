import {createContext} from 'react'

/**
 * A function to write to storage. This is called whenever a settings change is made
 * @param {*} obj
 * @param {string} cacheKey
 */
function flush(cacheKey, obj) {
  localStorage[cacheKey] = JSON.stringify(obj)
}

/**
 * @param {*} initialState
 * @param {string} cacheKey
 * @returns {[React.Context, *, (object: *) => void]}
 */
export function contextFactory(initialState, cacheKey) {
  // hydrate from our stored value
  const storedValue = localStorage[cacheKey]

  const storedObject =
    typeof storedValue === 'string' && !!storedValue
      ? JSON.parse(storedValue)
      : null

  const hydratedSettings = storedObject
    ? {...initialState, ...storedObject}
    : initialState

  const context = createContext({})

  return [context, hydratedSettings, flush.bind(null, cacheKey)]
}
