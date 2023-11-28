import React, {useContext, useEffect, useState} from 'react'
import './Level.scss'
import LevelContext, {HydratedLevel} from '../../contexts/LevelContext.js'
import World from '../environment/World.jsx'
import {PieceType} from '../../lib/constants'
import useLevelControl from '../../hooks/useLevelControl'
import PropTypes from 'prop-types'
import {instantiateLevelPieces, LevelData} from '../../levels'
import Scrollable from '../utility/Scrollable'

import Player from './Player'
import Hazard from './Hazard'
import Obstacle from './Obstacle'
import Platform from './Platform'

const typeToComponentMap = {
  [PieceType.Player]: Player,
  [PieceType.Hazard]: Hazard,
  [PieceType.Obstacle]: Obstacle,
  [PieceType.Platform]: Platform,
}

/**
 * @param {Piece} piece
 */
function renderPiece(piece) {
  const Component = typeToComponentMap[piece.type]

  if (Component) {
    return <Component piece={piece} />
  } else {
    console.warn(`Unknown piece type "${piece.type}"`)
    return null
  }
}

function LevelInner(props) {
  const [worldHeight, setWorldHeight] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)
  const {pieces, moves, gameBoard} = useContext(LevelContext)
  // call playMoves to submit the moves
  const {playMoves} = useLevelControl({})
  return (
    <div className="level">
      <div
        className="world-container"
        ref={r => {
          if (r && r.clientHeight > 0) {
            setContainerHeight(r.clientHeight)
          }
        }}>
        <Scrollable height={worldHeight} viewHeight={containerHeight}>
          <World
            renderPiece={renderPiece}
            pieces={pieces}
            dimensionX={gameBoard.width}
            dimensionY={gameBoard.height}
            onRenderWorld={board => {
              setWorldHeight(board.height)
            }}
          />
        </Scrollable>
      </div>
    </div>
  )
}

LevelInner.propTypes = {
  onWin: PropTypes.func.isRequired,
  onLose: PropTypes.func.isRequired,
}

// --------------------------------------------------------------------------------

function Level(props) {
  const [pieces, setPieces] = useState([])
  const [moves, setMoves] = useState([])
  const [gameBoard, setGameBoard] = useState(HydratedLevel.gameBoard)

  useEffect(() => {
    if (!props.level || !LevelData[props.level]) {
      return
    }

    setMoves([])
    setPieces(instantiateLevelPieces(props.level))
    setGameBoard(LevelData[props.level].gameBoard)
  }, [])

  return (
    <LevelContext.Provider
      value={{
        pieces,
        moves,
        gameBoard,
        setPieces,

        queueMove: move => {
          setMoves([...moves, move])
        },
        clearMoves: () => {
          setMoves([])
        },
        popMove: () => {
          const newMoves = [...moves]
          newMoves.pop()
          setMoves(newMoves)
        },
      }}>
      <LevelInner onWin={props.onWin} onLose={props.onLose} />
    </LevelContext.Provider>
  )
}

Level.propTypes = {
  level: PropTypes.string.isRequired,
  onWin: PropTypes.func.isRequired,
  onLose: PropTypes.func.isRequired,
}

export default Level
