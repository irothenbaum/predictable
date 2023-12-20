import React, {useEffect, useState} from 'react'
import './Level.scss'
import LevelContext, {HydratedLevel} from '../../contexts/LevelContext.js'
import World from '../environment/World.jsx'
import {PieceType, squareSizeRemScale} from '../../lib/constants'
import PropTypes from 'prop-types'
import Scrollable from '../utility/Scrollable'

import Player from '../environment/Player'
import Hazard from '../environment/Hazard'
import Obstacle from '../environment/Obstacle'
import Platform from '../environment/Platform'
import MovesInput from './MovesInput'
import MoveShadow from '../environment/MoveShadow'
import {convertRemToPixels} from '../../lib/utilities'
import Goal from '../environment/Goal'

const PieceTypeToComponent = {
  [PieceType.Player]: Player,
  [PieceType.Hazard]: Hazard,
  [PieceType.Obstacle]: Obstacle,
  [PieceType.Platform]: Platform,
  [PieceType.MoveShadow]: MoveShadow,
  [PieceType.Goal]: Goal,
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
  const [scrollPos, setScrollPos] = useState(undefined)

  // when the starting position changes, we need to scroll to it (converting rows/columns to x/y
  useEffect(() => {
    if (props.startingPosition) {
      const squareSizePx = convertRemToPixels(squareSizeRemScale)
      setScrollPos({
        y: props.startingPosition.row * squareSizePx - containerHeight / 2,
        x: props.startingPosition.column * squareSizePx - containerWidth / 2,
      })
    }
  }, [props.startingPosition])

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
          scrollPos={scrollPos}
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
  startingPosition: PropTypes.shape({
    row: PropTypes.number,
    column: PropTypes.number,
  }),
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
    if (!props.levelDefinition) {
      return
    }

    setMoves([])
    setPieces(props.levelDefinition.pieces)
    setGameBoard(props.levelDefinition.gameBoard)
  }, [props.levelDefinition])

  const playerPiece = pieces.find(p => p.isPlayer)

  return (
    <LevelContext.Provider
      value={{
        pieces,
        moves,
        gameBoard,
        setPieces,
        playerPiece,

        queueMove: move => {
          setMoves(m => [...m, move])
        },
        clearMoves: () => {
          setMoves([])
        },
        popMove: () => {
          setMoves(m => {
            const newMoves = [...m]
            newMoves.pop()
            return newMoves
          })
        },
      }}>
      <LevelInner
        gameBoard={gameBoard}
        pieces={pieces}
        startingPosition={playerPiece?.position}
      />
      {!props.disableInput && (
        <MovesInput onWin={props.onWin} onLose={props.onLose} />
      )}
    </LevelContext.Provider>
  )
}

Level.propTypes = {
  levelDefinition: PropTypes.shape({
    pieces: PropTypes.arrayOf(PropTypes.object),
    gameBoard: PropTypes.object,
  }).isRequired,
  onWin: PropTypes.func.isRequired,
  onLose: PropTypes.func.isRequired,
  disableInput: PropTypes.bool,
}

export default Level
