import {contextFactory} from './shared'
const LEVEL_CACHE_KEY = 'predictable-level'

/** @type {LevelContextData} */
export const DefaultLevel = {
  pieces: [],
  moves: [],
  playerPiece: null,
  score: 0,
  gameBoard: {
    height: 8,
    width: 8,
  },
  isPaused: false,
}

const [LevelContext, HydratedLevel, flushLevel] = contextFactory(
  DefaultLevel,
  LEVEL_CACHE_KEY,
)

export {HydratedLevel, flushLevel}

export default LevelContext
