import React, {useContext} from 'react'
import './Menu.scss'
import Button from '../utility/Button'
import SettingsContext from '../../contexts/SettingsContext'
import {SCENE_CAMPAIGN, SCENE_DAILY, SCENE_SETTINGS} from '../../lib/constants'
import ButtonListSelector from '../utility/ButtonListSelector'

function Menu(props) {
  const {goToScene} = useContext(SettingsContext)

  return (
    <div className="menu">
      <div className="hero"></div>
      <div className="controls">
        <ButtonListSelector
          default={0}
          buttons={[
            <Button onClick={() => goToScene(SCENE_CAMPAIGN)}>Campaign</Button>,
            <Button onClick={() => goToScene(SCENE_DAILY)}>
              Daily Challenge
            </Button>,
            <Button onClick={() => goToScene(SCENE_SETTINGS)}>Settings</Button>,
          ]}
        />
      </div>
    </div>
  )
}

export default Menu
