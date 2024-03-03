import {v4 as uuid} from 'uuid'
import {PieceType, Variant} from '../lib/constants'
import {getCoordinateKey} from '../lib/utilities'

import LevelTutorial from './tutorial.json'
import Level_1 from './level_1.json'
import Level_2 from './level_2.json'
import Level_3 from './level_3.json'
import Level_4 from './level_4.json'
import Level_5 from './level_5.json'
import Level_6 from './level_6.json'
import Level_7 from './level_7.json'
import Level_8 from './level_8.json'
import Level_9 from './level_9.json'
import Level_10 from './level_10.json'
import Level_11 from './level_11.json'
import Level_12 from './level_12.json'
import Level_13 from './level_13.json'
import Level_14 from './level_14.json'
import Level_15 from './level_15.json'
import Level_16 from './level_16.json'
import Level_17 from './level_17.json'
import Level_18 from './level_18.json'
import Level_19 from './level_19.json'
import Level_20 from './level_20.json'

export const LEVEL_TUTORIAL = 'tutorial'
export const LEVEL_1 = 'level-1'
export const LEVEL_2 = 'level-2'
export const LEVEL_3 = 'level-3'
export const LEVEL_4 = 'level-4'
export const LEVEL_5 = 'level-5'
export const LEVEL_6 = 'level-6'
export const LEVEL_7 = 'level-7'
export const LEVEL_8 = 'level-8'
export const LEVEL_9 = 'level-9'
export const LEVEL_10 = 'level-10'
export const LEVEL_11 = 'level-11'
export const LEVEL_12 = 'level-12'
export const LEVEL_13 = 'level-13'
export const LEVEL_14 = 'level-14'
export const LEVEL_15 = 'level-15'
export const LEVEL_16 = 'level-16'
export const LEVEL_17 = 'level-17'
export const LEVEL_18 = 'level-18'
export const LEVEL_19 = 'level-19'
export const LEVEL_20 = 'level-20'

/**
 * @type {Object<string, LevelGroupDefinition>}
 */
export const LevelData = {
  [LEVEL_TUTORIAL]: LevelTutorial,
  [LEVEL_1]: Level_1,
  [LEVEL_2]: Level_2,
  [LEVEL_3]: Level_3,
  [LEVEL_4]: Level_4,
  [LEVEL_5]: Level_5,
  [LEVEL_6]: Level_6,
  [LEVEL_7]: Level_7,
  [LEVEL_8]: Level_8,
  [LEVEL_9]: Level_9,
  [LEVEL_10]: Level_10,
  [LEVEL_11]: Level_11,
  [LEVEL_12]: Level_12,
  [LEVEL_13]: Level_13,
  [LEVEL_14]: Level_14,
  [LEVEL_15]: Level_15,
  [LEVEL_16]: Level_16,
  [LEVEL_17]: Level_17,
  [LEVEL_18]: Level_18,
  [LEVEL_19]: Level_19,
  [LEVEL_20]: Level_20,
}

export const LevelsOrder = Object.keys(LevelData)

/**
 * @param {Array<PieceDefinition>} pieceDefintions
 * @return {Array<AbstractPiece>}
 */
export function instantiateLevelPieces(pieceDefintions) {
  if (!Array.isArray(pieceDefintions)) {
    return []
  }

  const coordsToPieceMap = pieceDefintions.reduce((agr, p) => {
    const k = getCoordinateKey(p)
    if (!agr[k]) {
      agr[k] = []
    }
    agr[k].push(p)
    return agr
  }, {})

  return pieceDefintions.map(p => pieceDefinitionToPiece(p, coordsToPieceMap))
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
