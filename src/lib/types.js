/**
 * @typedef {Object} SessionContextData
 */

/**
 * @typedef {Object} GameContextData
 */


// -----------------------------------------------------------------
// GAME

/**
 * @typedef {Object} Coordinate
 * @property {number} row (0-indexed)
 * @property {number} column (0-indexed)
 */

/**
 * @typedef {Coordinate} VelocityCoordinate
 */

/**
 * @typedef {Object} Piece
 * @property {string} id
 * @property {PieceType} type
 * @property {Coordinate} position
 */

/**
 * @typedef {Piece} Player
 * @property {boolean} isPlayer
 */

/**
 * @typedef {Piece} Hazard
 * @property {boolean} isHazard
 */

/**
 * @typedef {Piece} Obstacle
 * @property {boolean} isObstacle
 */

/**
 * @typedef {Piece} Move
 * @property {VelocityCoordinate} velocity
 */
