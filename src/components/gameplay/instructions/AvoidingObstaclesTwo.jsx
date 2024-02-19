import MultiPanelInstructionalPrompt from './MultiPanelInstructionalPrompt'
import {InstructionalTipProps} from '../../../lib/constants'

function AvoidingObstaclesTwo(props) {
  const renderStep = s => {
    switch (s) {
      case 0:
        return (
          <div>
            <h1>Well Done!</h1>
            <p>
              Let's try a few more challenging ones just to be sure you got
              it...
            </p>
          </div>
        )

      default:
        return <div>Missing step</div>
    }
  }

  return (
    <MultiPanelInstructionalPrompt
      onComplete={props.onComplete}
      totalSteps={1}
      renderStep={renderStep}
    />
  )
}

AvoidingObstaclesTwo.propTypes = InstructionalTipProps

export default AvoidingObstaclesTwo
