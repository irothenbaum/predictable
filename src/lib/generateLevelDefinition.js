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
  //    a. a path that has multiple lateral moves in a row can be converted into a platform motion (pseudo step)

  // 3: generate a list of pieces based on the path

  //    a. group all steps in the path based on their row and position in the path
  //    b. for each row in the board, gather a list of all steps in the path that are in that row
  //    c. determine if the row is going to be a platform row [see 2.a pseudo step],  hazard row, obstacle row, empty row, or hazard/platform row
  //    d. generate the pieces for the row based on the type
  //        i. the position and velocity are created in order to avoid (hazard & obstacle) or meet (platform) the steps passed to it
  //        ii. the velocity is based on the type of row and some randomness x difficulty
  //    e. add the pieces to the list of pieces definition

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
    column: rand.next().value % board.width,
    row: i,
  }))

  console.log('primordialPath', primordialPath)

  // next we're going to create additional coordinates to connect the dots of out primordial path
  // this will introduce twists and turns

  // isUpGoal basically determines if we end the game going vertically into the goal or horizontally
  const isUpGoal = rand.next().value % 2 === 0

  // this is how many times we want to the player to have to double back (TODO: this should be based on complexity)
  const NumberOfLoops = 2
  let loopsRemaining = NumberOfLoops

  // the loop cannot be longer (horizontally) than this
  const LongestLoopLength = Math.min(4, board.width / 2)

  /** @type {Array<Coordinate>} */
  const shiftedPath = primordialPath
    .map((step, i) => {
      console.log('step', step, i)
      // determine which next step in the path we're comparing against based on if this path finishes upGoal or not
      // if we finish up goal, we compare against the previous step (going from goal to start position, top to bottom)
      // in the goals case (the top most/ first step, it will not have one to compare to and so it will be the only step on its row
      const compareStep = isUpGoal
        ? primordialPath[i - 1]
        : primordialPath[i + 1]

      if (!compareStep) {
        console.log('no compare step')
        // as prophesized
        return [step]
      }

      const diff = step.column - compareStep.column
      const diffNormal = diff / Math.abs(diff)

      // if this row travel at least as long as the longest loop
      const canLoopThisRow =
        loopsRemaining > 0 && Math.abs(diff) > LongestLoopLength

      // initialize our array with our step because our for loop breaks when i === 0
      const retVal = [step]
      const thisRowSteps = []
      console.log('diff meta', diff, diffNormal, isUpGoal)
      for (let i = diff; i !== 0; i -= diffNormal) {
        thisRowSteps.push({...step, column: step.column - i})
      }

      // if we CAN loop this row, we roll a dice to see if we will
      // TODO: this probability should be based on complexity
      if (canLoopThisRow && rand.next().value % 2 === 0) {
        createLoop(rand, thisRowSteps)
      }

      thisRowSteps.reverse()
      retVal.push(...thisRowSteps)

      if (isUpGoal) {
        retVal.reverse()
      }

      console.log('retVal', retVal)

      return retVal
    })
    .reduce((a, e) => a.concat(e), [])

  shiftedPath.reverse()
  console.log('FINAL', shiftedPath)
  return shiftedPath
}

/**
 * Modifies the array in place
 * @param {Generator} rand
 * @param {Array<Coordinate>} steps
 * @returns {null}
 */
function createLoop(rand, steps) {
  // TODO: implement this
  return steps
}
