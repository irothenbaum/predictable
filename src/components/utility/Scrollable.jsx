import React, {useState, useEffect, useRef} from 'react'
import useScroll from '../../hooks/useScroll'
import PropTypes from 'prop-types'
import MiniMap from '../gameplay/MiniMap'

function Scrollable(props) {
  const [hasRendered, setHasRendered] = useState(false)
  const [containerRef, setContainerRef] = useState(null)
  const {scrollY, scrollX, scale, scrollTo, zoomTo} = useScroll(containerRef, {
    contentWidth: props.width,
    viewWidth: props.viewWidth,
    contentHeight: props.height,
    viewHeight: props.viewHeight,
    horizontalScrollKey: 'Shift',
    zoomKey: 'a',
  })

  // whenever our scrollPos changes, we also zoom back out to 1
  useEffect(() => {
    if (props.scrollPos) {
      scrollTo(props.scrollPos.y, props.scrollPos.x)
      zoomTo(1)
    }

    // putting this in a timeout because for some reason without it the starting screenPos is animated to when it shouldn't be
    setTimeout(() => {
      setHasRendered(true)
    }, 10)
  }, [props.scrollPos])

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
      {!props.hideMiniMap && (
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
      )}
      <div
        style={{
          transition: 'transform 0.2s ease-out',
          transform: transforms.join(' '),
          transitionDuration: hasRendered
            ? props.transitionDuration || '0.2s'
            : '0s',
          visibility: hasRendered ? 'visible' : 'hidden',
          height: '100%',
          width: '100%',
        }}>
        {props.children}
      </div>
    </div>
  )
}

Scrollable.propTypes = {
  scrollPos: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  viewHeight: PropTypes.number,
  viewWidth: PropTypes.number,
  height: PropTypes.number,
  width: PropTypes.number,
  hideMiniMap: PropTypes.bool,
  transitionDuration: PropTypes.string,
}

export default Scrollable
