import React, {useState} from 'react'
import './PredictableGame.scss'
import GameContext from '../contexts/GameContext.js'
import Level from './gameplay/Level'
import PropTypes from 'prop-types'
import {LEVEL_TUTORIAL} from '../levels'
import LevelBuilder from './builder/LevelBuilder'

function PredictableGame(props) {
  const handleLose = () => window.alert('LOST')
  const handleWin = () => window.alert('WON')

  return (
    <GameContext.Provider value={{}}>
      <Level level={LEVEL_TUTORIAL} onWin={handleWin} onLose={handleLose} />
      {/*<LevelBuilder />*/}
    </GameContext.Provider>
  )
}

export default PredictableGame
