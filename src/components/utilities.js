import {
  ARROW_UP,
  ARROW_DOWN,
  ARROW_LEFT,
  ARROW_RIGHT,
  CIRCLE,
} from './utility/Icon'
import {PieceType} from '../lib/constants'
import Player from './environment/Player'
import Hazard from './environment/Hazard'
import Obstacle from './environment/Obstacle'
import Platform from './environment/Platform'
import Goal from './environment/Goal'

/**
 * @param {Velocity} velocity
 */
export function getArrowIconFromVelocity(velocity) {
  if (!velocity || (velocity.rowChange !== 0 && velocity.columnChange !== 0)) {
    console.warn('Invalid velocity for arrow icon')
    return null
  }

  if (velocity.rowChange === -1) {
    return ARROW_UP
  } else if (velocity.rowChange === 1) {
    return ARROW_DOWN
  } else if (velocity.columnChange === -1) {
    return ARROW_LEFT
  } else if (velocity.columnChange === 1) {
    return ARROW_RIGHT
  } else {
    return CIRCLE
  }
}

export const PieceTypeToComponent = {
  [PieceType.Player]: Player,
  [PieceType.Hazard]: Hazard,
  [PieceType.Obstacle]: Obstacle,
  [PieceType.Platform]: Platform,
  [PieceType.Goal]: Goal,
}
