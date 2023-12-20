import React, {useContext, useState} from 'react'
import './PredictableGame.scss'
import Level from './gameplay/Level'
import PropTypes from 'prop-types'
import {LevelsOrder} from '../levels'
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
    </SettingsContext.Provider>
  )
}

PredictableGame.propTypes = {
  onSave: PropTypes.func,
}

export default PredictableGame
