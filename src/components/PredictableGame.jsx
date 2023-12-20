import React, {useContext, useState} from 'react'
import './PredictableGame.scss'
import PropTypes from 'prop-types'
import LevelBuilder from './builder/LevelBuilder'
import Campaign from './campaign/Campaign'
import SettingsContext from '../contexts/SettingsContext'

const STATUS_PLAYING = 'playing'
const STATUS_WON = 'won'
const STATUS_LOST = 'lost'
const STATUS_GALLERY = 'gallery'

function PredictableGame(props) {
  return (
    <SettingsContext.Provider value={{}}>
      <Campaign />
      {/*<LevelBuilder />*/}
    </SettingsContext.Provider>
  )
}

PredictableGame.propTypes = {
  onSave: PropTypes.func,
}

export default PredictableGame
