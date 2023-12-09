import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import './MiniMap.scss'
import useDoOnceTimer from '../../hooks/useDoOnceTimer'
import {constructClassString, convertRemToPixels} from '../../lib/utilities'
import {squareSizeRemScale} from '../../lib/constants'

const MINI_MAP_TIMER = 'mini-map-timer'
const MINI_MAP_TIMER_DURATION = 3000

function MiniMap(props) {
  const [showingMiniMap, setShowingMiniMap] = useState(false)
  const {setTimer} = useDoOnceTimer()

  useEffect(() => {
    setShowingMiniMap(true)

    setTimer(
      MINI_MAP_TIMER,
      () => setShowingMiniMap(false),
      MINI_MAP_TIMER_DURATION,
    )
  }, [props.offsetLeft, props.offsetTop])

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

  return (
    <div
      className={constructClassString('mini-map-container', {
        showing: showingMiniMap,
      })}
      style={{
        width: `${mapWidth}px`,
        height: `${mapHeight}px`,
      }}>
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
}

export default MiniMap
