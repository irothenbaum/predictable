import React, {useEffect} from 'react'
import './LevelGroupResults.scss'
import PropTypes from 'prop-types'
import Button, {VARIANT_SECONDARY} from '../utility/Button'
import useReadyTimer from '../../hooks/useReadyTimer'
import {constructClassString} from '../../lib/utilities'
import Modal from '../utility/Modal'

const APPEAR_DELAY = 1000

/**
 * @param {{solutions: Array<Solution>}} props
 * @return {Element}
 * @constructor
 */
function LevelGroupResults({solution, onContinue}) {
  const {isReady} = useReadyTimer(APPEAR_DELAY)
  if (!solution) {
    return null
  }

  return (
    <Modal isOpen={isReady} className={'level-group-results'}>
      <h3>Score: {solution.score}</h3>

      <Button variant={VARIANT_SECONDARY} onClick={onContinue}>
        Continue
      </Button>
    </Modal>
  )
}

LevelGroupResults.propTypes = {
  solutions: PropTypes.arrayOf(
    PropTypes.shape({
      moves: PropTypes.arrayOf(
        PropTypes.shape({
          row: PropTypes.number,
          column: PropTypes.number,
        }),
      ).isRequired,
      score: PropTypes.number,
    }),
  ).isRequired,
  onContinue: PropTypes.func,
}

export default LevelGroupResults
