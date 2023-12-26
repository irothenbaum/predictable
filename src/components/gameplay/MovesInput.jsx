import React, {useCallback, useContext, useEffect} from 'react'
import './MovesInput.scss'
import PropTypes from 'prop-types'
import useLevelControl from '../../hooks/useLevelControl'
import LevelContext from '../../contexts/LevelContext'
import Icon, {
  ARROW_LEFT,
  ARROW_RIGHT,
  ARROW_UP,
  ARROW_DOWN,
  CIRCLE,
  PLAY,
  RESET,
} from '../utility/Icon'
import {getArrowIconFromVelocity} from '../utilities'
import useKeyListener from '../../hooks/useKeyListener'
import {constructClassString} from '../../lib/utilities'

const MovementOptions = [
  {rowChange: 0, columnChange: -1},
  {rowChange: -1, columnChange: 0},
  {rowChange: 0, columnChange: 0},
  {rowChange: 1, columnChange: 0},
  {rowChange: 0, columnChange: 1},
]

function MovesInput(props) {
  const {moves, queueMove, popMove, revealingMoveIndex} =
    useContext(LevelContext)

  const keyHandler = useCallback(key => {
    switch (key) {
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
        props.onPlayMoves()
        break
      case 'r':
        popMove()
        break
    }
  }, [])
  useKeyListener(keyHandler)

  return (
    <div className="moves-input-container">
      <div className="moves-queue">
        {moves.map((move, index) => (
          <Icon
            icon={getArrowIconFromVelocity(move)}
            key={index}
            className={constructClassString({
              past: index < revealingMoveIndex,
              active: revealingMoveIndex === index,
            })}
          />
        ))}
      </div>

      <div className="moves-input-buttons">
        <Icon icon={RESET} onClick={popMove} className="undo-button" />

        {MovementOptions.map((m, i) => {
          return (
            <Icon
              key={i}
              icon={getArrowIconFromVelocity(m)}
              onClick={() => queueMove(m)}
            />
          )
        })}

        <Icon icon={PLAY} onClick={props.onPlayMoves} className="play-button" />
      </div>
    </div>
  )
}

MovesInput.propTypes = {
  onPlayMoves: PropTypes.func.isRequired,
}

export default MovesInput
