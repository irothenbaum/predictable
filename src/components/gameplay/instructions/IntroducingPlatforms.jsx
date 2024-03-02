import MultiPanelInstructionalPrompt from './MultiPanelInstructionalPrompt'
import {InstructionalTipProps} from '../../../lib/constants'
import Platform from '../../environment/Platform'

function IntroducingPlatforms(props) {
  const renderStep = s => {
    switch (s) {
      case 0:
        return (
          <div>
            <h1>Platforms</h1>
            <p>
              This is a platform, you can ride it over obstacles and hazards.
            </p>
            <div className="icon-wrapper">
              <Platform piece={{velocity: {columnChange: 1}}} />
            </div>
          </div>
        )

      case 1:
        return (
          <div>
            <p>
              The larger the number on the platform, the further it will move
              each turn.
            </p>
            <div className="icon-wrapper">
              <Platform piece={{velocity: {rowChange: 3}}} />
            </div>
          </div>
        )

      case 2:
        return (
          <div>
            <p>
              Be careful though, If you stay on too long, you'll fall off the
              edge of the map!
            </p>
            <div className="icon-wrapper">
              <Platform piece={{velocity: {rowChange: 3}}} />
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

IntroducingPlatforms.propTypes = InstructionalTipProps

export default IntroducingPlatforms
