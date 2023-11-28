import React from 'react'
import './Icon.scss'
import PropTypes from 'prop-types'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
  faChevronLeft,
  faChevronRight,
  faSpinner,
  faCheck,
  faTimes,
  faChess,
  faChevronUp,
  faChevronDown,
  faPlay,
  faPause,
  faClockRotateLeft,
  faPencil,
  faGear,
  faStopwatch,
  faPlus,
  faHourglass,
  faHourglassStart,
  faHourglassEnd,
  faHourglassHalf,
  faClock,
  faVolleyball,
  faBasketball,
  faMedal,
  faHockeyPuck,
  faBaseball,
  faStopwatch20,
  faFutbol,
  faBowlingBall,
  faFootball,
  faChessPawn,
  faChessKnight,
  faRotateLeft,
  faShare,
  faChessQueen,
  faChessKing,
  faCircleInfo,
  faClipboard,
  faInfinity,
} from '@fortawesome/free-solid-svg-icons'
import {faCircle, faSquare} from '@fortawesome/free-regular-svg-icons'
import {constructClassString} from '../../lib/utilities'

export const CHEVRON_LEFT = faChevronLeft
export const CHEVRON_RIGHT = faChevronRight
export const CHEVRON_UP = faChevronUp
export const CHEVRON_DOWN = faChevronDown
export const SPINNER = faSpinner
export const CHECK = faCheck
export const CLOSE = faTimes
export const RESET = faRotateLeft
export const SETTINGS = faGear
export const CHESS = faChess
export const PAWN = faChessPawn
export const KNIGHT = faChessKnight
export const QUEEN = faChessQueen
export const SHARE = faShare
export const KING = faChessKing
export const INFO = faCircleInfo
export const INFINITY = faInfinity
export const CLIPBOARD = faClipboard

function Icon(props) {
  return (
    <span
      style={props.style}
      className={constructClassString(
        {
          'has-click-handler': typeof props.onClick === 'function',
          spin: props.icon === SPINNER,
        },
        props.className,
        'icon-container',
      )}
      onClick={props.onClick}>
      <FontAwesomeIcon icon={props.icon} />
    </span>
  )
}

Icon.propTypes = {
  icon: PropTypes.any.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
}

export default Icon
