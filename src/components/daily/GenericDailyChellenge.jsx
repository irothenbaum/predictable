import React, {useEffect, useRef, useState} from 'react'
import './GenericDailyChallenge.scss'

import {generateLevelDefinition} from '../../lib/generateLevelDefinition'
import YouLostOverlay from '../campaign/YouLostOverlay'
import Level from '../gameplay/Level'
import {instantiateLevelPieces} from '../../levels'
import useDoOnceTimer from '../../hooks/useDoOnceTimer'
import LevelResults from './LevelResults'
import useSettingsContext from '../../hooks/useSettingsContext'
import {
  SCENE_MENU,
  DAILY_SEED,
  getGameSeedFromDailySeedAndScene,
  SCENE_DAILY,
  GameBoardPropType,
} from '../../lib/constants'
import PropTypes from 'prop-types'

function GenericDailyChallenge(props) {
  const rawLevelDefinition = useRef(null)
  const [levelDefinition, setLevelDefinition] = useState(null)
  const [showWin, setShowWin] = useState(false)
  const [showLoss, setShowLoss] = useState(false)
  const {setTimer} = useDoOnceTimer()
  const {goToScene, markSolvedPuzzle} = useSettingsContext()

  useEffect(() => {
    generateLevelDefinition(
      props.seed,
      props.gameBoard,
      props.difficulty || 1,
    ).then(res => {
      rawLevelDefinition.current = res
      setLevelDefinition({
        gameBoard: res.gameBoard,
        pieces: instantiateLevelPieces(res.pieces),
      })
    })
  }, [])

  const handleWin = results => {
    markSolvedPuzzle(props.seed, results.moves)
    setTimer(
      'win-results',
      () => {
        setShowWin(results)
      },
      1500,
    )
  }

  const handleLose = results => {
    setShowLoss(results)
  }

  const resetResults = () => {
    setShowWin(false)
    setShowLoss(false)
  }

  return (
    <div className="daily-challenge">
      {showWin ? (
        <LevelResults
          onShare={() => console.log('SHARE')}
          onReturn={() => goToScene(SCENE_MENU)}
        />
      ) : null}
      {showLoss ? (
        <YouLostOverlay
          moves={showLoss.moves}
          onPlayAgain={() => {
            setLevelDefinition({
              gameBoard: rawLevelDefinition.current.gameBoard,
              pieces: instantiateLevelPieces(rawLevelDefinition.current.pieces),
            })
            resetResults()
          }}
          onReturn={() => goToScene(SCENE_MENU)}
        />
      ) : null}
      {levelDefinition ? (
        <Level
          forcePaused={!!(showWin || showLoss)}
          levelDefinition={levelDefinition}
          onWin={handleWin}
          onLose={handleLose}
        />
      ) : null}
    </div>
  )
}

GenericDailyChallenge.propTypes = {
  seed: PropTypes.string.isRequired,
  gameBoard: GameBoardPropType.isRequired,
  difficulty: PropTypes.number,
}

export default GenericDailyChallenge
