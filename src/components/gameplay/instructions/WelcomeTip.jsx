import MultiPanelInstructionalPrompt from './MultiPanelInstructionalPrompt'
import PropTypes from 'prop-types'

function WelcomeTip(props) {
  const renderStep = s => {
    switch (s) {
      case 0:
        return (
          <div>
            <h1>Welcome to the game!</h1>
            <p>Here's how to play:</p>
          </div>
        )

      case 1:
        return (
          <div>
            <h1>Step 2!</h1>
            <p>More content</p>
          </div>
        )

      case 2:
        return (
          <div>
            <h1>Step 3</h1>
            <p>again!</p>
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

WelcomeTip.propTypes = {
  onComplete: PropTypes.func.isRequired,
}

export default WelcomeTip
