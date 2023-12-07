import {useEffect, useRef, useState} from 'react'

/**
 * @typedef {Object} UseScrollOptions
 * @property {number} contentHeight
 * @property {number} viewHeight
 * @property {number?} contentWidth
 * @property {number?} viewWidth
 * @property {string?} horizontalScrollKey
 * @property {string?} zoomKey
 */

/**
 * @type {UseScrollOptions} ScrollSettings
 * @property {number} scaleClone
 */

const DEFAULT_OPTIONS = {
  scaleClone: 1,
}

function valOrZero(val) {
  return val || 0
}

const MAX_ZOOM = 4
const MIN_ZOOM = 0.05
const ZOOM_SCALE = 1.1

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
  const settingsRef = useRef(options)

  // update the settingsRef when the options change
  useEffect(() => {
    const newSettings = {...DEFAULT_OPTIONS, ...options, scaleClone: scale}
    newSettings.maxY = valOrZero(
      newSettings.contentHeight - newSettings.viewHeight,
    )
    newSettings.maxX = valOrZero(
      newSettings.contentWidth - newSettings.viewWidth,
    )
    settingsRef.current = newSettings
  }, [options])

  useEffect(() => {
    settingsRef.current.scaleClone = scale
  }, [scale])

  // clamp the scrollY value to the min/max
  const clamp = (v, axis) => {
    const viewDimension =
      settingsRef.current[axis === 'Y' ? 'viewHeight' : 'viewWidth']
    const contentDimension =
      settingsRef.current[axis === 'Y' ? 'contentHeight' : 'contentWidth']
    const scaleRef = settingsRef.current.scaleClone

    const effectiveContentSize = contentDimension * scaleRef

    // I don't full understand why these equations work, but they seemingly do.
    if (effectiveContentSize <= viewDimension) {
      return ((contentDimension - viewDimension) / 2) * scaleRef
    }

    const extraMinSpace = (viewDimension / 2) * (scaleRef - 1)

    return Math.min(
      Math.max(v, 0 - extraMinSpace),
      contentDimension * scaleRef - viewDimension - extraMinSpace,
    )
  }

  /*
  2400 - raw
  0.275 - scale
  715 - window
  -230.5 - translate

  2400 - raw
  0.25 - scale
  715 - window
  -210 - translate

  2400 - raw
  0.2 - scale
  715 - window
  -174 - translate

  2400 - raw
  0.1 - scale
  715 - window
  -90 - translate
   */

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
