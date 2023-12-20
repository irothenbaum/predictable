import React, {useState, useEffect} from 'react'
import './Player.scss'
import PropTypes from 'prop-types'
import {PiecePropType} from '../../lib/constants'
import {constructClassString} from '../../lib/utilities'
import useReadyTimer from '../../hooks/useReadyTimer'

function Player(props) {
  const {isReady} = useReadyTimer()

  return (
    <div className={constructClassString('player', {ready: isReady})}></div>
  )
}

Player.propTypes = {}

export default Player
