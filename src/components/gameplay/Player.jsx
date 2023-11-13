import React from 'react'
import './Player.scss'
import PropTypes from 'prop-types'
import Sprite, {PLAYER} from './Sprite'

function Player(props) {
  /** @type {Player} piece */
  const {piece} = props
  const {x, y} = piece.position

  return (
    <div className="player" style={{left: x, top: y}}>
      <Sprite type={PLAYER} />
    </div>
  )
}

Player.propTypes = {
  piece: PropTypes.object.isRequired,
}

export default Player
