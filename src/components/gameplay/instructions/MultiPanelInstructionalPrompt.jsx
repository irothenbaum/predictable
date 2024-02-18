import React, {useCallback, useRef, useState} from 'react'
import './MultiPanelInstructionalPrompt.scss'
import InstructionalPrompt from './InstructionalPrompt'
import Button, {
  VARIANT_DESTRUCTIVE,
  VARIANT_PRIMARY,
  VARIANT_SECONDARY,
  VARIANT_TERTIARY,
} from '../../utility/Button'
import PropTypes from 'prop-types'
import useDoOnceTimer from '../../../hooks/useDoOnceTimer'
import {constructClassString} from '../../../lib/utilities'
import ButtonListSelector from '../../utility/ButtonListSelector'

const NEXT_PANEL_TIMER = 'next-panel-timer'
const NEXT_PANEL_DELAY = 400

function MultiPanelInstructionalPrompt(props) {
  const [step, setStep] = useState(0)
  const containerRef = useRef(null)
  const [containerHeight, setContainerHeight] = useState(0)
  const {setTimer, isTimerSet} = useDoOnceTimer()

  /**
   * @param {number} dif
   */
  const adjustStep = dif => {
    setContainerHeight(containerRef.current.offsetHeight)
    setTimer(
      NEXT_PANEL_TIMER,
      () => {
        setContainerHeight(0)
        setStep(step + dif)
      },
      NEXT_PANEL_DELAY,
    )
  }

  const handleNext = () => {
    if (step === props.totalSteps - 1) {
      props.onComplete()
    } else {
      adjustStep(1)
    }
  }

  const handleBack = () => {
    if (step === 0) {
      props.onComplete()
    } else {
      adjustStep(-1)
    }
  }

  const showBackButton = step > 0
  const showNextButton = step < props.totalSteps - 1
  const isTransitioning = isTimerSet(NEXT_PANEL_TIMER)

  return (
    <InstructionalPrompt>
      <div
        className={constructClassString(
          'multi-panel-instructional-prompt',
          props.className,
          {
            transitioning: isTransitioning,
          },
        )}
        ref={containerRef}
        style={{height: containerHeight || 'auto'}}>
        <div className="step-counter">
          {[...new Array(props.totalSteps)].map((_, i) => (
            <span
              key={i}
              className={constructClassString({selected: step === i})}
              onClick={() => adjustStep(i - step)}
            />
          ))}
        </div>
        <div className="panel-content">{props.renderStep(step)}</div>
        <div className="controls-container">
          <ButtonListSelector
            buttons={[
              <Button
                immediate={showBackButton}
                variant={
                  showBackButton ? VARIANT_TERTIARY : VARIANT_DESTRUCTIVE
                }
                onClick={handleBack}>
                {showBackButton ? 'Back' : 'Skip'}
              </Button>,
              <Button
                immediate={showNextButton}
                variant={showNextButton ? VARIANT_PRIMARY : VARIANT_SECONDARY}
                onClick={handleNext}>
                {showNextButton ? 'Next' : 'Continue'}
              </Button>,
            ]}
            default={1}
          />
        </div>
      </div>
    </InstructionalPrompt>
  )
}

MultiPanelInstructionalPrompt.propTypes = {
  renderStep: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
  totalSteps: PropTypes.number.isRequired,
}

export default MultiPanelInstructionalPrompt
