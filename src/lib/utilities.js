import {v4 as uuid} from 'uuid'
import {PieceType} from './constants'

/**
 * @param {string|Object<string, boolean>} classes
 * @returns {string}
 */
export function constructClassString(...classes) {
  return classes
    .filter(o => !!o)
    .reduce((acc, curr) => {
      if (typeof curr === 'string') {
        acc.push(curr)
      } else if (typeof curr === 'object') {
        acc.push(
          ...Object.entries(curr || {})
            .filter(([key, value]) => !!value)
            .map(([key, value]) => key),
        )
      }

      return acc
    }, [])
    .join(' ')
}

/**
 * @param {string} string
 * @return {string}
 */
export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

/**
 * @param {string} message
 * @param {number} iterations
 * @return {Promise<string>}
 */
export async function sha256(message, iterations = 1) {
  // encode as UTF-8
  const msgBuffer = new TextEncoder().encode(message)

  // hash the message
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)

  // convert ArrayBuffer to Array
  const hashArray = Array.from(new Uint8Array(hashBuffer))

  // convert bytes to hex string
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

  if (iterations > 1) {
    return sha256(hashHex, iterations - 1)
  }

  return hashHex
}

/**
 * @param {string} seedStr
 * @return {Promise<Generator>} // next().value is a number between 0 and 99
 */
export async function randomGenerator(seedStr) {
  const shas = await Promise.all([
    sha256(seedStr),
    sha256(seedStr, 2),
    sha256(seedStr, 3),
  ])
  const b64Code = btoa(shas.join(','))

  function* generator() {
    let i = 0
    while (true) {
      const num = b64Code.charCodeAt(i % b64Code.length) % 100
      i++
      yield num
    }
  }

  return generator()
}

/**
 * @param {string} word
 * @param {number} count
 * @param {boolean} includeCount
 * @return {string}
 */
export function pluralize(word, count, includeCount = false) {
  const result = count === 1 ? word : `${word}s`
  return includeCount ? `${count} ${result}` : result
}

/**
 * @param {Coordinate} s
 * @return {string}
 */
export function getSquareKey(s) {
  return `${s.row}-${s.column}`
}

/**
 * @param {Coordinate} s1
 * @param {Coordinate} s2
 * @return {boolean}
 */
export function isSameSquare(s1, s2) {
  return s1.row === s2.row && s1.column === s2.column
}
