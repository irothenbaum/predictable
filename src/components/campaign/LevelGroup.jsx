import React, {useEffect, useRef, useState} from 'react'
import Level from '../gameplay/Level'
import YouLostOverlay from './YouLostOverlay'
import PropTypes from 'prop-types'
import useDoOnceTimer from '../../hooks/useDoOnceTimer'

const WIN_DELAY = 1000
const WIN_TIMER = 'win-timer'

function LevelGroup(props) {
  const {setTimer} = useDoOnceTimer()
  /** @type {Solution[]} */
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
      setLevelDefinition(props.levels[solutions.length])
    }
  }, [solutions])

  const handleWin = s => {
    setTimer(WIN_TIMER, () => setSolutions([...solutions, s]), WIN_DELAY)
  }

  const handleLose = s => {
    setShowLost(true)
  }

  return showLost ? (
    <YouLostOverlay onPlayAgain={() => setShowLost(false)} />
  ) : levelDefinition ? (
    <Level
      levelDefinition={levelDefinition}
      onWin={handleWin}
      onLose={handleLose}
    />
  ) : null
}

LevelGroup.propTypes = {
  levels: PropTypes.arrayOf(Level.propTypes.levelDefinition),
  onWin: Level.propTypes.onWin, // one argument, Array<Solution>
}

export default LevelGroup
