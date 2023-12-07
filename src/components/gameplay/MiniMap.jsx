import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import './MiniMap.scss'
import useDoOnceTimer from '../../hooks/useDoOnceTimer'
import {constructClassString} from '../../lib/utilities'

const MINI_MAP_TIMER = 'mini-map-timer'
const MINI_MAP_TIMER_DURATION = 2000

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

  const width = Math.min(100, (props.windowWidth / props.contentWidth) * 100)
  const height = Math.min(100, (props.windowHeight / props.contentHeight) * 100)

  const left = (props.offsetLeft / props.contentWidth) * 100
  const top = (props.offsetTop / props.contentHeight) * 100

  return (
    <div
      className={constructClassString('mini-map-container', {
        showing: showingMiniMap || true,
      })}>
      <div
        className="mini-map-content"
        style={{
          paddingTop: `${(props.contentHeight / props.contentWidth) * 100}%`,
        }}
      />
      <div
        className="mini-map-window"
        style={{
          width: `${width}%`,
          height: `${height}%`,
          left: `${left}%`,
          top: `${top}%`,
        }}
      />
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
