import {createContext} from 'react'

/**
 * @param {*} defaultState
 * @param {string} cacheKey
 * @returns {*}
 */
function loadOrDefault(defaultState, cacheKey) {
  // hydrate from our stored value
  const storedValue = localStorage[cacheKey]

  const storedObject =
    typeof storedValue === 'string' && !!storedValue
      ? JSON.parse(storedValue)
      : null

  return storedObject ? {...defaultState, ...storedObject} : defaultState
}

/**
 * A function to write to storage. This is called whenever a settings change is made
 * @param {*} obj
 * @param {string} cacheKey
 */
function flush(cacheKey, obj) {
  const existing = loadOrDefault({}, cacheKey)
  localStorage[cacheKey] = JSON.stringify({...existing, ...obj})
}

/**
 * @param {*} initialState
 * @param {string} cacheKey
 * @returns {[React.Context, *, (object: *) => void]}
 */
export function contextFactory(initialState, cacheKey) {
  const hydratedSettings = loadOrDefault(initialState, cacheKey)

  const context = createContext({})

  return [context, hydratedSettings, flush.bind(null, cacheKey)]
}
