import {useEffect, useRef, useState} from 'react'

/**
 * @typedef {Object} UseScrollOptions
 * @property {number?} maxY
 * @property {number?} minY
 * @property {number?} maxX
 * @property {number?} minX
 * @property {string?} horizontalScrollKey
 * @property {string?} zoomKey
 */

const DEFAULT_OPTIONS = {
  maxY: Number.MAX_SAFE_INTEGER,
  minY: 0,
  maxX: Number.MAX_SAFE_INTEGER,
  minX: 0,
}

const MAX_ZOOM = 4
const MIN_ZOOM = 0.25
const ZOOM_SCALE = 1.35

/**
 * @param {UseScrollOptions?} options
 * @return {{scrollY: number, scrollTo: scrollTo, scrollX: number}}
 */
function useScroll(options) {
  const [scrollY, setScrollY] = useState(0)
  const [scrollX, setScrollX] = useState(0)
  const [scale, setScale] = useState(1)
  const isShiftRef = useRef(false)
  const isZoomRef = useRef(false)
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
      if (isZoomRef.current) {
        const zoomChange = e.deltaY > 0 ? 1 / ZOOM_SCALE : ZOOM_SCALE
        setScale(s => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, s * zoomChange)))
      } else if (isShiftRef.current) {
        setScrollX(s => clampX(s + e.deltaY))
      } else {
        setScrollY(s => clampY(s + e.deltaY))
      }
    }

    const keyDownHandler = e => {
      if (e.key === options.horizontalScrollKey) {
        isShiftRef.current = true
      }
      if (e.key === options.zoomKey) {
        isZoomRef.current = true
      }
    }

    const keyUpHandler = e => {
      if (e.key === options.horizontalScrollKey) {
        isShiftRef.current = false
      }
      if (e.key === options.zoomKey) {
        isZoomRef.current = false
      }
    }

    window.addEventListener('wheel', scrollHandler)
    window.addEventListener('keydown', keyDownHandler)
    window.addEventListener('keyup', keyUpHandler)

    return () => {
      window.removeEventListener('wheel', scrollHandler)
      window.removeEventListener('keydown', keyDownHandler)
      window.removeEventListener('keyup', keyUpHandler)
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
    scale: scale,
  }
}

export default useScroll
