import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import './LevelGallery.scss'
import Player from '../environment/Player'
import Scrollable from '../utility/Scrollable'
import CampaignContext from '../../contexts/CampaignContext'
import {constructClassString} from '../../lib/utilities'
import PropTypes from 'prop-types'
import {LevelsOrder} from '../../levels'
import useKeyListener from '../../hooks/useKeyListener'
import useDoOnceTimer from '../../hooks/useDoOnceTimer'

// we want 3 levels on the screen at a time so the world height is 1/3 * window height + a spacer on top and bottom
const RowHeight = window.innerHeight / 3
const WorldHeight = RowHeight * (LevelsOrder.length + 2)

const SELECT_TIMER = 'select-timer'
const SELECT_DELAY = 1000

function LevelGallery(props) {
  const {solutions, lastCompletedLevelNum} = useContext(CampaignContext)
  const [hoveredLevelNum, setHoveredLevelNum] = useState(lastCompletedLevelNum)
  const [containerHeight, setContainerHeight] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)
  const scrollPos = useRef({x: 0, y: WorldHeight - window.innerHeight})
  const {isTimerSet, setTimer} = useDoOnceTimer()

  useEffect(() => {
    setHoveredLevelNum(lastCompletedLevelNum)
  }, [lastCompletedLevelNum])

  const keyHandler = useCallback(
    key => {
      switch (key) {
        case 'ArrowUp':
          setHoveredLevelNum(h =>
            Math.max(0, Math.min(h + 1, lastCompletedLevelNum + 1)),
          )
          break
        case 'ArrowDown':
          setHoveredLevelNum(h =>
            Math.max(0, Math.min(h - 1, lastCompletedLevelNum)),
          )
          break

        case 'Enter':
          setTimer(
            SELECT_TIMER,
            () => {
              props.onSelectLevel(LevelsOrder[hoveredLevelNum])
            },
            SELECT_DELAY,
          )
          break
      }
    },
    [hoveredLevelNum, lastCompletedLevelNum],
  )
  useKeyListener(keyHandler)

  const hasSelected = isTimerSet(SELECT_TIMER)

  return (
    <div
      className="level-gallery"
      ref={r => {
        if (r) {
          if (r.clientHeight > 0) {
            setContainerHeight(r.clientHeight)
          }
          if (r.clientWidth > 0) {
            setContainerWidth(r.clientWidth)
          }
        }
      }}>
      <Scrollable
        hideMiniMap={true}
        scrollPos={scrollPos.current}
        height={WorldHeight}
        width={window.innerWidth}
        viewHeight={containerHeight}
        viewWidth={containerWidth}>
        <div className="level-gallery-world">
          <div className="level-row">TOP SPACER</div>
          {LevelsOrder.map((levelKey, index) => {
            return (
              <div className="level-row" key={levelKey}>
                <LevelNode
                  isHovered={index === hoveredLevelNum && !hasSelected}
                  isActive={index === hoveredLevelNum && hasSelected}
                  isLocked={index > lastCompletedLevelNum + 1}
                  isCompleted={index <= lastCompletedLevelNum}
                />
              </div>
            )
          }).reverse()}
          <div className="level-row">BOTTOM SPACER</div>
          <div
            className="player-container level-row"
            style={{
              bottom: RowHeight * (hoveredLevelNum + 1),
            }}>
            <Player />
          </div>
        </div>
      </Scrollable>
    </div>
  )
}

LevelGallery.propTypes = {
  onSelectLevel: PropTypes.func,
}

export default LevelGallery

// --------------------------------------------------------

function LevelNode(props) {
  return (
    <div
      className={constructClassString('level-node', {
        available: !props.isLocked && !props.isCompleted,
        locked: props.isLocked,
        completed: props.isCompleted,
        hovered: props.isHovered,
        selected: props.isActive,
      })}></div>
  )
}

LevelNode.propTypes = {
  isHovered: PropTypes.bool,
  isActive: PropTypes.bool,
  isLocked: PropTypes.bool,
  isCompleted: PropTypes.bool,
}
