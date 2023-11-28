import React, {memo, useCallback, useEffect, useRef, useState} from 'react'
import './World.scss'
import PropTypes from 'prop-types'
import useDoOnceTimer from '../../hooks/useDoOnceTimer'
import {
  constructClassString,
  getCoordinateKey,
  isSameSquare,
} from '../../lib/utilities'
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
  const [interactedSquares, setInteractedSquares] = useState({})
  const {setTimer, cancelAllTimers} = useDoOnceTimer()

  /**
   * @param {Coordinate} square
   */
  function animateSquare(square) {
    const squareKey = getCoordinateKey(square)
    setInteractedSquares(iS => ({...iS, [squareKey]: true}))
    setTimer(
      `animate-${squareKey}`,
      () => {
        setInteractedSquares(iS => {
          const copy = {...iS}
          delete copy[squareKey]
          return copy
        })
      },
      500,
    )
  }

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
                        bounce={interactedSquares[squareKey]}
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
          const squareKey = getCoordinateKey(piece.position)
          return (
            <div
              className={constructClassString('world-piece-container', {
                bounce: interactedSquares[squareKey],
              })}
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

      {/*<BoardEventListener*/}
      {/*  horizontalSquareCount={props.dimensionX}*/}
      {/*  onClickSquare={handleClickSquare}*/}
      {/*  onHoverSquare={handleHoverSquare}*/}
      {/*/>*/}
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

// --------------------------------------------------------------------------------

const BoardEventListener = memo(props => {
  const squareSize = useRef(0)
  const boardRef = useRef(null)
  const lastHoveredSquare = useRef(null)

  const handlePress = e => {
    const thisSquare = getSquarePosition(e, squareSize.current)
    if (typeof props.onClickSquare === 'function') {
      props.onClickSquare(thisSquare)
    }
  }

  const handleMove = e => {
    const thisSquare = getSquarePosition(e, squareSize.current)
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

  useEffect(() => {
    if (!boardRef.current) {
      return
    }

    const resizeObserver = new ResizeObserver(() => {
      squareSize.current =
        boardRef.current.clientWidth / props.horizontalSquareCount
    })
    resizeObserver.observe(boardRef.current)

    return () => resizeObserver.disconnect()
  }, [props.horizontalSquareCount])

  return (
    <div
      className="world-click-listener"
      onClick={handlePress}
      onMouseMove={handleMove}
      ref={boardRef}
    />
  )
})

BoardEventListener.propTypes = {
  onClickSquare: PropTypes.func,
  onHoverSquare: PropTypes.func,
  horizontalSquareCount: PropTypes.number,
}

// --------------------------------------------------------------------------------
// UTILITY FUNCTIONS

/**
 * @param {*} e
 * @return {{x: number, y: number}}
 */
function getRelativePosition(e) {
  return {
    x: e.nativeEvent.offsetX,
    y: e.nativeEvent.offsetY,
  }
}

/**
 * @param {*} e
 * @param {number} squareSize
 * @return {Coordinate}
 */
function getSquarePosition(e, squareSize) {
  const {x, y} = getRelativePosition(e)
  return {
    row: Math.floor(y / squareSize),
    column: Math.floor(x / squareSize),
  }
}
