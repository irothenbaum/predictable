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
    id: PropTypes.string,
    type: PropTypes.string.isRequired,
    position: PropTypes.shape({
      row: PropTypes.number,
      column: PropTypes.number,
    }),
    velocity: PropTypes.shape({
      rowChange: PropTypes.number,
      columnChange: PropTypes.number,
    }),
  }),
}

export const LevelDefinitionShape = PropTypes.shape({
  pieces: PropTypes.arrayOf(PiecePropType.piece),
  gameBoard: PropTypes.object,
})

export const InputProps = {
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
  className: PropTypes.string,
}

export const LevelSolutionShape = PropTypes.shape({
  moves: PropTypes.arrayOf(
    PropTypes.shape({
      row: PropTypes.number,
      column: PropTypes.number,
    }),
  ).isRequired,
  score: PropTypes.number,
})

export const LevelGroupSolutionShape = PropTypes.shape({
  levelKey: PropTypes.string,
  score: PropTypes.number,
  solutions: PropTypes.arrayOf(LevelSolutionShape),
})

// this should match the rem scale in constants.scss
export const squareSizeRemScale = 5
