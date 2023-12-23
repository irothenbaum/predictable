import React, {useCallback, useContext, useEffect, useState} from 'react'
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

const AUTO_ADVANCE_TIMER = 'auto-advance-timer'
const AUTO_ADVANCE_DELAY = 2000

function LevelGallery(props) {
  const {solutions, lastCompletedLevelNum} = useContext(CampaignContext)
  const [hoveredLevelNum, setHoveredLevelNum] = useState(lastCompletedLevelNum)
  const [containerHeight, setContainerHeight] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)
  const [scrollPos, setScrollPos] = useState({
    x: 0,
    y: WorldHeight - window.innerHeight,
  })
  const {isTimerSet, setTimer} = useDoOnceTimer()

  useEffect(() => {
    // start us off on the last completed level
    setHoveredLevelNum(lastCompletedLevelNum)

    // if another level is available, we auto advance to it after a delay
    if (lastCompletedLevelNum < LevelsOrder.length - 1) {
      setTimer(
        AUTO_ADVANCE_TIMER,
        () => {
          setHoveredLevelNum(hoveredLevelNum + 1)
        },
        AUTO_ADVANCE_DELAY,
      )
    }
  }, [lastCompletedLevelNum])

  // keep our player piece centered in the gallery
  useEffect(() => {
    setScrollPos({
      x: 0,
      y: WorldHeight - hoveredLevelNum * RowHeight - window.innerHeight,
    })
  }, [hoveredLevelNum])

  // --------------------------------------------------------
  // handle keyboard input
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
  // --------------------------------------------------------

  const hasSelected = isTimerSet(SELECT_TIMER)
  const effectiveLastCompletedNum =
    typeof props.transitionFromLevelNum === 'number'
      ? props.transitionFromLevelNum
      : lastCompletedLevelNum

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
        transitionDuration={`0.5s`}
        scrollPos={scrollPos}
        height={WorldHeight}
        width={window.innerWidth}
        viewHeight={containerHeight}
        viewWidth={containerWidth}>
        <div className="level-gallery-world">
          <div className="level-row"></div>
          {LevelsOrder.map((levelKey, index) => {
            return (
              <div className="level-row" key={levelKey}>
                <LevelNode
                  isHovered={index === hoveredLevelNum && !hasSelected}
                  isActive={index === hoveredLevelNum && hasSelected}
                  isLocked={index > effectiveLastCompletedNum + 1}
                  isCompleted={index <= effectiveLastCompletedNum}
                />
              </div>
            )
          }).reverse()}
          <div className="level-row"></div>
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
  transitionFromLevelNum: PropTypes.number,
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
      })}>
      <div></div>
    </div>
  )
}

LevelNode.propTypes = {
  isHovered: PropTypes.bool,
  isActive: PropTypes.bool,
  isLocked: PropTypes.bool,
  isCompleted: PropTypes.bool,
}
