import {contextFactory} from './shared'
const SESSION_CACHE_KEY = 'predictable-session'

/**
 * @type {SettingsContextData}
 */
export const DefaultSettings = {
  hasReadRules: false,
}

const [SettingsContext, HydratedSettings, flushSettings] = contextFactory(
  DefaultSettings,
  SESSION_CACHE_KEY,
)

export {HydratedSettings, flushSettings}

export default SettingsContext
