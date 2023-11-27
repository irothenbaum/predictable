import React from 'react'
import './Hazard.scss'
import PropTypes from 'prop-types'
import {constructClassString} from '../../lib/utilities'
import {
  VARIANT_LEFT_END,
  VARIANT_RIGHT_END,
  VARIANT_MIDDLE,
} from '../../lib/constants'
function Hazard(props) {
  return (
    <div
      className={constructClassString('hazard', {
        'left-end': props.variant === VARIANT_LEFT_END,
        'right-end': props.variant === VARIANT_LEFT_END,
        middle: props.variant === VARIANT_MIDDLE,
      })}></div>
  )
}

Hazard.propTypes = {
  piece: PropTypes.object.isRequired,
  variant: PropTypes.string,
}

export default Hazard
