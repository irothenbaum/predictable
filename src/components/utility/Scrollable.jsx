import React, {useState, useEffect, useRef} from 'react'
import useScroll from '../../hooks/useScroll'
import PropTypes from 'prop-types'
import MiniMap from '../gameplay/MiniMap'

function Scrollable(props) {
  const [containerRef, setContainerRef] = useState(null)
  const {scrollY, scrollX, scale, scrollTo} = useScroll(containerRef, {
    contentWidth: props.width,
    viewWidth: props.viewWidth,
    contentHeight: props.height,
    viewHeight: props.viewHeight,
    horizontalScrollKey: 'Shift',
    zoomKey: ' ',
  })

  let transforms = []

  // NOTE: we make these negative because we need to transform UP when we scroll DOWN
  if (props.viewHeight) {
    transforms.push(`translateY(${-scrollY}px)`)
  }
  if (props.viewWidth) {
    transforms.push(`translateX(${-scrollX}px)`)
  }

  transforms.push(`scale(${scale})`)

  /**
   * @param {MiniMapClickEvent} clickE
   */
  const handleClickMiniMap = clickE => {
    scrollTo(clickE.absoluteY, clickE.absoluteX)
  }

  return (
    <div
      style={{height: '100%', width: '100%'}}
      ref={r => setContainerRef(r)}
      className="scrollable-wrapper">
      <MiniMap
        contentHeight={props.height}
        contentWidth={props.width}
        windowHeight={props.viewHeight}
        windowWidth={props.viewWidth}
        offsetLeft={scrollX}
        offsetTop={scrollY}
        scale={scale}
        onClick={handleClickMiniMap}
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
