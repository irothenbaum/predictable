import React from 'react'
import useScroll from '../../hooks/useScroll'
import PropTypes from 'prop-types'

function Scrollable(props) {
  const {scrollY} = useScroll({maxY: props.height - (props.viewHeight || 0)})

  // TODO: At ability to zoom in and out + scroll horizontally

  return (
    <div
      style={{
        transition: 'transform 0.2s ease-out',
        transform: `translateY(${scrollY}px)`,
      }}>
      {props.children}
    </div>
  )
}

Scrollable.propTypes = {
  viewHeight: PropTypes.number,
  height: PropTypes.number.isRequired,
}

export default Scrollable
