/**
 * @typedef {Object} SessionContextData
 */

/**
 * @typedef {Object} LevelContextData
 * @property {Array<Piece>} pieces
 * @property {Array<Coordinate>} moves
 * @property {Player} playerPiece
 * @property {number} score
 * @property {Board} gameBoard
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
 */

/**
 * @typedef {Piece} AbstractPiece
 * @property {boolean?} isPlayer
 * @property {boolean?} isHazard
 * @property {boolean?} isObstacle
 * @property {boolean?} isPlatform
 * @property {boolean?} isCoin
 * @property {boolean?} isGoal
 * @property {Velocity?} velocity
 */

/**
 * @typedef {AbstractPiece} Player
 * @property {boolean} isPlayer
 */

/**
 * If the player lands on this, it dies
 * @typedef {AbstractPiece} Hazard
 * @property {boolean} isHazard
 */

/**
 * The player cannot land on this (move will be ignored)
 * @typedef {AbstractPiece} Obstacle
 * @property {boolean} isObstacle
 */

/**
 * If the player lands on this, it will move the player in the direction of the platform velocity
 * @typedef {AbstractPiece} Platform
 * @property {boolean} isPlatform
 */

/**
 * @typedef {AbstractPiece} Coin
 * @property {boolean} isCoin
 * @property {number} value
 * @property {boolean} isCollected
 */

/**
 * @typedef {AbstractPiece} Goal
 * @property {boolean} isGoal
 */
