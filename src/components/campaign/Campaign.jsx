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
import LevelGroup from './LevelGroup'
import LevelGroupResults from './LevelGroupResults'
import useDoOnceTimer from '../../hooks/useDoOnceTimer'

const STATUS_PLAYING = 'playing'
const STATUS_WON = 'won'
const STATUS_GALLERY = 'gallery'

const LEVEL_TRANSITION_TIMER = 'level-transition-timer'
const LEVEL_TRANSITION_DELAY = 1000

function Campaign(props) {
  const [solutions, setSolutions] = useState(HydratedCampaign.solutions)
  const [lastCompletedLevelNum, setLastCompletedLevelNum] = useState(
    HydratedCampaign.lastCompletedLevelNum || -1,
  )
  const [score, setScore] = useState(HydratedCampaign.score)
  const [gameStatus, setGameStatus] = useState(STATUS_GALLERY)
  const [levelDefinition, setLevelDefinition] = useState(null)
  const [previousLevel, setPreviousLevel] = useState(null)
  const {setTimer} = useDoOnceTimer()

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
      nextLevelNum >= LevelsOrder.length ||
      !nextLevelKey
    ) {
      throw new Error(`Invalid level "${nextLevelNum}"`)
    }

    // enter play status and build the world based off the level definition
    setGameStatus(STATUS_PLAYING)
    const nextLevelDef = LevelData[nextLevelKey]
    if (nextLevelDef.subLevels) {
      setLevelDefinition({
        levelKey: nextLevelKey,
        subLevels: nextLevelDef.subLevels.map(def => ({
          gameBoard: def.gameBoard,
          pieces: instantiateLevelPieces(def.pieces),
        })),
      })
    } else {
      setLevelDefinition({
        levelKey: nextLevelKey,
        gameBoard: nextLevelDef.gameBoard,
        pieces: instantiateLevelPieces(nextLevelDef.pieces),
      })
    }
  }

  /**
   * @param {Array<Solution>} s
   */
  const handleWin = s => {
    const levelGroupSolution = {
      levelKey: levelDefinition.levelKey,
      score: s.reduce((sum, s) => sum + s.score, 0),
      solutions: s,
    }
    // mark what level this solution is for
    // update our UI to indicate we've won
    setGameStatus(STATUS_WON)
    if (typeof props.onSave === 'function') {
      props.onSave(levelGroupSolution)
    }

    let nextScore = score
    let nextSolutions = solutions
    const previousSolve = solutions[levelGroupSolution.levelKey]
    // if this is our first solution for this level, or if it's better than previous scores
    if (!previousSolve || previousSolve.score < levelGroupSolution.score) {
      // update our solution history with this solution
      nextSolutions = {
        ...solutions,
        [levelGroupSolution.levelKey]: levelGroupSolution,
      }
      setSolutions(nextSolutions)

      // update our total score with this solution's score (taking care to subtract the previous score if it exists)
      nextScore = score - (previousSolve?.score || 0) + levelGroupSolution.score
      setScore(nextScore)
    }

    // determine which level number this is
    const thisLevelNum = LevelsOrder.indexOf(levelGroupSolution.levelKey)

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

  // this is a little incorrect in that if they don't click "continue" then we will have saved their score and solution, but not marked the level change
  // I'm basically hoping they will always click the button
  const handleShowNextLevel = () => {
    setGameStatus(STATUS_GALLERY)
    setPreviousLevel(lastCompletedLevelNum - 1)
    setTimer(
      LEVEL_TRANSITION_TIMER,
      () => setPreviousLevel(null),
      LEVEL_TRANSITION_DELAY,
    )
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
        <LevelGallery
          onSelectLevel={handleSelectLevel}
          transitionFromLevelNum={previousLevel}
        />
      ) : (
        <React.Fragment>
          {gameStatus === STATUS_WON ? (
            <LevelGroupResults
              solution={solutions[levelDefinition.levelKey]}
              onContinue={handleShowNextLevel}
            />
          ) : null}
          <LevelGroup
            onReturn={() => setGameStatus(STATUS_GALLERY)}
            levels={levelDefinition.subLevels}
            onWin={handleWin}
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
