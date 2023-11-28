import LevelTutorial from './tutorial'
import {v4 as uuid} from 'uuid'
import {PieceType, Variant} from '../lib/constants'
import {getCoordinateKey} from '../lib/utilities'

export const LEVEL_TUTORIAL = 'tutorial'
export const LEVEL_1 = 'level-1'
export const LEVEL_2 = 'level-2'

/**
 * @type {Object<string, LevelDefinition>}
 */
export const LevelData = {
  [LEVEL_TUTORIAL]: LevelTutorial,
}

/**
 * @param {string} levelKey
 * @return {Array<AbstractPiece>}
 */
export function instantiateLevelPieces(levelKey) {
  if (!LevelData[levelKey]) {
    throw new Error(`No level found for key: ${levelKey}`)
  }

  if (!Array.isArray(LevelData[levelKey].pieces)) {
    return []
  }

  const coordsToPieceMap = LevelData[levelKey].pieces.reduce((agr, p) => {
    const k = getCoordinateKey(p)
    if (!agr[k]) {
      agr[k] = []
    }
    agr[k].push(p)
    return agr
  }, {})

  return LevelData[levelKey].pieces.map(p =>
    pieceDefinitionToPiece(p, coordsToPieceMap),
  )
}

/**
 * @param {PieceDefinition} p
 * @param {Object<string, Array<PieceDefinition>>} coordsToPieceMap
 * @return {AbstractPiece}
 */
function pieceDefinitionToPiece(p, coordsToPieceMap) {
  const leftCoords = getCoordinateKey({row: p.row, column: p.column - 1})
  const rightCoords = getCoordinateKey({row: p.row, column: p.column + 1})

  const hasLeftPiece = !!coordsToPieceMap[leftCoords]
  const hasRightPiece = !!coordsToPieceMap[rightCoords]

  return {
    id: uuid(),
    type: p.type,
    position: {
      row: p.row,
      column: p.column,
    },
    velocity: {
      rowChange: p.rowChange || 0,
      columnChange: p.columnChange || 0,
    },
    isPlayer: p.type === PieceType.Player,
    isHazard: p.type === PieceType.Hazard,
    isObstacle: p.type === PieceType.Obstacle,
    isPlatform: p.type === PieceType.Platform,
    isCoin: p.type === PieceType.Coin,
    isGoal: p.type === PieceType.Goal,
    variant:
      hasLeftPiece && hasRightPiece
        ? Variant.Middle
        : hasLeftPiece
        ? Variant.RightEnd
        : hasRightPiece
        ? Variant.LeftEnd
        : null,
  }
}
