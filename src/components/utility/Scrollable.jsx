import React from 'react'
import useScroll from '../../hooks/useScroll'
import PropTypes from 'prop-types'

function valOrZero(val) {
  return val || 0
}

function Scrollable(props) {
  const {scrollY, scrollX} = useScroll({
    maxY: valOrZero(props.height) - valOrZero(props.viewHeight),
    maxX: valOrZero(props.width) - valOrZero(props.viewWidth),
    horizontalScrollKey: 'Shift',
  })

  let transforms = []
  if (props.viewHeight) {
    transforms.push(`translateY(${scrollY}px)`)
  }
  if (props.viewWidth) {
    transforms.push(`translateX(${scrollX}px)`)
  }

  // TODO: At ability to zoom in and out

  return (
    <div
      style={{
        transition: 'transform 0.2s ease-out',
        transform: transforms.join(' '),
      }}>
      {props.children}
    </div>
  )
}

Scrollable.propTypes = {
  viewHeight: PropTypes.number,
  viewWidth: PropTypes.number,
  height: PropTypes.number,
  width: PropTypes.number,
}

export default Scrollable
