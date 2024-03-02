import {useContext} from 'react'
import SettingsContext from '../contexts/SettingsContext'

/**
 * @returns {SettingsContextData}
 */
function useSettingsContext() {
  return useContext(SettingsContext)
}

export default useSettingsContext
