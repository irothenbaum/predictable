import React, {useEffect, useRef, useState} from 'react'
import Level from '../gameplay/Level'
import YouLostOverlay from './YouLostOverlay'
import PropTypes from 'prop-types'
import useDoOnceTimer from '../../hooks/useDoOnceTimer'
import {clone} from '../../lib/utilities'
import {InstructionalShape} from '../../lib/constants'

const WIN_DELAY = 1000
const WIN_TIMER = 'win-timer'

function LevelGroup(props) {
  const {setTimer} = useDoOnceTimer()
  /** @type {Array<Solution>} */
  const [solutions, setSolutions] = useState([])
  const [showLost, setShowLost] = useState(false)
  /** @type {LevelDefinition} */
  const [levelDefinition, setLevelDefinition] = useState(null)

  useEffect(() => {
    setSolutions([])
  }, [props.levels])

  useEffect(() => {
    if (solutions.length === props.levels.length) {
      props.onWin(solutions)
    } else {
      const nextDef = clone(props.levels[solutions.length])
      setLevelDefinition(nextDef)
    }
  }, [solutions])

  const handleWin = s => {
    setTimer(WIN_TIMER, () => setSolutions([...solutions, s]), WIN_DELAY)
  }

  const handleLose = s => {
    setShowLost(true)
  }

  const handlePlayAgain = () => {
    // reset our level
    setShowLost(false)
    setLevelDefinition(clone(props.levels[solutions.length]))
  }

  return (
    <React.Fragment>
      {showLost ? (
        <YouLostOverlay
          onPlayAgain={handlePlayAgain}
          onReturn={props.onReturn}
        />
      ) : null}
      {levelDefinition ? (
        <Level
          levelDefinition={levelDefinition}
          onWin={handleWin}
          onLose={handleLose}
        />
      ) : null}
    </React.Fragment>
  )
}

LevelGroup.propTypes = {
  levels: PropTypes.arrayOf(Level.propTypes.levelDefinition),
  instructions: PropTypes.arrayOf(InstructionalShape),
  onWin: Level.propTypes.onWin, // one argument, Array<Solution>
  onReturn: PropTypes.func,
}

export default LevelGroup
