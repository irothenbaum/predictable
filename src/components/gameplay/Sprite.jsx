import {constructClassString} from '../../lib/utilities'
import PropTypes from 'prop-types'
import './Sprite.scss'

import player from '../../../public/images/player.svg'

export const SPRITE_COLOR_PRIMARY = 'primary'
export const SPRITE_COLOR_SECONDARY = 'secondary'
export const SPRITE_COLOR_GREEN = 'green'
export const SPRITE_COLOR_RED = 'red'

export const PLAYER = 'player'

const typeToImageMap = {
  [PLAYER]: player,
}

function Sprite(props) {
  const Image = typeToImageMap[props.type]

  return (
    <div
      className={constructClassString('sprite', props.type, props.spriteColor)}>
      <img src={Image} />
    </div>
  )
}

Sprite.propTypes = {
  type: PropTypes.string.isRequired,
  spriteColor: PropTypes.string,
}

export default Sprite
