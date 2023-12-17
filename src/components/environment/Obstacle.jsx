import React from 'react'
import './Obstacle.scss'
import PropTypes from 'prop-types'
import {constructClassString} from '../../lib/utilities'
import VelocityIndicator from './VelocityIndicator'
import {PiecePropType} from '../../lib/constants'
function Obstacle(props) {
  return (
    <div className={constructClassString('obstacle', props.piece.variant)}>
      <VelocityIndicator velocity={props.piece.velocity} />
    </div>
  )
}

Obstacle.propTypes = PiecePropType

export default Obstacle
