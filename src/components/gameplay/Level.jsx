import React, {useContext, useEffect, useState} from 'react'
import './Level.scss'
import LevelContext, {HydratedLevel} from '../../contexts/LevelContext.js'
import World from '../environment/World.jsx'
import {PieceType} from '../../lib/constants'
import Player from './Player'
import useLevelControl from '../../hooks/useLevelControl'
import PropTypes from 'prop-types'
import GameLevels from '../../levels'
import {pieceDefinitionToPiece} from '../../lib/utilities'

/**
 * @param {Piece} piece
 */
function renderPiece(piece) {
  switch (piece.type) {
    case PieceType.Player:
      return <Player piece={piece} />

    default:
      return null
  }
}

function LevelInner(props) {
  const {pieces, moves} = useContext(LevelContext)

  // call playMoves to submit the moves
  const {playMoves} = useLevelControl({})

  return (
    <div className="level">
      <div className="world-container">
        <World renderPiece={renderPiece} pieces={pieces} dimension={8} />
      </div>
    </div>
  )
}

function Level(props) {
  const [pieces, setPieces] = useState([])
  const [moves, setMoves] = useState([])
  const [gameBoard, setGameBoard] = useState(HydratedLevel.gameBoard)

  useEffect(() => {
    if (!props.level || !GameLevels[props.level]) {
      return
    }

    setMoves([])
    setPieces(GameLevels[props.level].pieces.map(pieceDefinitionToPiece))
    setGameBoard(GameLevels[props.level].gameBoard)
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
      <LevelInner />
    </LevelContext.Provider>
  )
}

Level.propTypes = {
  level: PropTypes.string.isRequired,
}

export default Level
