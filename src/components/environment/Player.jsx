import React, {useState, useEffect} from 'react'
import './Player.scss'
import {constructClassString} from '../../lib/utilities'
import useReadyTimer from '../../hooks/useReadyTimer'

function Player(props) {
  const {isReady} = useReadyTimer()

  return (
    <div className={constructClassString('player', {ready: isReady})}>
      <div className="player-inner" />
    </div>
  )
}

Player.propTypes = {}

export default Player
