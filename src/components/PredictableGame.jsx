import React, {useState} from 'react'
import GameContext from '../contexts/GameContext.js'
import Level from './gameplay/Level'
import PropTypes from 'prop-types'
import {LEVEL_TUTORIAL} from '../levels'

function PredictableGame(props) {
  return (
    <GameContext.Provider value={{}}>
      <div className="predictable-game">
        <Level level={LEVEL_TUTORIAL} />
      </div>
    </GameContext.Provider>
  )
}

export default PredictableGame
