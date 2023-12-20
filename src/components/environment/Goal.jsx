import React from 'react'
import './Goal.scss'
import {constructClassString} from '../../lib/utilities'

function Goal(props) {
  return (
    <div
      className={constructClassString('goal', {
        collected: props.piece.isCollected,
      })}>
      <div></div>
    </div>
  )
}

export default Goal
