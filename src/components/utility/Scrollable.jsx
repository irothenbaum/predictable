import React, {useEffect} from 'react'
import useScroll from '../../hooks/useScroll'
import PropTypes from 'prop-types'
import MiniMap from '../gameplay/MiniMap'

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

  transforms.push(`scale(${scale})`)

  return (
    <React.Fragment>
      <MiniMap
        contentHeight={props.height * scale}
        contentWidth={props.width * scale}
        windowHeight={props.viewHeight}
        windowWidth={props.viewWidth}
        offsetLeft={-scrollX}
        offsetTop={-scrollY}
      />
      <div
        style={{
          transition: 'transform 0.2s ease-out',
          transform: transforms.join(' '),
          height: '100%',
          width: '100%',
        }}>
        {props.children}
      </div>
    </React.Fragment>
  )
}

Scrollable.propTypes = {
  viewHeight: PropTypes.number,
  viewWidth: PropTypes.number,
  height: PropTypes.number,
  width: PropTypes.number,
}

export default Scrollable
