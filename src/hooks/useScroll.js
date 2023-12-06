import {useEffect, useRef, useState} from 'react'

/**
 * @typedef {Object} UseScrollOptions
 * @property {number?} maxY
 * @property {number?} minY
 * @property {number?} maxX
 * @property {number?} minX
 * @property {string?} horizontalScrollKey
 */

const DEFAULT_OPTIONS = {
  maxY: Number.MAX_SAFE_INTEGER,
  minY: 0,
  maxX: Number.MAX_SAFE_INTEGER,
  minX: 0,
}

/**
 * @param {UseScrollOptions?} options
 * @return {{scrollY: number, scrollTo: scrollTo, scrollX: number}}
 */
function useScroll(options) {
  const [scrollY, setScrollY] = useState(0)
  const [scrollX, setScrollX] = useState(0)
  const isShiftRef = useRef(false)
  const optionsRef = useRef(options)

  // update the optionsRef when the options change
  useEffect(() => {
    optionsRef.current = {...DEFAULT_OPTIONS, ...options}
  }, [options])

  // clamp the scrollY value to the min/max
  const clamp = (v, axis) => {
    return Math.min(
      Math.max(v, optionsRef.current[`min${axis}`]),
      optionsRef.current[`max${axis}`],
    )
  }

  const clampY = v => clamp(v, 'Y')
  const clampX = v => clamp(v, 'X')

  // bind/unbind a scroll listener on mount
  useEffect(() => {
    const scrollHandler = e => {
      if (isShiftRef.current) {
        setScrollX(s => clampX(s + e.deltaY))
      } else {
        setScrollY(s => clampY(s + e.deltaY))
      }
    }

    const shiftDownHandler = e => {
      if (e.key === options.horizontalScrollKey) {
        isShiftRef.current = true
      }
    }

    const shiftUpHandler = e => {
      if (e.key === options.horizontalScrollKey) {
        isShiftRef.current = false
      }
    }

    window.addEventListener('wheel', scrollHandler)
    window.addEventListener('keydown', shiftDownHandler)
    window.addEventListener('keyup', shiftUpHandler)

    return () => {
      window.removeEventListener('wheel', scrollHandler)
      window.removeEventListener('keydown', shiftDownHandler)
      window.removeEventListener('keyup', shiftUpHandler)
    }
  }, [])

  return {
    /**
     * @param {number} y
     * @param {number?} x
     */
    scrollTo: (y, x) => {
      setScrollY(clampY(y))
      if (typeof x === 'number') {
        setScrollX(clampX(x))
      }
    },
    scrollY: -scrollY, // we make it negative so that minus = down
    scrollX: -scrollX, // we make it negative so that minus = down
  }
}

export default useScroll
