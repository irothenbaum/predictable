import React, {useState} from 'react'
import './LevelResults.scss'
import Modal from '../utility/Modal'
import ButtonListSelector from '../utility/ButtonListSelector'
import Button, {VARIANT_SECONDARY} from '../utility/Button'

function LevelResults(props) {
  const [quip] = useState(quips[Math.floor(Math.random() * quips.length)])

  return (
    <Modal isOpen={true}>
      <div className="daily-level-results">
        <h2>{quip}</h2>
        <div className={'controls'}>
          <ButtonListSelector
            buttons={[
              <Button variant={VARIANT_SECONDARY} onClick={props.onReturn}>
                Back
              </Button>,
              <Button onClick={props.onShare}>Share Results</Button>,
            ]}
            default={1}
          />
        </div>
      </div>
    </Modal>
  )
}

const quips = [
  'You did it!',
  'Great job!',
  'Victory!',
  'Freedom!',
  'Success!',
  'Well done!',
  'You win!',
  'Easy!',
  'Nice!',
]
function getRandomVictoryQuip() {}

export default LevelResults
