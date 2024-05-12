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
export function getCoordinateKey(s) {
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

/**
 * @param {number} rem
 * @return {number}
 */
export function convertRemToPixels(rem) {
  return (
    rem * parseFloat(window.getComputedStyle(document.documentElement).fontSize)
  )
}

/**
 * @param {*} obj
 * @returns {*}
 */
export function clone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * @param {number} sides // returns [0 to sides)
 * @param {Generator?} rand
 * @returns {number}  */
export function rollDice(sides, rand) {
  // if there's no rand generator we can just use random and floor
  if (!rand) {
    return Math.floor(Math.random() * sides) + 1
  }

  // rand.next.val() is a number between 0 and 99 so if sides is <= 100 we can just the modulo that directly
  if (sides <= 100) {
    return (rand.next().value % sides) + 1
  }

  // modulo numerator needs to have a chance at being > sides for modulo to feel fair
  // i.e., if sides was 1000, and we only used values between 0 and 99 it wouldn't be a fair dice roll since 900 values would be out of play
  // so we make sure the value has a real chance at being > sides so modulo is more fair.
  // by concatenating two digit number strings, we can generate a number > sides
  let neededIterations = ('' + sides).length / 2
  let numerator = ''
  do {
    numerator += '' + rand.next().value
    neededIterations--
  } while (neededIterations > 0)
  return (parseInt(numerator) % sides) + 1
}

/**
 * @param {number?} sides // sides === 2 would be a real coin, 3 would be 1/3 chance
 * @param {Generator?} rand
 * @returns {boolean}
 */
export function flipCoin(sides = 2, rand) {
  return rollDice(sides, rand) === 1
}
