import React, {memo, useCallback, useEffect, useRef} from 'react'
import './World.scss'
import PropTypes from 'prop-types'
import {
  constructClassString,
  convertRemToPixels,
  getCoordinateKey,
  isSameSquare,
} from '../../lib/utilities'
import {PiecePropType, squareSizeRemScale} from '../../lib/constants'

// --------------------------------------------------------------------------------

function Square(props) {
  return (
    <div
      className={constructClassString('world-square', {
        black: props.isBlack,
        bounce: props.bounce,
      })}
      style={props.style}>
      {props.children}
    </div>
  )
}

Square.propTypes = {
  isBlack: PropTypes.bool,
  bounce: PropTypes.bool,
  style: PropTypes.object,
}

// --------------------------------------------------------------------------------

function World(props) {
  useEffect(() => {
    props.onRenderWorld({
      height: convertRemToPixels(props.dimensionY * squareSizeRemScale),
      width: convertRemToPixels(props.dimensionX * squareSizeRemScale),
    })
  }, [props.dimensionX, props.dimensionY])

  const handleClickSquare = useCallback(
    square => {
      if (typeof props.onClickSquare === 'function') {
        props.onClickSquare(square)
      }
    },
    [props.onClickSquare],
  )

  const handleHoverSquare = useCallback(
    square => {
      if (typeof props.onHoverSquare === 'function') {
        props.onHoverSquare(square)
      }
    },
    [props.onHoverSquare],
  )

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
                        isBlack={(row + column) % 2 === 1}>
                        {(column === 0 || column === props.dimensionX - 1) && (
                          <div className="out-of-bounds-overlay" />
                        )}
                      </Square>
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
              className={constructClassString('world-piece-container', {
                _warped: piece.position._warped,
                [`velocity-${Math.abs(piece.velocity?.columnChange || 0)}`]:
                  piece.velocity,
              })}
              key={piece.id}
              style={{
                top: `${piece.position.row * squareSizeRemScale}rem`,
                left: `${piece.position.column * squareSizeRemScale}rem`,
              }}>
              {props.renderPiece(piece)}
            </div>
          )
        })}
      </div>

      <WorldEventListener
        onClickSquare={handleClickSquare}
        onHoverSquare={handleHoverSquare}
      />
    </div>
  )
}

World.propTypes = {
  renderPiece: PropTypes.func.isRequired,
  dimensionX: PropTypes.number,
  dimensionY: PropTypes.number,
  pieces: PropTypes.arrayOf(PiecePropType.piece),
  onRenderWorld: PropTypes.func,
  onClickSquare: PropTypes.func,
  onHoverSquare: PropTypes.func,
}

World.defaultProps = {
  dimension: 0,
  pieces: [],
}

export default World

// --------------------------------------------------------------------------------

const WorldEventListener = memo(props => {
  const boardRef = useRef(null)
  const lastHoveredSquare = useRef(null)

  const handlePress = e => {
    const thisSquare = getSquarePosition(e)
    if (typeof props.onClickSquare === 'function') {
      props.onClickSquare(thisSquare)
    }
  }

  const handleMove = e => {
    const thisSquare = getSquarePosition(e)
    if (
      !lastHoveredSquare.current ||
      !isSameSquare(lastHoveredSquare.current, thisSquare)
    ) {
      lastHoveredSquare.current = thisSquare
      if (typeof props.onHoverSquare === 'function') {
        props.onHoverSquare(lastHoveredSquare.current)
      }
    }
  }

  return (
    <div
      className="world-event-listener"
      onClick={handlePress}
      onMouseMove={handleMove}
      ref={boardRef}
    />
  )
})

WorldEventListener.propTypes = {
  onClickSquare: PropTypes.func,
  onHoverSquare: PropTypes.func,
}

/**
 * @param {*} e
 * @return {Coordinate}
 */
function getSquarePosition(e) {
  const squareSize = convertRemToPixels(squareSizeRemScale)
  const pos = {
    x: e.nativeEvent.offsetX,
    y: e.nativeEvent.offsetY,
  }
  return {
    row: Math.floor(pos.y / squareSize),
    column: Math.floor(pos.x / squareSize),
  }
}
