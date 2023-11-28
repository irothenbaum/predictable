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

// TODO: Maybe 1 square size should be set the 1rem size?
export const squareSizeEmScale = 5
