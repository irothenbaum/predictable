import MultiPanelInstructionalPrompt from './MultiPanelInstructionalPrompt'
import {InstructionalTipProps} from '../../../lib/constants'
import Icon, {PLAY} from '../../utility/Icon'

function AvoidingObstacles(props) {
  const renderStep = s => {
    switch (s) {
      case 0:
        return (
          <div>
            <h1>Uh oh!</h1>
            <p>There's an obstacle between you and your goal</p>
          </div>
        )

      case 1:
        return (
          <div>
            <p>
              See if you can queue up the correct moves to get around the
              obstacle
            </p>
          </div>
        )

      case 2:
        return (
          <div>
            <p>
              Once you've queued up your moves, remember to hit Play to execute
              them.
            </p>
            <div className="icon-wrapper">
              <Icon icon={PLAY} className="green-play" />
            </div>
          </div>
        )

      default:
        return <div>Missing step</div>
    }
  }

  return (
    <MultiPanelInstructionalPrompt
      onComplete={props.onComplete}
      totalSteps={3}
      renderStep={renderStep}
    />
  )
}

AvoidingObstacles.propTypes = InstructionalTipProps

export default AvoidingObstacles
