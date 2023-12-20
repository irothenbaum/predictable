import React, {useContext, useState} from 'react'
import './Campaign.scss'
import CampaignContext, {
  HydratedCampaign,
  flushCampaign,
} from '../../contexts/CampaignContext.js'
import Level from '../gameplay/Level'
import PropTypes from 'prop-types'
import {instantiateLevelPieces, LevelData, LevelsOrder} from '../../levels'
import LevelGallery from './LevelGallery'
import SolutionResults from './SolutionResults'
import YouLostOverlay from './YouLostOverlay'

const STATUS_PLAYING = 'playing'
const STATUS_WON = 'won'
const STATUS_LOST = 'lost'
const STATUS_GALLERY = 'gallery'

function Campaign(props) {
  const [solutions, setSolutions] = useState(HydratedCampaign.solutions)
  const [lastCompletedLevelNum, setLastCompletedLevelNum] = useState(
    HydratedCampaign.lastCompletedLevelNum,
  )
  const [score, setScore] = useState(HydratedCampaign.score)
  const [gameStatus, setGameStatus] = useState(STATUS_GALLERY)
  const [levelDefinition, setLevelDefinition] = useState(null)

  /**
   * @param {number|string} nextLevelNum
   */
  const handleSelectLevel = nextLevelNum => {
    let nextLevelKey
    if (typeof nextLevelNum === 'string') {
      nextLevelKey = nextLevelNum
      nextLevelNum = LevelsOrder.indexOf(nextLevelKey)
    } else {
      nextLevelKey = LevelsOrder[nextLevelNum]
    }

    if (
      typeof nextLevelNum !== 'number' ||
      nextLevelNum < 0 ||
      nextLevelNum >= LevelsOrder.length
    ) {
      throw new Error(`Invalid level "${nextLevelNum}"`)
    }

    setGameStatus(STATUS_PLAYING)
    const nextLevelDef = LevelData[nextLevelKey]
    setLevelDefinition({
      levelKey: nextLevelKey,
      gameBoard: nextLevelDef.gameBoard,
      pieces: instantiateLevelPieces(nextLevelDef.pieces),
    })
  }

  /**
   * @param {Solution} solution
   */
  const handleLose = solution => {
    setGameStatus(STATUS_LOST)
  }

  /**
   * @param {Solution} solution
   */
  const handleWin = solution => {
    solution.levelKey = levelDefinition.levelKey
    setGameStatus(STATUS_WON)
    if (typeof props.onSave === 'function') {
      props.onSave(solution)
    }

    const nextScore = score + solution.score
    setScore(nextScore)
    const nextSolutions = {
      ...solutions,
      solution,
      [solution.levelKey]: solution,
    }
    setSolutions(nextSolutions)
    const thisLevelNum = LevelsOrder.indexOf(levelDefinition.levelKey)
    const nextLastCompletedLevelNum = Math.max(
      lastCompletedLevelNum,
      thisLevelNum,
    )
    setLastCompletedLevelNum(nextLastCompletedLevelNum)

    flushCampaign({
      score: nextScore,
      solutions: nextSolutions,
      lastCompletedLevelNum: nextLastCompletedLevelNum,
      lastCompletedLevelKey: LevelsOrder[nextLastCompletedLevelNum],
    })
  }

  return (
    <CampaignContext.Provider
      value={{
        lastCompletedLevelNum: lastCompletedLevelNum,
        score: score,
        solutions: solutions,
        lastCompletedLevelKey: LevelsOrder[lastCompletedLevelNum],
      }}>
      {gameStatus === STATUS_GALLERY ? (
        <LevelGallery onSelectLevel={handleSelectLevel} />
      ) : (
        <React.Fragment>
          {gameStatus === STATUS_WON ? (
            <SolutionResults
              solution={solutions[levelDefinition.levelKey]}
              onContinue={() => setGameStatus(STATUS_GALLERY)}
            />
          ) : gameStatus === STATUS_LOST ? (
            <YouLostOverlay
              onContinue={() => handleSelectLevel(levelDefinition.levelKey)}
            />
          ) : null}
          <Level
            levelDefinition={levelDefinition}
            onWin={handleWin}
            onLose={handleLose}
            disableInput={gameStatus !== STATUS_PLAYING}
          />
        </React.Fragment>
      )}
    </CampaignContext.Provider>
  )
}

Campaign.propTypes = {
  onSave: PropTypes.func,
}

export default Campaign
