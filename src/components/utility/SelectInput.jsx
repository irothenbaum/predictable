import React, {useRef, useState, useEffect} from 'react'
import './SelectInput.scss'
import PropTypes from 'prop-types'
import Icon, {CHEVRON_DOWN, CHEVRON_UP} from './Icon'
import {InputProps} from '../../lib/constants'
import {constructClassString} from '../../lib/utilities'

function SelectInput(props) {
  const [showOptions, setShowOptions] = useState(false)
  const container = useRef()

  useEffect(() => {
    const handler = e => {
      if (e.target !== container.current) {
        setShowOptions(false)
      }
    }

    window.document.addEventListener('click', handler)

    return () => {
      window.document.removeEventListener('click', handler)
    }
  }, [])

  return (
    <div
      className={constructClassString('select-input', props.className, {
        open: showOptions,
      })}>
      <div
        className="select-input-value"
        onClick={ev => {
          ev.stopPropagation()
          setShowOptions(true)
        }}>
        {props.renderOption(props.value)}
        &nbsp;
        <Icon
          className="dropdown-icon"
          icon={showOptions ? CHEVRON_UP : CHEVRON_DOWN}
        />
      </div>

      <div className="select-input-options" ref={container}>
        {props.options.map((o, index) => (
          <div key={index} className="option" onClick={() => props.onChange(o)}>
            {typeof props.renderOption === 'function'
              ? props.renderOption(o, index)
              : o}
          </div>
        ))}
      </div>
    </div>
  )
}

SelectInput.propTypes = {
  ...InputProps,
  options: PropTypes.array,
  renderOption: PropTypes.func.isRequired,
}

export default SelectInput
