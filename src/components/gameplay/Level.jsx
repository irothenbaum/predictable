import React, {useContext, useEffect, useState} from 'react'
import './Level.scss'
import LevelContext, {HydratedLevel} from '../../contexts/LevelContext.js'
import World from '../environment/World.jsx'
import {PieceType, squareSizeRemScale} from '../../lib/constants'
import useLevelControl from '../../hooks/useLevelControl'
import PropTypes from 'prop-types'
import {instantiateLevelPieces, LevelData} from '../../levels'
import Scrollable from '../utility/Scrollable'

import Player from '../environment/Player'
import Hazard from '../environment/Hazard'
import Obstacle from '../environment/Obstacle'
import Platform from '../environment/Platform'
import MovesInput from './MovesInput'
import MoveShadow from '../environment/MoveShadow'

const typeToComponentMap = {
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
  const [worldWidth, setWorldWidth] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)
  const {pieces, gameBoard} = useContext(LevelContext)
  return (
    <div className="level">
      <div
        className="world-container"
        style={{
          width: `${gameBoard.width * squareSizeRemScale}rem`,
        }}
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
            pieces={pieces}
            dimensionX={gameBoard.width}
            dimensionY={gameBoard.height}
            onRenderWorld={board => {
              setWorldWidth(board.width)
              setWorldHeight(board.height)
            }}
          />
        </Scrollable>
      </div>
    </div>
  )
}

LevelInner.propTypes = {}

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
      <LevelInner />
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
