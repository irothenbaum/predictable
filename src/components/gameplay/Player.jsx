import React from 'react'
import './Player.scss'
import PropTypes from 'prop-types'
import Sprite, {PLAYER, SPRITE_COLOR_PRIMARY, SPRITE_COLOR_RED} from './Sprite'

function Player(props) {
  return (
    <div className="player">
      <Sprite spriteColor={SPRITE_COLOR_PRIMARY} type={PLAYER} />
    </div>
  )
}

Player.propTypes = {
  piece: PropTypes.object.isRequired,
}

export default Player
