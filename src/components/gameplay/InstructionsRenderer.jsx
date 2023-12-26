import React, {useContext, useEffect, useState} from 'react'
import LevelContext from '../../contexts/LevelContext'
import PropTypes from 'prop-types'
import {InstructionalShape, INSTRUCTION_WELCOME} from '../../lib/constants'
import useDoOnceTimer from '../../hooks/useDoOnceTimer'
import WelcomeTip from './instructions/WelcomeTip'
import {isSameSquare} from '../../lib/utilities'

const InstructionMap = {
  [INSTRUCTION_WELCOME]: WelcomeTip,
}
const INSTRUCTION_TIMER = 'instruction-timer'

function InstructionsRenderer(props) {
  const {revealingMoveIndex, playerPiece} = useContext(LevelContext)
  const {setTimer} = useDoOnceTimer()
  const [showingInstructionKey, setShowingInstructionKey] = useState(null)

  useEffect(() => {
    // this is kind of like a use effect as instructions should only ever change on new level start
    // TODO: This only really works with 1 triggerDelayMS right now because
    //  the timer would need to pause when the game time is paused (i.e., when showing instructions)
    if (props.instructions && props.instructions.length) {
      props.instructions
        .filter(i => typeof i.triggerDelayMS === 'number')
        .forEach(i => {
          setTimer(
            INSTRUCTION_TIMER,
            () => setShowingInstructionKey(i.instructionKey),
            i.triggerDelayMS,
          )
        })
    }
  }, [props.instructions])

  useEffect(() => {
    // whenever the move changes, we check both triggerDelayMoveIndex and triggerPosition instructions
    // to see if we should show an instruction on this turn
    if (props.instructions && props.instructions.length) {
      // first try and find an instruction that is triggered by the current move
      const readyToTriggerByMove = props.instructions.find(
        i =>
          typeof i.triggerDelayMoveIndex === 'number' &&
          i.triggerDelayMoveIndex === revealingMoveIndex,
      )

      if (readyToTriggerByMove) {
        setShowingInstructionKey(readyToTriggerByMove.instructionKey)
      } else if (playerPiece) {
        // if we didn't find one, try and find one that is triggered by the player's position
        const readyToTriggerByPosition = props.instructions.find(
          i =>
            i.triggerPosition &&
            isSameSquare(i.triggerPosition, playerPiece.position),
        )

        if (readyToTriggerByPosition) {
          setShowingInstructionKey(readyToTriggerByPosition.instructionKey)
        }
      }
    }
  }, [revealingMoveIndex])

  const Comp = InstructionMap[showingInstructionKey]

  return Comp ? (
    <Comp onComplete={() => setShowingInstructionKey(null)} />
  ) : null
}

InstructionsRenderer.propTypes = {
  instructions: PropTypes.arrayOf(InstructionalShape),
}

export default InstructionsRenderer
