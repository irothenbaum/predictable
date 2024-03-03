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
  Instructional: 'instructional',
}

/**
 * @enum {string}
 */
export const Variant = {
  LeftEnd: 'left-end',
  RightEnd: 'right-end',
  Middle: 'middle',
}

export const PositionShape = PropTypes.shape({
  row: PropTypes.number,
  column: PropTypes.number,
})

export const PieceShape = PropTypes.shape({
  id: PropTypes.string,
  type: PropTypes.string.isRequired,
  position: PositionShape,
  velocity: PropTypes.shape({
    rowChange: PropTypes.number,
    columnChange: PropTypes.number,
  }),
})

export const PiecePropType = {
  piece: PieceShape,
}

export const InstructionalShape = PropTypes.shape({
  triggerDelayMS: PropTypes.number,
  triggerDelayMoveIndex: PropTypes.number,
  triggerPosition: PositionShape,
  instructionKey: PropTypes.string.isRequired,
})

export const LevelDefinitionShape = PropTypes.shape({
  pieces: PropTypes.arrayOf(PiecePropType.piece),
  gameBoard: PropTypes.object,
  instructions: PropTypes.arrayOf(InstructionalShape),
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
  moves: PropTypes.arrayOf(PositionShape).isRequired,
  score: PropTypes.number,
})

export const LevelGroupSolutionShape = PropTypes.shape({
  levelKey: PropTypes.string,
  score: PropTypes.number,
  solutions: PropTypes.arrayOf(LevelSolutionShape),
})

export const InstructionalTipProps = {
  onComplete: PropTypes.func.isRequired,
}

// this should match the rem scale in constants.scss
export const squareSizeRemScale = 5

// --------------------------------------------------------------------------------
// INSTRUCTION KEYS

export const INSTRUCTION_WELCOME = 'welcome'
export const INSTRUCTION_HowToMoveUp = 'HowToMoveUp'
export const INSTRUCTION_AvoidingObstacles = 'AvoidingObstacles'
export const INSTRUCTION_AvoidingObstaclesTwo = 'AvoidingObstaclesTwo'
export const INSTRUCTION_IntroducingHazards = 'IntroducingHazards'
export const INSTRUCTION_IntroducingPlatforms = 'IntroducingPlatforms'

// --------------------------------------------------------------------------------
// SCENES
export const SCENE_CAMPAIGN = 'campaign'
export const SCENE_MENU = 'menu'
export const SCENE_SETTINGS = 'settings'
export const SCENE_DAILY = 'daily-challenge'
export const SCENE_BUILDER = 'builder'

export const SCENE_INTRO = 'intro'
