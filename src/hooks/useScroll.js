import {useEffect, useRef, useState} from 'react'

/**
 * @typedef {Object} UseScrollOptions
 * @property {number?} maxY
 * @property {number?} minY
 */

const DEFAULT_OPTIONS = {
  maxY: Number.MAX_SAFE_INTEGER,
  minY: 0,
}

/**
 * @param {UseScrollOptions?} options
 * @return {{scrollY: number, scrollTo: scrollTo}}
 */
function useScroll(options) {
  const [scrollY, setScrollY] = useState(0)
  const optionsRef = useRef(options)

  // update the optionsRef when the options change
  useEffect(() => {
    optionsRef.current = {...DEFAULT_OPTIONS, ...options}
  }, [options])

  // clamp the scrollY value to the min/max
  const clamp = v => {
    return Math.min(
      Math.max(v, optionsRef.current.minY),
      optionsRef.current.maxY,
    )
  }

  // bind/unbind a scroll listener on mount
  useEffect(() => {
    const scrollHandler = e => {
      setScrollY(s => clamp(s + e.deltaY))
    }

    window.addEventListener('wheel', scrollHandler)

    return () => {
      window.removeEventListener('wheel', scrollHandler)
    }
  }, [])

  return {
    /**
     * @param {number} yLoc
     */
    scrollTo: yLoc => {
      setScrollY(clamp(yLoc))
    },
    scrollY: -scrollY, // we make it negative so that minus = down
  }
}

export default useScroll
