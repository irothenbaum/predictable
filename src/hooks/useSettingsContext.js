import {useContext} from 'react'
import SettingsContext from '../contexts/SettingsContext'

/**
 * @returns {SettingsContextData & {goToScene: (scene: string) => void, scene: string, markSolvedPuzzle: (key: string, moves: Array<Velocity>) => void}}}
 */
function useSettingsContext() {
  return useContext(SettingsContext)
}

export default useSettingsContext
