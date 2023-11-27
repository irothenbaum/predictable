import React, {useState} from 'react'
import './PredictableGame.scss'
import GameContext from '../contexts/GameContext.js'
import Level from './gameplay/Level'
import PropTypes from 'prop-types'
import {LEVEL_TUTORIAL} from '../levels'

function PredictableGame(props) {
  const handleLose = () => console.log('LOSE')
  const handleWin = () => console.log('WIN')

  return (
    <GameContext.Provider value={{}}>
      <Level level={LEVEL_TUTORIAL} onWin={handleWin} onLose={handleLose} />
    </GameContext.Provider>
  )
}

export default PredictableGame
