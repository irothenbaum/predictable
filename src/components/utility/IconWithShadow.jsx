import React from 'react'
import './IconWithShadow.scss'
import PropTypes from 'prop-types'
import Icon from './Icon'

function IconWithShadow(props) {
  const depthFormatted =
    typeof props.depth === 'number' ? `${props.depth}px` : props.depth

  return (
    <div className="icon-with-shadow">
      <Icon
        icon={props.icon}
        style={{
          transform: `translateY(-${depthFormatted})`,
        }}
      />
      <Icon className={'shadow'} icon={props.icon} />
    </div>
  )
}

IconWithShadow.defaultProps = {
  depth: 3,
}

IconWithShadow.propTypes = {
  icon: PropTypes.any,
  depth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
}

export default IconWithShadow
