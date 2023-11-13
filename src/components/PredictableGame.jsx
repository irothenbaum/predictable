import React from 'react'
import SessionContext from '../contexts/SessionContext.js'
import Level from './gameplay/Level'

function PredictableGame(props) {
  return (
    <SessionContext.Provider value={{}}>
      <div className="predictable-game">
        <Level />
      </div>
    </SessionContext.Provider>
  )
}

export default PredictableGame
