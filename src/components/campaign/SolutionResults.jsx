import React from 'react'
import './SolutionResults.scss'
import PropTypes from 'prop-types'
import Button, {VARIANT_SECONDARY} from '../utility/Button'

/**
 * @param {{solution: Solution}} props
 * @return {Element}
 * @constructor
 */
function SolutionResults({solution, onContinue}) {
  if (!solution) {
    return null
  }

  return (
    <div className="solution-results">
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
