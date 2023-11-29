import React from 'react'
import './IconWithShadow.scss'
import PropTypes from 'prop-types'
import Icon from './Icon'
import {constructClassString} from '../../lib/utilities'

function IconWithShadow(props) {
  return (
    <div
      className={constructClassString('icon-with-shadow', {
        ['has-click-handler']: typeof props.onClick === 'function',
        active: props.active,
      })}
      onClick={props.onClick}>
      <Icon className={'top'} icon={props.icon} />
      <Icon className={'shadow'} icon={props.icon} />
    </div>
  )
}

IconWithShadow.defaultProps = {
  depth: 3,
}

IconWithShadow.propTypes = {
  icon: PropTypes.any,
  onClick: PropTypes.func,
  active: PropTypes.bool,
}

export default IconWithShadow
