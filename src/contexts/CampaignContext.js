import {contextFactory} from './shared'
const GAME_CACHE_KEY = 'predictable-game'

/**
 * @type {CamapignContextData}
 */
export const DefaultSession = {
  score: 0,
  lastCompletedLevelKey: undefined,
  lastCompletedLevelNum: -1,
  solutions: {},
}

const [CampaignContext, HydratedCampaign, flushCampaign] = contextFactory(
  DefaultSession,
  GAME_CACHE_KEY,
)

export {HydratedCampaign, flushCampaign}

export default CampaignContext
