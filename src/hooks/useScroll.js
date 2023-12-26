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
 * @typedef {UseScrollOptions} ScrollSettings
 * @property {number} zoomScale
 * @property {number} minZoom
 * @property {number} maxZoom
 *
 */

/**
 * @typedef {Object} UseScrollReturnValue
 * @property {number} scrollY
 * @property {number} scrollX
 * @property {number} scale
 * @property {(y: number, x?: number) => void} scrollTo
 * @property {(s: number) => void} zoomTo
 * @property {(y: number, x?: number) => void} scrollRelative
 * @property {(s: number) => void} zoomRelative
 */

const DEFAULT_OPTIONS = {
  zoomScale: 1.1,
  minZoom: 0.25,
  maxZoom: 2,
}

function valOrZero(val) {
  return val || 0
}

/**
 * @param {HTMLElement} ref
 * @param {UseScrollOptions?} options
 * @return {UseScrollReturnValue}
 */
function useScroll(ref, options) {
  const [scrollY, setScrollY] = useState(0)
  const [scrollX, setScrollX] = useState(0)
  const [scale, setScale] = useState(1)
  const isShiftRef = useRef(false)
  const isZoomRef = useRef(false)
  /** @type {{current: ScrollSettings}} */
  const settingsRef = useRef(options)
  const scaleCloneRef = useRef(scale)
  const lastTouchRef = useRef([])

  // update the settingsRef when the options change
  useEffect(() => {
    const newSettings = {...DEFAULT_OPTIONS, ...options}
    newSettings.maxY = valOrZero(
      newSettings.contentHeight - newSettings.viewHeight,
    )
    newSettings.maxX = valOrZero(
      newSettings.contentWidth - newSettings.viewWidth,
    )
    settingsRef.current = newSettings
  }, [options])

  useEffect(() => {
    scaleCloneRef.current = scale
  }, [scale])

  // clamp the scrollY value to the min/max
  const clamp = (v, axis) => {
    const viewDimension =
      settingsRef.current[axis === 'Y' ? 'viewHeight' : 'viewWidth']
    const contentDimension =
      settingsRef.current[axis === 'Y' ? 'contentHeight' : 'contentWidth']

    const effectiveContentSize = contentDimension * scaleCloneRef.current

    if (effectiveContentSize <= viewDimension) {
      return ((contentDimension - viewDimension) / 2) * scaleCloneRef.current
    }

    // I don't full understand why these equations work, but they seemingly do.
    const extraMinSpace = (viewDimension / 2) * (scaleCloneRef.current - 1)

    return Math.min(
      Math.max(v, 0 - extraMinSpace),
      contentDimension * scaleCloneRef.current - viewDimension - extraMinSpace,
    )
  }

  const clampY = v => clamp(v, 'Y')
  const clampX = v => clamp(v, 'X')

  // bind/unbind a scroll listener on mount
  useEffect(() => {
    if (!ref) {
      return
    }

    /**
     * @param {{deltaX: number, deltaY: number}} e
     */
    const scrollHandler = e => {
      if (isZoomRef.current) {
        const zoomChange =
          e.deltaY > 0
            ? 1 / settingsRef.current.zoomScale
            : settingsRef.current.zoomScale
        setScale(s =>
          Math.max(
            settingsRef.current.minZoom,
            Math.min(settingsRef.current.maxZoom, s * zoomChange),
          ),
        )
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

    const touchMoveHandler = e => {
      // TODO: Would like this to momentum scroll more +  some positioning bug currently
      const thisPos = {
        x: e.touches[0].clientX - settingsRef.current.viewWidth / 2,
        y: e.touches[0].clientY - settingsRef.current.viewHeight / 2,
      }
      lastTouchRef.current.push(thisPos)

      if (lastTouchRef.current.length > 3) {
        lastTouchRef.current.shift()
      }

      setScrollY(clampY(thisPos.y))
      setScrollX(clampX(thisPos.x))
    }

    const touchEndHandler = e => {
      const momentum = lastTouchRef.current.reduce((acc, curr, i, arr) => {
        if (i === 0) {
          return {...curr}
        }
        const prev = arr[i - 1]
        return {
          x: acc.x + curr.x - prev.x,
          y: acc.y + curr.y - prev.y,
        }
      })

      scrollHandler({deltaX: momentum.x, deltaY: momentum.y})
    }

    ref.addEventListener('wheel', scrollHandler)
    // ref.addEventListener('touchmove', touchMoveHandler)
    // ref.addEventListener('touchend', touchEndHandler)
    window.addEventListener('keydown', keyDownHandler)
    window.addEventListener('keyup', keyUpHandler)

    return () => {
      ref.removeEventListener('wheel', scrollHandler)
      // ref.removeEventListener('touchmove', touchMoveHandler)
      // ref.removeEventListener('touchend', touchEndHandler)
      window.removeEventListener('keydown', keyDownHandler)
      window.removeEventListener('keyup', keyUpHandler)
    }
  }, [ref])

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
    /**
     * @param {number} s
     */
    zoomTo(s) {
      setScale(
        Math.max(
          settingsRef.current.minZoom,
          Math.min(settingsRef.current.maxZoom, s),
        ),
      )
    },

    /**
     * @param {number} y
     * @param {number?} x
     */
    scrollRelative(y, x) {
      setScrollY(clampY(scrollY + y))
      if (typeof x === 'number') {
        setScrollX(clampX(scrollX + x))
      }
    },

    /**
     * @param {number} s
     */
    zoomRelative(s) {
      setScale(
        Math.max(
          settingsRef.current.minZoom,
          Math.min(settingsRef.current.maxZoom, scale + s),
        ),
      )
    },

    scrollY: scrollY,
    scrollX: scrollX,
    scale: scale,
  }
}

export default useScroll
