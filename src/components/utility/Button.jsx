import React from 'react'
import PropTypes from 'prop-types'
import './Button.scss'
import {constructClassString} from '../../lib/utilities'

export const VARIANT_PRIMARY = 'primary'
export const VARIANT_SECONDARY = 'secondary'
export const VARIANT_TERTIARY = 'tertiary'
export const VARIANT_DESTRUCTIVE = 'destructive'

function Button(props) {
  return (
    <button
      className={constructClassString('button-container', props.className, {
        secondary: props.variant === VARIANT_SECONDARY,
        tertiary: props.variant === VARIANT_TERTIARY,
        destructive: props.variant === VARIANT_DESTRUCTIVE,
        disabled: !!props.disabled,
      })}
      onClick={() => (props.disabled ? undefined : props.onClick())}>
      {props.children}
    </button>
  )
}

Button.propTypes = {
  variant: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
}

export default Button
