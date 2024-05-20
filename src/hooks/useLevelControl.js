import {useState, useEffect} from 'react'
import useDoOnceTimer from './useDoOnceTimer'
import {isSameSquare} from '../lib/utilities'

const OPPONENT_MOVE_TIMER = 'opponent-timer'
const OPPONENT_MOVE_DELAY = 300 // this should match World.scss -> $pieceMoveSpeed

const MOVE_TIMER = 'timer'
const MOVE_DELAY = 2 * OPPONENT_MOVE_DELAY // this should be 2 x OPPONENT_MOVE_DELAY

const OPPONENT_MOVE_VELOCITY_TIMER = 'opponent-velocity-timer-'

/**
 * @param {{onWin: function(Solution), onLose: function(Solution), autoPlay:boolean}} options
 * @return {{playMoves: function, isShowingMoves: boolean, revealingMoveIndex: number|null}}
 */
function useLevelControl(options) {
  const {pieces, playerPiece, setPieces, moves, gameBoard} = options

  const [isShowingMoves, setIsShowingMoves] = useState(false)
  const [revealingMoveIndex, setRevealingMoveIndex] = useState(null)
  const {setTimer, cancelAllTimers} = useDoOnceTimer()
  const [scoreSum, setScoreSum] = useState(0)
  const [hasWon, setHasWon] = useState(false)

  const handleWin = () => {
    setHasWon(true)
    cancelAllTimers()
    setIsShowingMoves(false)
    options.onWin({
      moves: moves,
      lastMove: revealingMoveIndex,
      score: scoreSum,
      solvedAt: new Date(),
    })
  }

  const handleLose = () => {
    cancelAllTimers()
    setIsShowingMoves(false)
    options.onLose({
      moves: moves,
      lastMove: revealingMoveIndex,
      score: scoreSum,
      solvedAt: new Date(),
    })
  }

  // this use effect steps us through the move reveals to see if the player wins/loses
  useEffect(() => {
    if (
      typeof revealingMoveIndex !== 'number' ||
      (!playerPiece && !options.autoPlay)
    ) {
      // do nothing, we're not actually revealing yet
      cancelAllTimers()
      return
    }

    // if we've revealed all moves, stop the timers and determine if we won or lost
    if (!options.autoPlay && revealingMoveIndex === moves.length) {
      const goalPiece = pieces.find(p => p.isGoal)
      if (goalPiece && isSameSquare(playerPiece.position, goalPiece.position)) {
        goalPiece.isCollected = true
        handleWin()
      } else {
        handleLose()
      }
      return
    }

    // determine where the next move square is
    /** @type {Velocity} */
    let nextMove = moves[revealingMoveIndex]

    if (!nextMove && !options.autoPlay) {
      console.error('No Move to calculate')
      cancelAllTimers()
      return
    }

    const nextCoordinate = nextMove
      ? applyVelocityToCoordinate(
          playerPiece.position,
          nextMove,
          gameBoard,
          true,
        )
      : {row: -100, column: -100}

    // clone pieces so react will rerender when we setPieces
    let piecesAfterPlayerMove = [...pieces]

    // if the player's next move lands them on a platform, we will store it to this variable
    let playerOnPlatform

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
      const foundCoin = piecesOnThatSquare.find(p => p.isCoin && !p.isCollected)
      if (foundCoin) {
        setScoreSum(s => s + foundCoin.value)
        foundCoin.isCollected = true
      }

      // check if the player is on a platform
      playerOnPlatform = piecesOnThatSquare.find(p => p.isPlatform)
      if (!playerOnPlatform) {
        // if the player is not on a platform, we clear their velocity
        delete playerPiece.velocity
      }
    }

    setPieces(piecesAfterPlayerMove)

    setTimer(
      OPPONENT_MOVE_TIMER,
      () => {
        // we check if there any collisions after the player moves, we do inside here so there's a delay between the player moving and the result happening
        if (checkForHazardCollision(pieces, playerPiece)) {
          handleLose()
          return
        }

        const piecesAfterFilter = piecesAfterPlayerMove
          // remove any pieces (collected coins) from the board
          .filter(p => {
            if (p.isCoin && p.isCollected) {
              return false
            }
            return true
          })

        if (piecesAfterFilter.length !== piecesAfterPlayerMove.length) {
          // update pieces immediately to remove any filtered pieces
          setPieces(piecesAfterFilter)
        }

        // next we need to apply velocities, but we need to do it one step at a time
        const velocityBuckets = piecesAfterFilter.reduce((agr, p) => {
          if (p.velocity && !p.isPlayer) {
            // we group pieces by their velocity magnitude from 0 to n - 1
            // i.e., pieces with velocity 1 are in index 0, pieces with velocity 2 is in index 1, 3 is in index 2, etc
            const magnitude = getHorizontalVelocityMagnitude(p.velocity) - 1
            if (!agr[magnitude]) {
              agr[magnitude] = []
            }
            agr[magnitude].push(p)
          } else {
            // this piece does not need to move, so it's not in a bucket
          }
          return agr
        }, [])

        if (velocityBuckets.length === 0) {
          // no pieces need to move, so we can skip the rest of this
          return
        }

        /**
         * @param {Array<AbstractPiece>} piecesInThisBucket
         * @param {number} bucketNumber
         * @param {number} iterationsRemaining
         */
        const stepPieces = (
          piecesInThisBucket,
          bucketNumber,
          iterationsRemaining,
        ) => {
          piecesInThisBucket.forEach(p => {
            // we apply any velocities to each piece (except move shadows)
            if (p.velocity) {
              // apply the velocity
              applyPieceVelocity(p, gameBoard)

              // if the player was on this platform, we apply that platform's velocity to the player
              if (playerOnPlatform && p.id === playerOnPlatform.id) {
                const normalizedVelocity = normalizeVelocity(p.velocity)
                const playerNextCoord = applyVelocityToCoordinate(
                  playerPiece.position,
                  normalizedVelocity,
                  gameBoard,
                  true,
                )
                // we temporarily set the player's velocity so the animation timing works correctly in World.jsx
                playerPiece.velocity = p.velocity
                playerPiece.position.column = playerNextCoord.column
              }
            }
          })

          const enemyStepDelay = OPPONENT_MOVE_DELAY / (bucketNumber + 1)
          // we check if there any collisions after the world pieces move
          // NOTE: we need to check all pieces in case the player was on a platform that moved into an obstacle, knocked them off into a hazard
          if (checkForHazardCollision(pieces, playerPiece)) {
            setTimer('enemy-move-lost', handleLose, enemyStepDelay)
          }
          // the pieces are updated in place, so we just want to trigger a refresh
          setPieces(prevPieces => [...prevPieces])

          // if we have more velocity iterations to do, we set a timer to do them
          if (iterationsRemaining > 0) {
            setTimer(
              OPPONENT_MOVE_VELOCITY_TIMER + bucketNumber,
              () => {
                stepPieces(
                  piecesInThisBucket,
                  bucketNumber,
                  iterationsRemaining - 1,
                )
              },
              enemyStepDelay,
            )
          }
        }

        // our velocity buckets now contain all pieces that need [index + 1] number turns to complete their movements
        for (let i = 0; i < velocityBuckets.length; i++) {
          // if this bucket has no pieces, we skip it
          if (!Array.isArray(velocityBuckets[i])) {
            continue
          }

          const piecesInThisBucket = [...velocityBuckets[i]]
          stepPieces(piecesInThisBucket, i, i)
        }
      },
      MOVE_DELAY / 2,
    )
  }, [revealingMoveIndex])

  const playMoves = () => {
    if (isShowingMoves) {
      return
    }

    setScoreSum(0)
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
    hasWonLevel: hasWon,
    resetLevel: () => {
      cancelAllTimers()
      setIsShowingMoves(false)
      setRevealingMoveIndex(null)
      setScoreSum(0)
    },
  }
}

