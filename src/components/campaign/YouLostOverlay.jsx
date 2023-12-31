import React from 'react'
import './YouLostOverlay.scss'
import Modal from '../utility/Modal'
import PropTypes from 'prop-types'
import Button, {VARIANT_SECONDARY} from '../utility/Button'
import ButtonListSelector from '../utility/ButtonListSelector'

function YouLostOverlay(props) {
  return (
    <Modal isOpen={true}>
      <div className="you-lost-overlay">
        <h2>You Lost!</h2>
        <div className={'controls'}>
          <ButtonListSelector
            buttons={[
              <Button variant={VARIANT_SECONDARY} onClick={props.onReturn}>
                Back
              </Button>,
              <Button onClick={props.onPlayAgain}>Try again</Button>,
            ]}
            default={1}
          />
        </div>
      </div>
    </Modal>
  )
}

YouLostOverlay.propTypes = {
  onPlayAgain: PropTypes.func,
  onReturn: PropTypes.func,
}

export default YouLostOverlay
