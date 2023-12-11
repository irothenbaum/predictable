import PropTypes from 'prop-types'

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
  MoveShadow: 'move-shadow',
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
    }),
    velocity: PropTypes.shape({
      rowChange: PropTypes.number,
      columnChange: PropTypes.number,
    }),
  }).isRequired,
}

export const InputProps = {
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
  className: PropTypes.string,
}

// this should match the rem scale in constants.scss
export const squareSizeRemScale = 5
