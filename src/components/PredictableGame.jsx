import React, {useContext, useState} from 'react'
import './PredictableGame.scss'
import PropTypes from 'prop-types'
import LevelGroupBuilder from './builder/LevelGroupBuilder'
import Campaign from './campaign/Campaign'
import SettingsContext, {HydratedSettings} from '../contexts/SettingsContext'
import {
  SCENE_MENU,
  SCENE_INTRO,
  SCENE_SETTINGS,
  SCENE_CAMPAIGN,
  SCENE_DAILY,
  SCENE_BUILDER,
} from '../lib/constants'
import Menu from './menus/MainMenu'
import Intro from './menus/Intro'
import DailyChallenge from './daily/DailyChallenge'

const SceneMap = {
  [SCENE_MENU]: Menu,
  [SCENE_INTRO]: Intro,
  // [SCENE_SETTINGS]: Settings,
  [SCENE_CAMPAIGN]: Campaign,
  [SCENE_DAILY]: DailyChallenge,
  [SCENE_BUILDER]: LevelGroupBuilder,
}

function PredictableGame(props) {
  const [scene, setScene] = useState(SCENE_BUILDER)

  const Scene = SceneMap[scene]

  return (
    <SettingsContext.Provider
      value={{
        scene,
        goToScene: setScene,

        hasReadRules: HydratedSettings.hasReadRules,
      }}>
      {Scene && <Scene />}
    </SettingsContext.Provider>
  )
}

PredictableGame.propTypes = {
  onSave: PropTypes.func,
}

export default PredictableGame
