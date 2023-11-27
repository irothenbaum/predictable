import LevelTutorial from './tutorial'
import {v4 as uuid} from 'uuid'
import {PieceType} from '../lib/constants'

export const LEVEL_TUTORIAL = 'tutorial'
export const LEVEL_1 = 'level-1'
export const LEVEL_2 = 'level-2'

export const LevelData = {
  [LEVEL_TUTORIAL]: LevelTutorial,
}

/**
 * @typedef {Object} PieceDefinition
 * @property {number} row
 * @property {number} column
 * @property {PieceType} type
 */

/**
 * @param {PieceDefinition} p
 * @return {string}
 */
function pieceDefinitionToCoords(p) {
  return `${p.row}-${p.column}`
}

/**
 * @param {string} levelKey
 * @return {Array<AbstractPiece>}
 */
export function instantiateLevelPieces(levelKey) {
  if (!LevelData[levelKey]) {
    throw new Error(`No level found for key: ${levelKey}`)
  }

  if (!Array.isArray(LevelData.pieces)) {
    return []
  }

  const coordsToPieceMap = LevelData[levelKey].pieces.reduce((agr, p) => {
    const k = pieceDefinitionToCoords(p)
    if (!agr[k]) {
      agr[k] = []
    }
    agr[k].push(p)
    return agr
  }, {})
  LevelData[levelKey].pieces.map(p =>
    pieceDefinitionToPiece(p, coordsToPieceMap),
  )
}

/**
 * @param {PieceDefinition} p
 * @param {Object<string, Array<PieceDefinition>>} coordsToPieceMap
 * @return {AbstractPiece}
 */
function pieceDefinitionToPiece(p, coordsToPieceMap) {
  const myRow = p.row
  // TODO: find neighbors using coordsToPieceMap and set variant accordingly

  return {
    id: uuid(),
    ...p,
    isPlayer: p.type === PieceType.Player,
    isHazard: p.type === PieceType.Hazard,
    isObstacle: p.type === PieceType.Obstacle,
    isPlatform: p.type === PieceType.Platform,
    isCoin: p.type === PieceType.Coin,
    isGoal: p.type === PieceType.Goal,
  }
}
