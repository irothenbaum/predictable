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
    HydratedCampaign.lastCompletedLevelNum || -1,
  )
  const [score, setScore] = useState(HydratedCampaign.score)
  const [gameStatus, setGameStatus] = useState(STATUS_GALLERY)
  const [levelDefinition, setLevelDefinition] = useState(null)

  /**
   * @param {number|string} nextLevelNum
   */
  const handleSelectLevel = nextLevelNum => {
    // normalize our argument into both string and number
    let nextLevelKey
    if (typeof nextLevelNum === 'string') {
      nextLevelKey = nextLevelNum
      nextLevelNum = LevelsOrder.indexOf(nextLevelKey)
    } else {
      nextLevelKey = LevelsOrder[nextLevelNum]
    }

    // if the input could not be normalized to a valid level, throw an error
    if (
      typeof nextLevelNum !== 'number' ||
      nextLevelNum < 0 ||
      nextLevelNum >= LevelsOrder.length
    ) {
      throw new Error(`Invalid level "${nextLevelNum}"`)
    }

    // enter play status and build the world based off the level definition
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
    // mark what level this solution is for
    solution.levelKey = levelDefinition.levelKey
    // update our UI to indicate we've won
    setGameStatus(STATUS_WON)
    if (typeof props.onSave === 'function') {
      props.onSave(solution)
    }

    let nextScore = score
    let nextSolutions = solutions
    const previousSolve = solutions[solution.levelKey]
    // if this is our first solution for this level, or if it's better than previous scores
    if (!previousSolve || previousSolve.score < solution.score) {
      // update our solution history with this solution
      nextSolutions = {
        ...solutions,
        solution,
        [solution.levelKey]: solution,
      }
      setSolutions(nextSolutions)

      // update our total score with this solution's score (taking care to subtract the previous score if it exists)
      nextScore = score - (previousSolve?.score || 0) + solution.score
      setScore(nextScore)
    }

    // determine which level number this is
    const thisLevelNum = LevelsOrder.indexOf(levelDefinition.levelKey)

    // mark that we just completed this level by update the last completed level number
    const nextLastCompletedLevelNum = Math.max(
      lastCompletedLevelNum,
      thisLevelNum,
    )
    setLastCompletedLevelNum(nextLastCompletedLevelNum)

    // last we save this win to our persistent storage
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
