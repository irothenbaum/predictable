import React, {useEffect} from 'react'
import './SolutionResults.scss'
import PropTypes from 'prop-types'
import Button, {VARIANT_SECONDARY} from '../utility/Button'
import useReadyTimer from '../../hooks/useReadyTimer'
import {constructClassString} from '../../lib/utilities'

const APPEAR_DELAY = 1000

/**
 * @param {{solution: Solution}} props
 * @return {Element}
 * @constructor
 */
function SolutionResults({solution, onContinue}) {
  const {isReady} = useReadyTimer(APPEAR_DELAY)
  if (!solution) {
    return null
  }

  return (
    <div className={constructClassString('solution-results', {ready: isReady})}>
      <div className="container">
        <h3>Score: {solution.score}</h3>

        <Button variant={VARIANT_SECONDARY} onClick={onContinue}>
          Continue
        </Button>
      </div>
    </div>
  )
}

SolutionResults.propTypes = {
  solution: PropTypes.shape({
    score: PropTypes.number,
  }).isRequired,
  onContinue: PropTypes.func,
}

export default SolutionResults
