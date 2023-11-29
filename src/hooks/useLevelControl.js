import {useState, useEffect, useContext} from 'react'
import {v4 as uuid} from 'uuid'
import useDoOnceTimer from './useDoOnceTimer'
import LevelContext from '../contexts/LevelContext'
import {isSameSquare} from '../lib/utilities'
import {PieceType} from '../lib/constants'

const MOVE_TIMER = 'timer'
const MOVE_DELAY = 1000

const OPPONENT_MOVE_TIMER = 'opponent-timer'
const OPPONENT_MOVE_DELAY = MOVE_DELAY / 2

/**
 * @param {{onWin: function, onLose: function}} options
 * @return {{playMoves: function, isShowingMoves: boolean, revealingMoveIndex: number|null}}
 */
function useLevelControl(options) {
  const {pieces, playerPiece, updatePieces, setPieces, moves, gameBoard} =
    useContext(LevelContext)

  const [isShowingMoves, setIsShowingMoves] = useState(false)
  const [revealingMoveIndex, setRevealingMoveIndex] = useState(null)
  const {setTimer, cancelTimer, cancelAllTimers} = useDoOnceTimer()

  const handleWin = () => {
    setIsShowingMoves(false)
    options.onWin()
  }

  const handleLose = () => {
    setIsShowingMoves(false)
    options.onLose()
  }

  // this use effect steps us through the move reveals to see if the player wins/loses
  useEffect(() => {
    if (typeof revealingMoveIndex !== 'number' || !playerPiece) {
      // do nothing, we're not actually revealing yet
      cancelTimer(MOVE_TIMER)
      cancelTimer(OPPONENT_MOVE_TIMER)
      return
    }

    // if we've revealed all moves, stop the timer and determine if we won or lost
    if (revealingMoveIndex === moves.length) {
      cancelTimer(MOVE_TIMER)
      cancelTimer(OPPONENT_MOVE_TIMER)
      const goalPiece = pieces.find(p => p.isGoal)
      if (goalPiece && isSameSquare(playerPiece.position, goalPiece.position)) {
        handleWin()
      } else {
        handleLose()
      }
      return
    }

    // determine where the next move square is
    /** @type {Velocity} */
    const nextMove = moves[revealingMoveIndex]
    const nextCoordinate = applyVelocityToCoordinate(
      playerPiece.position,
      nextMove,
      gameBoard,
    )
    const prevCoordinate = {...playerPiece.position}
    let piecesAfterPlayerMove = [...pieces]

    // if the player's next move lands them on a platform, we want to record that
    let playerOnPlatform

    // only perform the following check if the player is trying to move to a different square
    if (!isSameSquare(nextCoordinate, prevCoordinate)) {
      // find all pieces currently on that square
      const piecesOnThatSquare = pieces.filter(p =>
        isSameSquare(p.position, nextCoordinate),
      )

      if (piecesOnThatSquare.some(p => p.isObstacle)) {
        // cannot move to this square because there is an obstacle on it
      } else {
        playerPiece.position.row = nextCoordinate.row
        playerPiece.position.column = nextCoordinate.column

        // if we found a coin, we remove it from our pieces list
        const foundCoin = piecesOnThatSquare.find(
          p => p.isCoin && !p.isCollected,
        )
        if (foundCoin) {
          // TODO: apply the coin's value to the score
          foundCoin.isCollected = true
        }

        // check if the player is on a platform
        playerOnPlatform = piecesOnThatSquare.find(
          p => p.isPlatform && isSameSquare(p.position, playerPiece.position),
        )

        // remove any move-shadow that was on the square before
        piecesAfterPlayerMove = piecesAfterPlayerMove.filter(
          p => !(p.isMoveShadow && isSameSquare(p.position, prevCoordinate)),
        )

        // add a new move-shadow piece to the board
        piecesAfterPlayerMove.push({
          id: uuid(),
          type: PieceType.MoveShadow,
          position: {...prevCoordinate},
          velocity: {...nextMove},
          moveIndex: revealingMoveIndex,
          isMoveShadow: true,
        })
      }
    } else {
      // player is not changing squares, nothing to do
    }

    setPieces(piecesAfterPlayerMove)

    setTimer(
      OPPONENT_MOVE_TIMER,
      () => {
        // we check if there any collisions after the player moves
        if (checkForHazardCollision(pieces)) {
          handleLose()
          return
        }

        const piecesAfterEnvironmentMove = piecesAfterPlayerMove
          // remove any pieces (collected coins) from the board
          .filter(p => {
            if (p.isCoin && p.isCollected) {
              return false
            }
            return true
          })
          .map(p => {
            // we apply any velocities to each piece (except move shadows)
            if (p.velocity && !p.isMoveShadow) {
              // apply the velocity
              applyPieceVelocity(p, gameBoard)

              // if the player was on this platform, we update the player coords to match
              if (playerOnPlatform && p.id === playerOnPlatform.id) {
                playerPiece.position.row = p.position.row
                playerPiece.position.column = p.position.column
              }
            }

            return p
          })

        // we check if there any collisions after the world pieces move
        // TODO: for pieces with a velocity > 1 the piece could move through the player. Need to make this check more sophisticated
        if (checkForHazardCollision(piecesAfterEnvironmentMove)) {
          handleLose()
          return
        }

        setPieces(piecesAfterEnvironmentMove)
      },
      OPPONENT_MOVE_DELAY,
    )
  }, [revealingMoveIndex])

  const playMoves = () => {
    if (isShowingMoves) {
      return
    }

    setIsShowingMoves(true)

    const progressMove = () => {
      setRevealingMoveIndex(i => {
        if (i === null) {
          return 0
        }

        return i + 1
      })
      setTimer(MOVE_TIMER, progressMove, MOVE_DELAY)
    }

    progressMove()
  }

  return {
    playMoves,
    isShowingMoves,
    revealingMoveIndex,
  }
}

/**
 * @param {Array<AbstractPiece>} pieces
 * @returns {Hazard|null}
 */
function checkForHazardCollision(pieces) {
  const playerPiece = pieces.find(p => p.isPlayer)

  if (!playerPiece) {
    return null
  }

  const hazards = pieces.filter(
    p => p.isHazard && isSameSquare(p.position, playerPiece.position),
  )
  return hazards.length > 0 ? hazards[0] : null
}

/**
 * @param {Coordinate} coord
 * @param {Velocity} velocity
 * @param {Board} gameBoard
 * @return {Coordinate}
 */
function applyVelocityToCoordinate(coord, velocity, gameBoard) {
  return {
    // row does not wrap around the sides
    row: Math.max(
      0,
      Math.min(gameBoard.height, coord.row + velocity.rowChange),
    ),
    // column warps around the side
    column:
      (gameBoard.width + coord.column + velocity.columnChange) %
      gameBoard.width,
  }
}

/**
 * This applies a piece's own velocity to its position
 * @param {AbstractPiece} piece
 * @param {Board} gameBoard
 * @return {void}
 */
function applyPieceVelocity(piece, gameBoard) {
  if (piece.velocity) {
    console.log('OLD POSITION', piece.position)
    piece.position = applyVelocityToCoordinate(
      piece.position,
      piece.velocity,
      gameBoard,
    )
    console.log('NEW POSITION', piece.position)
  }
}

export default useLevelControl
