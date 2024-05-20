// -----------------------------------------------------------------
// CONTEXT TOPOLOGIES

/**
 * @typedef {Object} SettingsContextData
 * @property {Object<string, Array<Velocity>>} solvedPuzzles
 */

/**
 * @typedef {Object} LevelContextData
 * @property {Array<Piece>} pieces
 * @property {Array<Velocity>} moves
 * @property {Player} playerPiece
 * @property {number} score
 * @property {Board} gameBoard
 */

/**
 * @typedef {Object} CamapignContextData
 * @property {number} score
 * @property {Object<string, Array<Solution>>} solutions
 * @property {string?} lastCompletedLevelKey
 * @property {number?} lastCompletedLevelNum
 */

// -----------------------------------------------------------------
// LEVEL DEFINITION

/**
 * This is used in the level.json files as a shorthand for piece + positions
 * @typedef {Coordinate & Velocity} PieceDefinition
 * @property {PieceType} type
 * @property {Variant?} variant
 */

/**
 * @typedef {Object} LevelDefinition
 * @property {Board} gameBoard
 * @property {Array<PieceDefinition>} pieces
 * @property {Array<Instructional>?} instructions
 */

/**
 * @typedef {Object} LevelGroupDefinition
 * @property {string} levelKey
 * @property {Array<LevelDefinition>} subLevels
 */

// -----------------------------------------------------------------
// GAME

/**
 * @typedef {Object} Board
 * @property {number} height
 * @property {number} width
 */

/**
 * @typedef {Object} Coordinate
 * @property {number} row (0-indexed)
 * @property {number} column (0-indexed)
 */

/**
 * @typedef {Object} Velocity
 * @property {number} rowChange
 * @property {number} columnChange
 */

/**
 * @typedef {Object} Piece
 * @property {string} id
 * @property {PieceType} type
 * @property {Coordinate} position
 * @property {Velocity} velocity
 * @property {Variant?} variant
 */

/**
 * @typedef {Piece} Player
 * @property {boolean} isPlayer
 */

/**
 * If the player lands on this, it dies
 * @typedef {Piece} Hazard
 * @property {boolean} isHazard
 */

/**
 * The player cannot land on this (move will be ignored)
 * @typedef {Piece} Obstacle
 * @property {boolean} isObstacle
 */

/**
 * If the player lands on this, it will move the player in the direction of the platform velocity
 * @typedef {Piece} Platform
 * @property {boolean} isPlatform
 */

/**
 * If the player lands on this, it will be collected and the score will increase
 * @typedef {Piece} Coin
 * @property {boolean} isCoin
 * @property {number} value
 * @property {boolean} isCollected
 */

/**
 * If the player lands on this, the level is complete
 * @typedef {Piece} Goal
 * @property {boolean} isGoal
 * @property {boolean} isCollected
 */

/**
 * @typedef {Player & Hazard & Obstacle & Platform & Coin & Goal} AbstractPiece
 */

// -----------------------------------------------------------------
// UI and Meta
/**
 * @typedef {Object} Instructional
 * @property {string} instructionKey
 * @property {number?} triggerDelayMS
 * @property {number?} triggerDelayMoveIndex
 * @property {Position?} triggerPosition
 */

/**
 * @typedef {Object} LevelGroupSolution
 * @property {string} levelKey
 * @property {Array<Solution>} solutions
 * @property {number} score
 */

/**
 * @typedef {Object} Solution
 * @property {string?} levelKey
 * @property {Array<Velocity>} moves
 * @property {number} score
 * @property {Date|string} solvedAt
 */
