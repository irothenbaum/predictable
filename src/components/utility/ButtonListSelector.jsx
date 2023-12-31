import React, {useCallback, useEffect, useRef, useState} from 'react'
import useKeyListener from '../../hooks/useKeyListener'
import PropTypes from 'prop-types'
import {VARIANT_PRIMARY, VARIANT_SECONDARY, VARIANT_TERTIARY} from './Button'

const INDEX_NONE = -1

function ButtonListSelector(props) {
  const [selectedIndex, setSelectedIndex] = useState(
    typeof props.default === 'number' ? props.default : INDEX_NONE,
  )

  const buttonRefs = useRef([])

  // --------------------------------------------------------
  // handle keyboard input
  const keyHandler = useCallback(
    key => {
      const clamp = newVal => {
        // other options: wrap around
        return Math.max(0, Math.min(props.buttons.length - 1, newVal))
      }

      switch (key) {
        case 'ArrowUp':
        case 'ArrowLeft':
          setSelectedIndex(i => clamp(i - 1))
          break
        case 'ArrowDown':
        case 'ArrowRight':
          setSelectedIndex(i => clamp(i + 1))
          break

        case 'Enter':
          if (
            selectedIndex !== INDEX_NONE &&
            buttonRefs.current[selectedIndex]
          ) {
            buttonRefs.current[selectedIndex].click()
          }
          break
      }
    },
    [props.buttons, selectedIndex],
  )
  useKeyListener(keyHandler)
  // --------------------------------------------------------

  return (
    <React.Fragment>
      {props.buttons.map((button, index) => {
        return React.cloneElement(button, {
          key: index,
          focused: index === selectedIndex,
          variant:
            index === selectedIndex ? VARIANT_SECONDARY : VARIANT_PRIMARY,
          ref: ref => {
            buttonRefs.current[index] = ref
          },
        })
      })}
    </React.Fragment>
  )
}

ButtonListSelector.propTypes = {
  default: PropTypes.number,
  buttons: PropTypes.arrayOf(PropTypes.node).isRequired,
}

export default ButtonListSelector
