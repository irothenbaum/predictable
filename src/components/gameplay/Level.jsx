import React, {useEffect, useState} from 'react'
import './Level.scss'
import LevelContext, {HydratedLevel} from '../../contexts/LevelContext.js'
import World from '../environment/World.jsx'
import {
  LevelDefinitionShape,
  PieceType,
  PositionShape,
  squareSizeRemScale,
} from '../../lib/constants'
import PropTypes from 'prop-types'
import Scrollable from '../utility/Scrollable'

import Player from '../environment/Player'
import Hazard from '../environment/Hazard'
import Obstacle from '../environment/Obstacle'
import Platform from '../environment/Platform'
import MovesInput from './MovesInput'
import {convertRemToPixels} from '../../lib/utilities'
import Goal from '../environment/Goal'
import useLevelControl from '../../hooks/useLevelControl'
import InstructionsRenderer from './InstructionsRenderer'

const PieceTypeToComponent = {
  [PieceType.Player]: Player,
  [PieceType.Hazard]: Hazard,
  [PieceType.Obstacle]: Obstacle,
  [PieceType.Platform]: Platform,
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
          transitionDuration={props.transitionDuration}
          scrollPos={scrollPos}
          hideMiniMap={
            worldWidth < window.innerWidth || worldHeight < window.innerHeight
          }
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
  startingPosition: PositionShape,
  gameBoard: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
  }),
  pieces: World.propTypes.pieces,
  onClickSquare: World.propTypes.onClickSquare,
  onHoverSquare: World.propTypes.onHoverSquare,
  transitionDuration: PropTypes.string,
}

// --------------------------------------------------------------------------------

function Level(props) {
  const [pieces, setPieces] = useState([])
  const [moves, setMoves] = useState([])
  const [gameBoard, setGameBoard] = useState(HydratedLevel.gameBoard)
  const [isPaused, setIsPaused] = useState(false)

  const playerPiece = pieces.find(p => p.isPlayer)

  // call playMoves to submit the moves
  const {playMoves, resetLevel, isShowingMoves, revealingMoveIndex} =
    useLevelControl({
      onWin: props.onWin,
      onLose: props.onLose,
      autoPlay: props.autoPlay,
      pieces,
      playerPiece,
      setPieces,
      moves,
      gameBoard,
    })

  useEffect(() => {
    if (props.autoPlay) {
      playMoves()
    }
  }, [props.autoPlay])

  // if we ever reset our moves, we also want to reset the level control
  useEffect(() => {
    if (!moves || moves.length === 0) {
      resetLevel()
    }
  }, [moves])

  useEffect(() => {
    if (!props.levelDefinition) {
      return
    }

    setMoves([])
    setPieces(props.levelDefinition.pieces)
    setGameBoard(props.levelDefinition.gameBoard)
  }, [props.levelDefinition])

  const isPausedFinal = props.forcePaused || isPaused

  return (
    <LevelContext.Provider
      value={{
        pieces,
        moves,
        gameBoard,
        setPieces,
        playerPiece,

        isShowingMoves,
        revealingMoveIndex,
        isPaused: isPausedFinal,
        setIsPaused: setIsPaused,
        playMoves: playMoves,

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
      <InstructionsRenderer instructions={props.levelDefinition.instructions} />
      {!props.autoPlay && !isPausedFinal && <MovesInput />}
    </LevelContext.Provider>
  )
}

Level.propTypes = {
  levelDefinition: LevelDefinitionShape.isRequired,
  onWin: PropTypes.func.isRequired,
  onLose: PropTypes.func.isRequired,
  autoPlay: PropTypes.bool,
  forcePaused: PropTypes.bool,
}

export default Level
