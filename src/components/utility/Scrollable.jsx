import React from 'react'
import useScroll from '../../hooks/useScroll'
import PropTypes from 'prop-types'

function Scrollable(props) {
  const {scrollY, scrollX, scale} = useScroll({
    contentWidth: props.width,
    viewWidth: props.viewWidth,
    contentHeight: props.height,
    viewHeight: props.viewHeight,
    horizontalScrollKey: 'Shift',
    zoomKey: ' ',
  })

  let transforms = []
  if (props.viewHeight) {
    transforms.push(`translateY(${scrollY}px)`)
  }
  if (props.viewWidth) {
    transforms.push(`translateX(${scrollX}px)`)
  }

  // this isn't QUITE working right. Need the relative window position to stay consistent rather than just zooming into center
  transforms.push(`scale(${scale})`)

  return (
    <div
      style={{
        transition: 'transform 0.2s ease-out',
        transform: transforms.join(' '),
        height: '100%',
        width: '100%',
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
