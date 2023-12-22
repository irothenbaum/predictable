import React, {useContext, useState} from 'react'
import './PredictableGame.scss'
import PropTypes from 'prop-types'
import LevelGroupBuilder from './builder/LevelGroupBuilder'
import Campaign from './campaign/Campaign'
import SettingsContext from '../contexts/SettingsContext'

function PredictableGame(props) {
  return (
    <SettingsContext.Provider value={{}}>
      <Campaign />
      {/*<LevelGroupBuilder />*/}
    </SettingsContext.Provider>
  )
}

PredictableGame.propTypes = {
  onSave: PropTypes.func,
}

export default PredictableGame
