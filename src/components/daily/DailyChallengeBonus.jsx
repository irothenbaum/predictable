import React, {useEffect, useRef, useState} from 'react'

import useSettingsContext from '../../hooks/useSettingsContext'
import {
  DAILY_SEED,
  getGameSeedFromDailySeedAndScene,
  SCENE_BONUS_CHALLENGE,
} from '../../lib/constants'
import GenericDailyChallenge from './GenericDailyChellenge'

const gameSeed = getGameSeedFromDailySeedAndScene(
  DAILY_SEED,
  SCENE_BONUS_CHALLENGE,
)
const gameBoard = {width: 8, height: 12}

function DailyChallenge(props) {
  const {goToScene} = useSettingsContext()

  return (
    <div className="daily-challenge">
      <GenericDailyChallenge seed={gameSeed} gameBoard={gameBoard} />
    </div>
  )
}

export default DailyChallenge
