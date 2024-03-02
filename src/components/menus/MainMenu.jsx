import React, {useState} from 'react'
import './MainMenu.scss'
import Button from '../utility/Button'
import {SCENE_CAMPAIGN, SCENE_DAILY, SCENE_SETTINGS} from '../../lib/constants'
import ButtonListSelector from '../utility/ButtonListSelector'
import BackgroundHero from './BackgroundHero'
import {constructClassString} from '../../lib/utilities'
import useSettingsContext from '../../hooks/useSettingsContext'

function MainMenu(props) {
  const {goToScene} = useSettingsContext()
  const [isReady, setIsReady] = useState(false)

  return (
    <div className={constructClassString('main-menu', {hidden: !isReady})}>
      <div className="hero">
        <BackgroundHero onReady={() => setIsReady(true)} />
      </div>
      <div className="controls-container">
        <div className="controls">
          <div className="controls-inner">
            <h1>Predictable</h1>

            <ButtonListSelector
              default={0}
              buttons={[
                <Button onClick={() => goToScene(SCENE_CAMPAIGN)}>
                  Campaign
                </Button>,
                <Button onClick={() => goToScene(SCENE_DAILY)}>
                  Daily Challenge
                </Button>,
                <Button onClick={() => goToScene(SCENE_SETTINGS)}>
                  Settings
                </Button>,
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainMenu
