import React from 'react'
import './MoveShadow.scss'
import Icon from '../utility/Icon'
import {getArrowIconFromVelocity} from '../utilities'
import {PiecePropType} from '../../lib/constants'

function MoveShadow(props) {
  return (
    <Icon
      className="move-shadow"
      icon={getArrowIconFromVelocity(props.piece.velocity)}
    />
  )
}

MoveShadow.propTypes = PiecePropType

export default MoveShadow
