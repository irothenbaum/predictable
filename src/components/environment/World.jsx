import React, {useEffect} from 'react'
import './World.scss'
import PropTypes from 'prop-types'
import {
  constructClassString,
  convertRemToPixels,
  getCoordinateKey,
} from '../../lib/utilities'
import {squareSizeRemScale} from '../../lib/constants'

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

  useEffect(() => {
    props.onRenderWorld({
      height: convertRemToPixels(props.dimensionY * squareSizeRemScale),
      width: convertRemToPixels(props.dimensionX * squareSizeRemScale),
    })
  }, [props.dimensionX, props.dimensionY])

  if (!props.dimensionX || !props.dimensionY) {
    return null
  }

  return (
    <div
      className={constructClassString('world', props.className)}
      style={{
        width: `${props.dimensionX * squareSizeRemScale}rem`,
        height: `${props.dimensionY * squareSizeRemScale}rem`,
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
  dimension: 0,
  pieces: [],
}

export default World
