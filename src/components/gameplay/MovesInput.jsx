import React, {useContext, useEffect} from 'react'
import './MovesInput.scss'
import PropTypes from 'prop-types'
import useLevelControl from '../../hooks/useLevelControl'
import LevelContext from '../../contexts/LevelContext'
import IconWithShadow from '../utility/IconWithShadow'
import {
  ARROW_LEFT,
  ARROW_RIGHT,
  ARROW_UP,
  ARROW_DOWN,
  CIRCLE,
  PLAY,
  RESET,
} from '../utility/Icon'
import {getArrowIconFromVelocity} from '../utilities'

const MovementOptions = [
  {rowChange: 0, columnChange: -1},
  {rowChange: -1, columnChange: 0},
  {rowChange: 0, columnChange: 0},
  {rowChange: 1, columnChange: 0},
  {rowChange: 0, columnChange: 1},
]

function MovesInput(props) {
  const {moves, queueMove, popMove} = useContext(LevelContext)
  // call playMoves to submit the moves
  const {playMoves, isShowingMoves, revealingMoveIndex} = useLevelControl({
    onWin: props.onWin,
    onLose: props.onLose,
  })

  useEffect(() => {
    const handleKeyDown = e => {
      console.log(e.key)
      switch (e.key) {
        case 'ArrowLeft':
          queueMove(MovementOptions[0])
          break
        case 'ArrowUp':
          queueMove(MovementOptions[1])
          break
        case ' ':
          queueMove(MovementOptions[2])
          break
        case 'ArrowDown':
          queueMove(MovementOptions[3])
          break
        case 'ArrowRight':
          queueMove(MovementOptions[4])
          break
        case 'Enter':
          playMoves()
          break
        case 'r':
          popMove()
          break
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <div className="moves-input-container">
      <div className="moves-queue">
        {moves.map((move, index) => (
          <IconWithShadow
            icon={getArrowIconFromVelocity(move)}
            key={index}
            active={revealingMoveIndex === index}
          />
        ))}
      </div>

      <div className="moves-input-buttons">
        <IconWithShadow icon={RESET} onClick={popMove} />

        {MovementOptions.map((m, i) => {
          return (
            <IconWithShadow
              key={i}
              icon={getArrowIconFromVelocity(m)}
              onClick={() => queueMove(m)}
            />
          )
        })}

        <IconWithShadow icon={PLAY} onClick={() => playMoves()} />
      </div>
    </div>
  )
}

MovesInput.propTypes = {
  onWin: PropTypes.func.isRequired,
  onLose: PropTypes.func.isRequired,
}

export default MovesInput
