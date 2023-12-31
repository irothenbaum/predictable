import React, {useEffect, useState} from 'react'
import {convertRemToPixels, flipCoin, rollDice} from '../../lib/utilities'
import {PieceType, squareSizeRemScale} from '../../lib/constants'
import Level from '../gameplay/Level'
import {instantiateLevelPieces} from '../../levels'
import PropTypes from 'prop-types'

// probability, 1 = 100%, 2 = 50%, 3 = 33%, 4 = 25%, 5 = 20%, etc.
const HAZARD_PROBABILITY = 3
const PLATFORM_PROBABILITY = 4
const OBSTACLE_PROBABILITY = 7

function BackgroundHero(props) {
  const [levelDefinition, setLevelDefinition] = useState(null)
  useEffect(() => {
    const squareDim = convertRemToPixels(squareSizeRemScale)

    const def = {
      gameBoard: {
        width: Math.ceil(window.innerWidth / squareDim),
        height: Math.ceil(window.innerHeight / squareDim), // can scroll up to 3x window height before we reset
      },
      pieces: [],
    }

    for (let r = 0; r < def.gameBoard.height; r++) {
      const rowType = flipCoin(OBSTACLE_PROBABILITY)
        ? PieceType.Obstacle
        : flipCoin(PLATFORM_PROBABILITY)
        ? PieceType.Platform
        : flipCoin(HAZARD_PROBABILITY)
        ? PieceType.Hazard
        : null

      if (rowType) {
        const v = rowType === PieceType.Obstacle ? 0 : rollDice(3)
        for (let c = 0; c < def.gameBoard.width; c++) {
          if (flipCoin(3)) {
            def.pieces.push({
              type: rowType,
              row: r,
              column: c,
              rowChange: 0,
              columnChange: v,
            })
          }
        }
      }
    }

    def.pieces.push({
      type: PieceType.Player,
      row: -10,
      column: 0,
    })
    def.pieces = instantiateLevelPieces(def.pieces)

    setLevelDefinition(def)
    props.onReady()
  }, [])

  return (
    <div className="background-hero">
      {levelDefinition && (
        <Level
          autoPlay={true}
          levelDefinition={levelDefinition}
          onWin={() => {}}
          onLose={() => {}}
        />
      )}
    </div>
  )
}

BackgroundHero.propTypes = {
  onReady: PropTypes.func.isRequired,
}

export default BackgroundHero
