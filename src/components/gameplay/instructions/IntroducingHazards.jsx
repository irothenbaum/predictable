import MultiPanelInstructionalPrompt from './MultiPanelInstructionalPrompt'
import {InstructionalTipProps} from '../../../lib/constants'
import Icon, {ARROW_UP, CIRCLE, PLAY} from '../../utility/Icon'
import Hazard from '../../environment/Hazard'

function IntroducingHazards(props) {
  const renderStep = s => {
    switch (s) {
      case 0:
        return (
          <div>
            <h1>Hazards</h1>
            <p>
              Unlike obstacles, if you hit a hazard, you'll lose immediately.
            </p>
          </div>
        )

      case 1:
        return (
          <div>
            <p>
              This is what a hazard looks like. Be careful not to run into one!
            </p>
            <div className="icon-wrapper">
              <Hazard piece={{}} />
            </div>
          </div>
        )

      case 2:
        return (
          <div>
            <p>
              The <strong>1</strong> on this Hazard indicates it will move one
              square each turn. The arrow indicates the direction it will move.
            </p>
            <div className="icon-wrapper">
              <Hazard piece={{velocity: {columnChange: 1}}} />
            </div>
          </div>
        )

      case 3:
        return (
          <div>
            <p>
              To time this hazard, you may want to stay still for a turn or two.
              Clicking this key will keep you stationary for one turn.
            </p>
            <div className="icon-wrapper">
              <Icon icon={CIRCLE} />
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
      totalSteps={4}
      renderStep={renderStep}
    />
  )
}

IntroducingHazards.propTypes = InstructionalTipProps

export default IntroducingHazards
