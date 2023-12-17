/**
 * @typedef {Object} SessionContextData
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
 * @typedef {Object} LevelDefinition
 * @property {Board} gameBoard
 * @property {Array<PieceDefinition>} pieces
 */

/**
 * This is used in the level.json files as a shorthand for piece + positions
 * @typedef {Coordinate & Velocity} PieceDefinition
 * @property {PieceType} type
 * @property {Variant?} variant
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
 * @typedef {Piece} MoveShadow
 * @property {boolean} isMoveShadow
 * @property {number} moveIndex
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
 */

/**
 * @typedef {Player & Hazard & Obstacle & Platform & Coin & Goal & MoveShadow} AbstractPiece
 */
