import MultiPanelInstructionalPrompt from './MultiPanelInstructionalPrompt'
import {InstructionalTipProps} from '../../../lib/constants'
import Icon, {ARROW_UP, PLAY} from '../../utility/Icon'
import './TutorialTip.scss'

function TutorialTip(props) {
  const renderStep = s => {
    switch (s) {
      case 0:
        return (
          <div>
            <p>Lesson 1</p>
            <h1>Moving</h1>
          </div>
        )

      case 1:
        return (
          <div>
            <p>Click the up-arrow key twice to enqueue two upward movements.</p>
            <div className="icon-wrapper">
              <Icon icon={ARROW_UP} />
            </div>
          </div>
        )

      case 2:
        return (
          <div>
            <p>Then click play to execute your move sequence.</p>
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
      className={'tutorial-tip'}
    />
  )
}

TutorialTip.propTypes = InstructionalTipProps

export default TutorialTip
