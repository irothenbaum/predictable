import {useContext} from 'react'
import CampaignContext from '../contexts/CampaignContext'

/**
 * @returns {CamapignContextData}
 */
function useCampaignContext() {
  return useContext(CampaignContext)
}

export default useCampaignContext
