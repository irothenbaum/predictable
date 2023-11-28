import React from 'react'
import './World.scss'
import PropTypes from 'prop-types'
import {constructClassString, getCoordinateKey} from '../../lib/utilities'
import {BOARD_SIZE} from '../../lib/constants'

// --------------------------------------------------------------------------------

function Square(props) {
  return (
    <div
      className={constructClassString('world-square', {
        black: props.isBlack,
        bounce: props.bounce,
      })}
      style={props.style}></div>
  )
}

Square.propTypes = {
  isBlack: PropTypes.bool,
  bounce: PropTypes.bool,
  style: PropTypes.object,
}

// --------------------------------------------------------------------------------

function World(props) {
  // by dividing width by number of pieces we determine the percentage width/height of each square to the board
  const relativeWidthRatio = Math.round(10000 / props.dimensionX) / 100
  const relativeHeightRatio = Math.round(10000 / props.dimensionY) / 100
  const relativeWidthPercentage = `${relativeWidthRatio}%`
  const relativeHeightPercentage = `${relativeHeightRatio}%`

  return (
    <div
      className={constructClassString('world', props.className)}
      ref={r => {
        if (r && r.clientHeight > 0) {
          props.onRenderWorld({height: r.clientHeight})
        }
      }}>
      <div>
        {Array(props.dimensionY)
          .fill(null)
          .map((_, row) => {
            return (
              <div key={`${row}-row`} className="world-row">
                {Array(props.dimensionX)
                  .fill(null)
                  .map((_, column) => {
                    const squareKey = getCoordinateKey({row, column})
                    return (
                      <Square
                        key={`${squareKey}-square`}
                        isBlack={(row + column) % 2 === 1}
                        style={{paddingTop: relativeWidthPercentage}} // we want the square to be a square by setting paddingTop to the same as width
                      />
                    )
                  })}
              </div>
            )
          })}
      </div>
      <div className="world-pieces-container">
        {props.pieces.map(piece => {
          return (
            <div
              className="world-piece-container"
              key={piece.id}
              style={{
                top: `${relativeHeightRatio * piece.position.row}%`,
                left: `${relativeWidthRatio * piece.position.column}%`,
                width: relativeWidthPercentage,
                height: relativeHeightPercentage,
              }}>
              {props.renderPiece(piece)}
            </div>
          )
        })}
      </div>
    </div>
  )
}

World.propTypes = {
  renderPiece: PropTypes.func.isRequired,
  dimensionX: PropTypes.number,
  dimensionY: PropTypes.number,
  pieces: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      position: PropTypes.shape({
        row: PropTypes.number.isRequired,
        column: PropTypes.number.isRequired,
      }).isRequired,
    }),
  ),
  onRenderWorld: PropTypes.func,
  onClickSquare: PropTypes.func,
  onPlacePiece: PropTypes.func,
  onHoverSquare: PropTypes.func,
}

World.defaultProps = {
  dimension: BOARD_SIZE,
  pieces: [],
}

export default World
