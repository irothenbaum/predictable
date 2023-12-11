import React, {useContext, useEffect, useState} from 'react'
import './Level.scss'
import LevelContext, {HydratedLevel} from '../../contexts/LevelContext.js'
import World from '../environment/World.jsx'
import {PieceType} from '../../lib/constants'
import PropTypes from 'prop-types'
import {instantiateLevelPieces, LevelData} from '../../levels'
import Scrollable from '../utility/Scrollable'

import Player from '../environment/Player'
import Hazard from '../environment/Hazard'
import Obstacle from '../environment/Obstacle'
import Platform from '../environment/Platform'
import MovesInput from './MovesInput'
import MoveShadow from '../environment/MoveShadow'

const PieceTypeToComponent = {
  [PieceType.Player]: Player,
  [PieceType.Hazard]: Hazard,
  [PieceType.Obstacle]: Obstacle,
  [PieceType.Platform]: Platform,
  [PieceType.MoveShadow]: MoveShadow,
}

/**
 * @param {Piece} piece
 */
function renderPiece(piece) {
  const Component = PieceTypeToComponent[piece.type]

  if (Component) {
    return <Component piece={piece} />
  } else {
    console.warn(`Unknown piece type "${piece.type}"`)
    return null
  }
}

export function LevelInner(props) {
  const [worldHeight, setWorldHeight] = useState(0)
  const [worldWidth, setWorldWidth] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)
  return (
    <div className="level">
      <div
        className="world-container"
        ref={r => {
          if (r) {
            if (r.clientHeight > 0) {
              setContainerHeight(r.clientHeight)
            }
            if (r.clientWidth > 0) {
              setContainerWidth(r.clientWidth)
            }
          }
        }}>
        <Scrollable
          height={worldHeight}
          width={worldWidth}
          viewHeight={containerHeight}
          viewWidth={containerWidth}>
          <World
            renderPiece={renderPiece}
            pieces={props.pieces}
            dimensionX={props.gameBoard.width}
            dimensionY={props.gameBoard.height}
            onRenderWorld={board => {
              setWorldWidth(board.width)
              setWorldHeight(board.height)
            }}
            onClickSquare={props.onClickSquare}
            onHoverSquare={props.onHoverSquare}
          />
        </Scrollable>
      </div>
    </div>
  )
}

LevelInner.propTypes = {
  pieces: PropTypes.array,
  gameBoard: PropTypes.object,
  onClickSquare: PropTypes.func,
  onHoverSquare: PropTypes.func,
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
  }, [props.level])

  return (
    <LevelContext.Provider
      value={{
        pieces,
        moves,
        gameBoard,
        setPieces,
        playerPiece: pieces.find(p => p.isPlayer),

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
      <LevelInner gameBoard={gameBoard} pieces={pieces} />
      <MovesInput onWin={props.onWin} onLose={props.onLose} />
    </LevelContext.Provider>
  )
}

Level.propTypes = {
  level: PropTypes.string.isRequired,
  onWin: PropTypes.func.isRequired,
  onLose: PropTypes.func.isRequired,
}

export default Level
