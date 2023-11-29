import React from 'react'
import './Hazard.scss'
import PropTypes from 'prop-types'
import {constructClassString} from '../../lib/utilities'
import VelocityIndicator from './VelocityIndicator'
import {PiecePropType} from '../../lib/constants'
function Hazard(props) {
  return (
    <div className={constructClassString('hazard', props.piece.variant)}>
      <div className="hazard-inner">
        <VelocityIndicator velocity={props.piece.velocity} />
      </div>
    </div>
  )
}

Hazard.propTypes = PiecePropType

export default Hazard
