import PropTypes from 'prop-types'

export const BOARD_SIZE = 8

/**
 * @enum {string}
 */
export const PieceType = {
  Player: 'player',
  Hazard: 'hazard',
  Obstacle: 'obstacle',
  Platform: 'platform',
  Coin: 'coin',
  Goal: 'goal',
}

/**
 * @enum {string}
 */
export const Variant = {
  LeftEnd: 'left-end',
  RightEnd: 'right-end',
  Middle: 'middle',
}

export const PiecePropType = {
  piece: PropTypes.shape({
    type: PropTypes.string.isRequired,
    position: PropTypes.shape({
      row: PropTypes.number,
      column: PropTypes.number,
    }).isRequired,
    velocity: PropTypes.shape({
      rowChange: PropTypes.number,
      columnChange: PropTypes.number,
    }),
  }).isRequired,
}
