import React, {forwardRef, useState} from 'react'
import PropTypes from 'prop-types'
import './Button.scss'
import {constructClassString} from '../../lib/utilities'
import useDoOnceTimer from '../../hooks/useDoOnceTimer'

export const VARIANT_PRIMARY = 'primary'
export const VARIANT_SECONDARY = 'secondary'
export const VARIANT_TERTIARY = 'tertiary'
export const VARIANT_DESTRUCTIVE = 'destructive'

const CLICK_TIMER = 'click'
const CLICK_DELAY = 800

const Button = forwardRef(function Button(props, ref) {
  const [isClicking, setIsClicking] = useState(false)
  const {setTimer} = useDoOnceTimer()

  const handleClick = () => {
    if (props.disabled || isClicking) {
      return
    }
    setIsClicking(true)
    setTimer(
      CLICK_TIMER,
      () => {
        props.onClick()
        setIsClicking(false)
      },
      CLICK_DELAY,
    )
  }

  return (
    <button
      ref={ref}
      className={constructClassString('button-container', props.className, {
        secondary: props.variant === VARIANT_SECONDARY,
        tertiary: props.variant === VARIANT_TERTIARY,
        destructive: props.variant === VARIANT_DESTRUCTIVE,
        disabled: !!props.disabled,
        focused: !!props.focused,
        clicked: isClicking,
      })}
      onClick={handleClick}>
      <div>{props.children}</div>
    </button>
  )
})

Button.propTypes = {
  variant: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  focused: PropTypes.bool,
}

export default Button
