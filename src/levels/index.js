import {v4 as uuid} from 'uuid'
import {PieceType, Variant} from '../lib/constants'
import {getCoordinateKey} from '../lib/utilities'

import TutorialMoving from './tutorial_moving.json'
import TutorialHazards from './tutorial_hazards.json'
import TutorialPlatforms from './tutorial_platforms.json'

export const TUTORIAL_MOVING = 'moving'
export const TUTORIAL_HAZARDS = 'hazards'
export const TUTORIAL_PLATFORMS = 'platforms'

/**
 * @type {Object<string, LevelGroupDefinition>}
 */
export const LevelData = {
  [TUTORIAL_MOVING]: TutorialMoving,
  [TUTORIAL_HAZARDS]: TutorialHazards,
  [TUTORIAL_PLATFORMS]: TutorialPlatforms,
}

export const LevelsOrder = Object.keys(LevelData)

/**
 * @param {Array<PieceDefinition>} pieceDefinitions
 * @return {Array<AbstractPiece>}
 */
export function instantiateLevelPieces(pieceDefinitions) {
  if (!Array.isArray(pieceDefinitions)) {
    return []
  }

  const coordsToPieceMap = pieceDefinitions.reduce((agr, p) => {
    const k = getCoordinateKey(p)
    if (!agr[k]) {
      agr[k] = []
    }
    agr[k].push(p)
    return agr
  }, {})

  return pieceDefinitions.map(p => pieceDefinitionToPiece(p, coordsToPieceMap))
}

/**
 * @param {PieceDefinition} p
 * @param {Object<string, Array<PieceDefinition>>} coordsToPieceMap
 * @return {AbstractPiece}
 */
function pieceDefinitionToPiece(p, coordsToPieceMap) {
  const leftCoords = getCoordinateKey({row: p.row, column: p.column - 1})
  const rightCoords = getCoordinateKey({row: p.row, column: p.column + 1})

  const hasLeftPiece =
    Array.isArray(coordsToPieceMap[leftCoords]) &&
    !!coordsToPieceMap[leftCoords].find(p2 => p2.type === p.type)
  const hasRightPiece =
    Array.isArray(coordsToPieceMap[rightCoords]) &&
    !!coordsToPieceMap[rightCoords].find(p2 => p2.type === p.type)

  // these pieces have no variant and cannot move
  if ([PieceType.Player, PieceType.Goal].includes(p.type)) {
    delete p.variant
    p.columnChange = 0
    p.rowChange = 0
  }

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
      p.variant ||
      (hasLeftPiece && hasRightPiece
        ? Variant.Middle
        : hasLeftPiece
        ? Variant.RightEnd
        : hasRightPiece
        ? Variant.LeftEnd
        : null),
  }
}
