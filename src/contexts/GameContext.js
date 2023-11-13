import {contextFactory} from './shared'
const GAME_CACHE_KEY = 'predictable-game'

export const DefaultSession = {
  hasReadRules: false,
}

const [GameContext, HydratedSession, flushSession] = contextFactory(
  DefaultSession,
  GAME_CACHE_KEY,
)

export {HydratedSession, flushSession}

export default GameContext
