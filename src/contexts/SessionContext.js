import {contextFactory} from './shared'
const SESSION_CACHE_KEY = 'predictable-session'

export const DefaultSession = {
  hasReadRules: false,
}

const [SessionContext, HydratedSession, flushSession] = contextFactory(
  DefaultSession,
  SESSION_CACHE_KEY,
)

export {HydratedSession, flushSession}

export default SessionContext
