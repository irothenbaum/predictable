import React from 'react'
import './Platform.scss'
import PropTypes from 'prop-types'
import {constructClassString} from '../../lib/utilities'
import VelocityIndicator from './VelocityIndicator'
import {PiecePropType} from '../../lib/constants'
function Platform(props) {
  return (
    <div className={constructClassString('platform', props.piece.variant)}>
      <div className="platform-inner">
        <VelocityIndicator velocity={props.piece.velocity} />
      </div>
    </div>
  )
}

Platform.propTypes = PiecePropType

export default Platform
