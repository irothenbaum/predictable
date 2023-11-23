import {useState, useEffect, useContext} from 'react'
import useDoOnceTimer from './useDoOnceTimer'
import LevelContext from '../contexts/LevelContext'
import {isSameSquare} from '../lib/utilities'

const MOVE_TIMER = 'timer'
const MOVE_DELAY = 1000

const OPPONENT_MOVE_TIMER = 'opponent-timer'
const OPPONENT_MOVE_DELAY = MOVE_DELAY / 2

/**
 * @param {{onWin: function, onLose: function}} options
 * @return {{playMoves: playMoves}}
 */
function useLevelControl(options) {
  const {pieces, playerPiece, updatePieces, setPieces, moves, gameBoard} =
    useContext(LevelContext)

  const [isShowingMoves, setIsShowingMoves] = useState(false)
  const [revealingMoveIndex, setRevealingMoveIndex] = useState(null)
  const {setTimer, cancelTimer, cancelAllTimers} = useDoOnceTimer()

  // this use effect steps us through the move reveals to see if the player wins/loses
  useEffect(() => {
    if (typeof revealingMoveIndex !== 'number' || !playerPiece) {
      // do nothing, we're not actually revealing yet
      return
    }

    // if we've revealed all moves, stop the timer and determine if we won or lost
    if (revealingMoveIndex === moves.length) {
      cancelTimer(MOVE_TIMER)
      cancelTimer(OPPONENT_MOVE_TIMER)
      const goalPiece = pieces.find(p => p.isGoal)
      if (isSameSquare(playerPiece.position, goalPiece.position)) {
        options.onWin()
      } else {
        options.onLose()
      }
      return
    }

    // determine where the next move square is
    const nextMove = moves[revealingMoveIndex]

    // if the player's next move lands them on a platform, we cant to record that
    let playerOnPlatform

    // find all pieces currently on that square
    const piecesOnThatSquare = pieces.filter(p =>
      isSameSquare(p.position, nextMove),
    )

    if (piecesOnThatSquare.some(p => p.isObstacle)) {
      // cannot move to this square, we skip the Move (cannot be applied)
    } else {
      playerPiece.position.row = nextMove.row
      playerPiece.position.column = nextMove.column

      // if we found a coin, we remove it from our pieces list
      const foundCoin = piecesOnThatSquare.find(p => p.isCoin && !p.isCollected)
      if (foundCoin) {
        foundCoin.isCollected = true
      }

      // check if the player is on a platform
      playerOnPlatform = piecesOnThatSquare.find(
        p => p.isPlatform && isSameSquare(p.position, playerPiece.position),
      )
    }

    setPieces([...pieces])

    setTimer(
      OPPONENT_MOVE_TIMER,
      () => {
        // we check if there any collisions after the player moves
        if (checkForHazardCollision(pieces)) {
          options.onLose()
          return
        }

        const nexPieces = pieces
          // remove any pieces (collected coins) from the board
          .filter(p => {
            if (p.isCoin && p.isCollected) {
              return false
            }
            return true
          })
          .map(p => {
            // we apply any velocities to each piece
            if (p.velocity) {
              // apply the velocity
              applyVelocity(p, gameBoard)

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
        if (checkForHazardCollision(nexPieces)) {
          options.onLose()
          return
        }

        setPieces(nexPieces)
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
 * @param {AbstractPiece} piece
 * @param {Board} gameBoard
 * @return {void}
 */
function applyVelocity(piece, gameBoard) {
  if (piece.velocity) {
    piece.position.row +=
      (gameBoard.height + piece.velocity.rowChange) % gameBoard.height
    piece.position.column +=
      (gameBoard.width + piece.velocity.columnChange) % gameBoard.width
  }
}

export default useLevelControl
