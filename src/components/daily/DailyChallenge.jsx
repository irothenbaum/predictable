import React, {useEffect, useRef, useState} from 'react'

import useSettingsContext from '../../hooks/useSettingsContext'
import {
  DAILY_SEED,
  getGameSeedFromDailySeedAndScene,
  SCENE_DAILY,
} from '../../lib/constants'
import GenericDailyChallenge from './GenericDailyChellenge'

const gameSeed = getGameSeedFromDailySeedAndScene(DAILY_SEED, SCENE_DAILY)
const gameBoard = {width: 5, height: 8}

function DailyChallenge(props) {
  const {goToScene} = useSettingsContext()

  return (
    <div className="daily-challenge">
      <GenericDailyChallenge seed={gameSeed} gameBoard={gameBoard} />
    </div>
  )
}

export default DailyChallenge
