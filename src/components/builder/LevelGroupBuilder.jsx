import React, {useState} from 'react'
import './LevelGroupBuilder.scss'
import Modal from '../utility/Modal'
import Button, {VARIANT_SECONDARY} from '../utility/Button'
import {v4 as uuid} from 'uuid'
import LevelBuilder from './LevelBuilder'
import Icon, {CHEVRON_RIGHT, CHEVRON_LEFT} from '../utility/Icon'

function LevelGroupBuilder(props) {
  const [levelNum, setLevelNum] = useState(0)
  const [levels, setLevels] = useState([])
  const [showBuildModal, setShowBuildModal] = useState(false)
  const [showLoadModal, setShowLoadModal] = useState(false)
  const [loadText, setLoadText] = useState('')

  const handleLoadLevelGroup = () => {
    /** @type {LevelGroupDefinition} level  */
    const levelGroup = JSON.parse(loadText)
    setLevels(levelGroup.subLevels || [])
    setLevelNum(0)

    setShowLoadModal(false)
  }

  /**
   * @param {LevelDefinition} levelData
   */
  const handleSaveLevel = levelData => {
    const nextLevels = [...levels]
    nextLevels[levelNum] = levelData
    setLevels(nextLevels)
  }

  /**
   * @param {number} change
   */
  const changeLevelNum = change => {
    setLevelNum(Math.max(0, Math.min(levels.length, levelNum + change)))
  }

  return (
    <div className="level-group-builder">
      <div className="top-header">
        <Button
          variant={VARIANT_SECONDARY}
          onClick={() => setShowLoadModal(true)}>
          Load
        </Button>

        <div className="level-selector">
          <Icon icon={CHEVRON_LEFT} onClick={() => changeLevelNum(-1)} />
          <p>
            Level {levelNum + 1} / {levels.length}
          </p>
          <Icon icon={CHEVRON_RIGHT} onClick={() => changeLevelNum(1)} />
        </div>
        <Button onClick={() => setShowBuildModal(true)}>Build</Button>
      </div>

      <LevelBuilder
        levelDefinition={levels[levelNum]}
        onSave={handleSaveLevel}
      />

      <Modal onClose={() => setShowBuildModal(false)} isOpen={showBuildModal}>
        <h3>Level Code</h3>
        <textarea
          style={{
            marginTop: '1rem',
            height: '10rem',
            width: '20rem',
          }}
          value={showBuildModal ? createLevelGroupJSON(levels) : ''}
          onChange={() => {}}></textarea>
      </Modal>

      <Modal onClose={() => setShowLoadModal(false)} isOpen={showLoadModal}>
        <h3>Level Code</h3>
        <textarea
          style={{
            marginTop: '1rem',
            height: '10rem',
            width: '20rem',
          }}
          value={loadText}
          onChange={e => setLoadText(e.target.value)}>
          Enter level JSON here
        </textarea>
        <Button onClick={handleLoadLevelGroup} variant={VARIANT_SECONDARY}>
          Load level
        </Button>
      </Modal>
    </div>
  )
}

export default LevelGroupBuilder

/**
 * @param {Array<LevelDefinition>} levels
 * @returns {string}
 */
function createLevelGroupJSON(levels) {
  return JSON.stringify({
    subLevels: levels,
  })
}
