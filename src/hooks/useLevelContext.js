import {useContext} from 'react'
import LevelContext from '../contexts/LevelContext'

/**
 * @typedef {Object} ExtraLevelContext
 * @property {boolean} hasWonLevel
 * @property {boolean} isShowingMoves
 * @property {number} revealingMoveIndex
 * @property {boolean} isPaused
 * @property {function(boolean): void} setIsPaused
 * @property {function(Array<Piece>): void} setPieces
 * @property {function(): void} playMoves
 * @property {function(): void} clearMoves
 * @property {function(): void} popMove
 * @property {function(Velocity): void} queueMove
 */

/**
 * @returns {LevelContextData & ExtraLevelContext}
 */
function useLevelContext() {
  return useContext(LevelContext)
}

export default useLevelContext
