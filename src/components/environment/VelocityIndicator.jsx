import React from 'react'
import './VelocityIndicator.scss'
import Icon, {CHEVRON_LEFT, CHEVRON_RIGHT} from '../utility/Icon'
import PropTypes from 'prop-types'
import IconWithShadow from '../utility/IconWithShadow'

function VelocityIndicator(props) {
  if (!props.velocity || props.velocity.columnChange === 0) {
    return
  }

  const icon = props.velocity.columnChange > 0 ? CHEVRON_RIGHT : CHEVRON_LEFT

  return (
    <div className="velocity-indicator">
      {props.velocity.columnChange < 0 ? <IconWithShadow icon={icon} /> : null}
      <span className="magnitude">{Math.abs(props.velocity.columnChange)}</span>
      {props.velocity.columnChange > 0 ? <IconWithShadow icon={icon} /> : null}
    </div>
  )
}

VelocityIndicator.propTypes = {
  velocity: PropTypes.shape({
    rowChange: PropTypes.number,
    columnChange: PropTypes.number,
  }),
}

export default VelocityIndicator
