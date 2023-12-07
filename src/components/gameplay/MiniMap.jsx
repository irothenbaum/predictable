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
  }, [props.content, props.window])

  const width = Math.min(100, (props.window.width / props.content.width) * 100)
  const height = Math.min(
    100,
    (props.window.height / props.content.height) * 100,
  )

  console.log(props.content, props.window)

  const left = (props.window.offsetLeft / props.content.width) * 100
  const top = (props.window.offsetTop / props.content.height) * 100

  return (
    <div
      className={constructClassString('mini-map-container', {
        showing: showingMiniMap || true,
      })}>
      <div
        className="mini-map-content"
        style={{
          paddingTop: `${(props.content.height / props.content.width) * 100}%`,
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
  content: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
  }),
  window: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
    offsetLeft: PropTypes.number,
    offsetTop: PropTypes.number,
  }),
}

export default MiniMap
