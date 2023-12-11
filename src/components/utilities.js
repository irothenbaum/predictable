import {
  ARROW_UP,
  ARROW_DOWN,
  ARROW_LEFT,
  ARROW_RIGHT,
  CIRCLE,
} from './utility/Icon'

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
