import React, {useEffect, useState} from 'react'
import './DailyChallenge.scss'

import {generateLevelDefinition} from '../../lib/generateLevelDefinition'
import YouLostOverlay from '../campaign/YouLostOverlay'
import Level from '../gameplay/Level'
import {instantiateLevelPieces} from '../../levels'

const seed = '1715550360661' // '' + Date.now()

function DailyChallenge(props) {
  const [levelDefinition, setLevelDefinition] = useState(null)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    console.log('SEED:', seed)
    generateLevelDefinition(seed, {width: 5, height: 5}, 1).then(res => {
      setLevelDefinition({
        gameBoard: res.gameBoard,
        pieces: instantiateLevelPieces(res.pieces),
      })
    })
  }, [])

  const handleWin = () => {
    console.log('WIN')
    setShowResults(true)
  }

  const handleLose = () => {
    console.log('LOSE')
    setShowResults(true)
  }

  return (
    <div className="daily-challenge">
      {showResults ? (
        <div className="results">
          <h2>Results</h2>
          <button onClick={() => setShowResults(false)}>Close</button>
        </div>
      ) : null}
      {levelDefinition ? (
        <Level
          forcePaused={showResults}
          levelDefinition={levelDefinition}
          onWin={handleWin}
          onLose={handleLose}
        />
      ) : null}
    </div>
  )
}

export default DailyChallenge
