import React from 'react'
import './Level.scss'
import World from '../environment/World.jsx'
import {PieceType} from '../../lib/constants'
import Player from './Player'

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

function Level(props) {
  const pieces = [
    {
      id: 'player',
      type: PieceType.Player,
      position: {
        row: 0,
        column: 0,
      },
    },
  ]

  return (
    <div className="level">
      <div className="world-container">
        <World renderPiece={renderPiece} pieces={pieces} dimension={8} />
      </div>
    </div>
  )
}

export default Level
