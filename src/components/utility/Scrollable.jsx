import React from 'react'
import useScroll from '../../hooks/useScroll'
import PropTypes from 'prop-types'

function Scrollable(props) {
  const {scrollY} = useScroll({maxY: props.height - window.innerHeight})

  return (
    <div style={{transform: `translateY(${scrollY}px)`}}>{props.children}</div>
  )
}

Scrollable.propTypes = {
  height: PropTypes.number,
}

export default Scrollable
