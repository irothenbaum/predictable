import React, {useEffect, useRef, useState} from 'react'
import PropTypes from 'prop-types'
import './MiniMap.scss'
import useDoOnceTimer from '../../hooks/useDoOnceTimer'
import {constructClassString, convertRemToPixels} from '../../lib/utilities'
import {squareSizeRemScale} from '../../lib/constants'
import useReadyTimer from '../../hooks/useReadyTimer'

const MINI_MAP_TIMER = 'mini-map-timer'
const MINI_MAP_TIMER_DURATION = 3000

/**
 * @typedef {Object} MiniMapClickEvent
 * @property {number} x
 * @property {number} y
 * @property {number} ratioX
 * @property {number} ratioY
 * @property {number} absoluteX
 * @property {number} absoluteY
 */

function MiniMap(props) {
  // don't show mini map in first half second
  const {isReady} = useReadyTimer(500)
  const [showingMiniMap, setShowingMiniMap] = useState(false)
  const {setTimer} = useDoOnceTimer()
  const containerRef = useRef(null)

  useEffect(() => {
    if (isReady) {
      setShowingMiniMap(true)
    }

    setTimer(
      MINI_MAP_TIMER,
      () => setShowingMiniMap(false),
      MINI_MAP_TIMER_DURATION,
    )
  }, [props.offsetLeft, props.offsetTop, props.scale])

  // the view accounting for zoom scale
  const effectiveWindowHeight = props.windowHeight / props.scale
  const effectiveWindowWidth = props.windowWidth / props.scale

  const windowGreaterThanContentWidth =
    effectiveWindowWidth >= props.contentWidth
  const windowGreaterThanContentHeight =
    effectiveWindowHeight >= props.contentHeight

  // determine the effective size of the view window as a percentage of the content area
  const windowWidthPercentage = Math.min(
    100,
    (effectiveWindowWidth / props.contentWidth) * 100,
  )
  const windowHeightPercentage = Math.min(
    100,
    (effectiveWindowHeight / props.contentHeight) * 100,
  )

  // if, accounting for zoom, we can completely contain the world, then we don't need to offset the window at all
  const windowOffsetLeft = windowGreaterThanContentWidth
    ? 0
    : ((props.offsetLeft + (props.windowWidth / 2) * (props.scale - 1)) /
        (props.contentWidth * props.scale)) *
      100

  const windowOffsetTop = windowGreaterThanContentHeight
    ? 0
    : ((props.offsetTop + (props.windowHeight / 2) * (props.scale - 1)) /
        (props.contentHeight * props.scale)) *
      100

  // NOTE: I also don't FULLY understand why those ^^^ work, but they use similar logic as useScroll clamp function so if we change
  // one we must change this

  // last we scale the content so that the largest dimension is 2 * squareSizeRemScale
  const maxContentDimension = convertRemToPixels(2 * squareSizeRemScale)
  const widthToHeightRatio = props.contentWidth / props.contentHeight
  const isLandscape = widthToHeightRatio > 1

  const mapWidth = isLandscape
    ? maxContentDimension
    : maxContentDimension * widthToHeightRatio
  const mapHeight = isLandscape
    ? maxContentDimension / widthToHeightRatio
    : maxContentDimension

  const handleClick = e => {
    if (!showingMiniMap || typeof props.onClick !== 'function') {
      return
    }

    setTimer(
      MINI_MAP_TIMER,
      () => setShowingMiniMap(false),
      MINI_MAP_TIMER_DURATION,
    )

    const windowWidth = (windowWidthPercentage / 100) * mapWidth
    const windowHeight = (windowHeightPercentage / 100) * mapHeight

    // TODO: this doesn't work right when zoomed in
    // NOTE: we subtract the windowWidth/Height because the click is relative to the top left corner of the window
    const xPos = e.nativeEvent.offsetX - windowWidth / 2
    const yPos = e.nativeEvent.offsetY - windowHeight / 2

    const ratioX = xPos / mapWidth
    const ratioY = yPos / mapHeight

    props.onClick({
      x: xPos,
      y: yPos,
      ratioX: ratioX,
      ratioY: ratioY,
      absoluteX: ratioX * props.contentWidth,
      absoluteY: ratioY * props.contentHeight,
    })
  }

  return (
    <div
      className={constructClassString('mini-map-container', {
        showing: showingMiniMap,
      })}
      style={{
        width: `${mapWidth}px`,
        height: `${mapHeight}px`,
      }}
      ref={containerRef}
      onClick={e => handleClick(e)}>
      <div
        className="mini-map-window"
        style={{
          width: `${windowWidthPercentage}%`,
          height: `${windowHeightPercentage}%`,
          left: `${windowOffsetLeft}%`,
          top: `${windowOffsetTop}%`,
        }}
      />
      <div className="mini-map-content" />
    </div>
  )
}

MiniMap.propTypes = {
  contentHeight: PropTypes.number,
  contentWidth: PropTypes.number,
  windowHeight: PropTypes.number,
  windowWidth: PropTypes.number,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onClick: PropTypes.func,
}

export default MiniMap
