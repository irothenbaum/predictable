import Icon, {PLUS} from './Icon'
import React from 'react'
import './TextCTA.scss'
import {constructClassString} from '../../utilities'
import PropTypes from 'prop-types'

function TextCTA(props) {
  return (
    <div
      className={constructClassString('text-cta', props.className)}
      onClick={props.onClick}>
      {props.icon ? <Icon icon={props.icon} /> : null}{' '}
      <span>{props.label}</span>
    </div>
  )
}

TextCTA.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.any,
  label: PropTypes.string.isRequired,
}

export default TextCTA
