import React, {useState} from 'react'
import './MainMenu.scss'
import Button from '../utility/Button'
import {
  SCENE_CAMPAIGN,
  SCENE_DAILY,
  SCENE_SETTINGS,
  SCENE_BONUS_CHALLENGE,
  YESTERDAY_SEED,
  DAILY_SEED,
  getGameSeedFromDailySeedAndScene,
  TUTORIAL_PUZZLE_KEY,
} from '../../lib/constants'
import ButtonListSelector from '../utility/ButtonListSelector'
import BackgroundHero from './BackgroundHero'
import {constructClassString} from '../../lib/utilities'
import useSettingsContext from '../../hooks/useSettingsContext'

const yesterdaysDailySeed = getGameSeedFromDailySeedAndScene(
  YESTERDAY_SEED,
  SCENE_DAILY,
)
const todaysDailySeed = getGameSeedFromDailySeedAndScene(
  DAILY_SEED,
  SCENE_DAILY,
)

function MainMenu(props) {
  const {goToScene, solvedPuzzles, markSolvedPuzzle} = useSettingsContext()

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
              default={solvedPuzzles[TUTORIAL_PUZZLE_KEY] ? 1 : 0}
              buttons={[
                <Button onClick={() => goToScene(SCENE_CAMPAIGN)}>
                  Tutorial
                </Button>,
                <Button onClick={() => goToScene(SCENE_DAILY)}>
                  Daily Challenge
                </Button>,
                <Button
                  disabled={
                    !solvedPuzzles[yesterdaysDailySeed] ||
                    !solvedPuzzles[todaysDailySeed]
                  }
                  onClick={() => goToScene(SCENE_BONUS_CHALLENGE)}>
                  Bonus Challenge
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
