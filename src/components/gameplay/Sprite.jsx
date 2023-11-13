import {constructClassString} from '../../lib/utilities'
import PropTypes from 'prop-types'
import './Sprite.scss'

import player from '../../../public/images/player.svg'

export const PLAYER = 'player'

const typeToImageMap = {
  [PLAYER]: player,
}

function Sprite(props) {
  const Image = typeToImageMap[props.type]

  return (
    <div className={constructClassString('sprite', props.type)}>
      <img src={Image} />
    </div>
  )
}

Sprite.propTypes = {
  type: PropTypes.string.isRequired,
}

export default Sprite
