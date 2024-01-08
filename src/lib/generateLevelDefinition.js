import {randomGenerator} from './utilities'

/**
 * @param {string} seed
 * @param {Board} board
 * @param {number} difficulty
 * @returns {Promise<LevelDefinition>}
 */
export async function generateLevelDefinition(seed, board, difficulty) {
  // 1: generate a deterministic random number generator from the seed
  const rand = await randomGenerator(seed)

  // 2: find a path through the empty board utilizing up, down, left, right, and pause
  const path = generatePath(rand, board)

  // 3: generate a list of pieces based on the path
  const pieces = createPieceDefinitionsFromPath(rand, path, board)

  return {
    gameBoard: board,
    pieces: [],
    _path: path,
  }
}

/**
  // NOTE: The paths this function creates only travel vertically (from bottom to top)
 * @param {Generator} rand
 * @param {Board} board
 * @returns {Array<Coordinate>}
 */
function generatePath(rand, board) {
  const centerRow = Math.floor(board.height / 2)
  const centerColumn = Math.floor(board.width / 2)

  // we start with a series of points (one on each row) starting from the top and going to the bottom
  const primordialPath = new Array(board.height).fill(null).map((_, i) => ({
    column: oneIn(board.width, rand),
    row: i,
  }))

  console.log('primordialPath', primordialPath)

  // next we're going to create additional coordinates to connect the dots of out primordial path
  // this will introduce twists and turns

  // isUpGoal basically determines if we end the game going vertically into the goal or horizontally
  const isUpGoal = oneIn(2, rand)

  // this is how many times we want to the player to have to double back (TODO: this should be based on complexity)
  const NumberOfLoops = 2
  let loopsRemaining = NumberOfLoops

  // the loop cannot be longer (horizontally) than this
  const LongestLoopLength = Math.min(4, board.width / 2)

  /** @type {Array<Coordinate>} */
  const shiftedPath = primordialPath
    .map((step, i) => {
      // determine which next step in the path we're comparing against based on if this path finishes upGoal or not
      // if we finish up goal, we compare against the previous step (going from goal to start position, top to bottom)
      // in the goals case (the top most/ first step, it will not have one to compare to and so it will be the only step on its row
      const retVal = [step]
      const compareStep = isUpGoal
        ? primordialPath[i - 1]
        : primordialPath[i + 1]

      if (!compareStep) {
        // as prophesized
        return retVal
      }

      const diff = step.column - compareStep.column

      // if there's no difference between the steps, we just return the step
      if (diff === 0) {
        return retVal
      }

      const diffAbs = Math.abs(diff)
      const diffNormal = diff / diffAbs

      // if this row travel at least as long as the longest loop
      const canLoopThisRow = loopsRemaining > 0 && diffAbs > LongestLoopLength

      // initialize our array with our step because our for loop breaks when i === 0
      const thisRowSteps = []
      for (let i = diff; i !== 0; i -= diffNormal) {
        thisRowSteps.push({...step, column: step.column - i})
      }

      // if we CAN loop this row, we roll a dice to see if we will
      // TODO: this probability should be based on complexity
      if (canLoopThisRow && oneIn(2, rand)) {
        createLoop(rand, thisRowSteps)
      }

      thisRowSteps.reverse()
      retVal.push(...thisRowSteps)

      if (isUpGoal) {
        retVal.reverse()
      }

      return retVal
    })
    .reduce((a, e) => a.concat(e), [])

  shiftedPath.reverse()
  console.log('FINAL', shiftedPath)
  return shiftedPath
}

/**
 * @param {Generator} rand
 * @param {Array<Coordinate>} path
 * @param {Board} board
 * @return {Array<PieceDefinition>}
 */
function createPieceDefinitionsFromPath(rand, path, board) {
  //  a. group all steps in the path based on their row and position in the path
  //  b. for each row in the board, gather a list of all steps in the path that are in that row
  //  c. determine if the row is going to be a platform row [see c.i],  hazard row, obstacle row, empty row, or hazard/platform row
  //      i. a path that has multiple lateral moves in a row can be converted into a platform motion (pseudo step)
  //  d. generate the pieces for the row based on the type
  //      i. the position and velocity are created in order to avoid (hazard & obstacle) or meet (platform) the steps passed to it
  //      ii. the velocity is based on the type of row and some randomness x difficulty
  //  e. add the pieces to the list of pieces definition

  /** @type {Object<number, Array<{position: number, coordinate: Coordinate}>>} */
  const pathGrouped = path.reduce((a, c, i) => {
    if (!a[c.row]) {
      a[c.row] = []
    }

    a[c.row].push({position: i, coordinate: c})
    return a
  }, {})

  const environmentPieces = Object.keys(pathGrouped).map(row => {
    const steps = pathGrouped[row]

    const canBeAPlatformRow = steps.every((s, i) => {
      return i === 0 || s.position === steps[i - 1].position + 1
    })

    let thisRowPieces = []

    // we don't want hazards on our start or end rows
    const canBeAHazardRow = row !== 0 && row !== board.height - 1

    const canBeAnObstacleRow = true

    if (canBeAPlatformRow && oneIn(2, rand)) {
      if (canBeAHazardRow && oneIn(2, rand)) {
        thisRowPieces.push(
          new Array(board.width).fill(null).map((_, i) => ({
            type: 'hazard',
            position: {row, column: i},
            // 0 velocity
          })),
        )
      }

      // TODO: here we position our platform such that it WILL meet the steps passed to it
    } else if (canBeAHazardRow && oneIn(2, rand)) {
      // TODO: here we create hazards (either with velocity or not) such that they will NOT touch any of the steps
    } else if (canBeAnObstacleRow) {
      // TODO: here we create obstacles that will NOT touch any of the steps
    }
  })

  console.log('Pieces', environmentPieces)

  return environmentPieces
}

/**
 * Modifies the array in place, turns a single stretch of horizontal movement (steps) into a zigzag of sorts
 * @param {Generator} rand
 * @param {Array<Coordinate>} steps
 * @returns {null}
 */
function createLoop(rand, steps) {
  // TODO: implement this
  return steps
}

/**
 * @param {number} x
 * @param {Generator} rand
 * @returns {boolean}
 */
function oneIn(x, rand) {
  return rand.next().value % x === 0
}