/**
 * @param {Array<AbstractPiece>} pieces
 * @param {Player} playerPiece
 * @returns {Hazard|null}
 */
function checkForHazardCollision(pieces, playerPiece) {
  const piecesOnPlayerSquare = pieces.filter(p =>
    isSameSquare(p.position, playerPiece.position),
  )
  // if the player is on a platform they are safe
  if (piecesOnPlayerSquare.some(p => p.isPlatform)) {
    return null
  }
  return piecesOnPlayerSquare.find(p => p.isHazard) || null
}

/**
 * @param {Coordinate} coord
 * @param {Velocity} velocity
 * @param {Board} gameBoard
 * @param {boolean?} constrainToBounds
 * @return {Coordinate & {_warped?:boolean, _oobounds?:boolean}}
 */
function applyVelocityToCoordinate(
  coord,
  velocity,
  gameBoard,
  constrainToBounds,
) {
  const colChange = velocity.columnChange || 0
  const rowChange = velocity.rowChange || 0
  let nextColumn
  let nextRow
  if (constrainToBounds) {
    // the height doesn't have out of bounds so we use its value directly
    const boardHeight = gameBoard.height

    // remove the out of bounds from the width
    const boardWidth = gameBoard.width - 2
    // and shift the piece over 1
    const startCol = coord.column - 1

    nextColumn = Math.max(0, Math.min(boardWidth - 1, startCol + colChange)) + 1
    nextRow = Math.max(0, Math.min(boardHeight - 1, coord.row + rowChange))
  } else {
    nextColumn = (gameBoard.width + coord.column + colChange) % gameBoard.width

    nextRow = (gameBoard.height + coord.row + rowChange) % gameBoard.height
  }

  return {
    row: nextRow,
    column: nextColumn,

    // we know the coord is in the out of bounds of area if the column is 0 or the column is the last column
    _oobounds: nextColumn === 0 || nextColumn === gameBoard.width - 1,
    // we know it warped if the difference in columns is greater than the velocity
    // (this is only true if velocity < board width, which is almost certainly always true)
    _warped:
      Math.abs(nextColumn - coord.column) > Math.abs(colChange) ||
      Math.abs(nextRow - coord.row) > Math.abs(rowChange),
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
    // we always normalize because our pieces move in 1 square increments
    const normalizedVelocity = normalizeVelocity(piece.velocity)
    piece.position = applyVelocityToCoordinate(
      {
        row: piece.position.row,
        column: piece.position.column,
      },
      normalizedVelocity,
      {
        height: gameBoard.height,
        width: gameBoard.width,
      },
    )
  }
}

/**
 * @param {Velocity} v
 * @return {Velocity}
 */
function normalizeVelocity(v) {
  return {
    rowChange: v.rowChange > 0 ? 1 : v.rowChange < 0 ? -1 : 0,
    columnChange: v.columnChange > 0 ? 1 : v.columnChange < 0 ? -1 : 0,
  }
}

/**
 * @param {Velocity?} v
 * @return {number}
 */
function getHorizontalVelocityMagnitude(v) {
  return v ? Math.abs(v.columnChange) : 0
}

export default useLevelControl
