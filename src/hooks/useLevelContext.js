import {useContext} from 'react'
import LevelContext from '../contexts/LevelContext'

/**
 * @returns {LevelContextData}
 */
function useLevelContext() {
  return useContext(LevelContext)
}

export default useLevelContext
