import React, {useEffect, useState} from 'react'
import './LevelBuilder.scss'
import NumberInput from '../utility/NumberInput'
import Button, {VARIANT_SECONDARY} from '../utility/Button'
import {LevelInner} from '../gameplay/Level'
import SelectInput from '../utility/SelectInput'
import {PieceType} from '../../lib/constants'
import Player from '../environment/Player'
import Hazard from '../environment/Hazard'
import Obstacle from '../environment/Obstacle'
import Platform from '../environment/Platform'
import {isSameSquare} from '../../lib/utilities'
import {v4 as uuid} from 'uuid'
import Modal from '../utility/Modal'

const PieceTypeToComponent = {
  [PieceType.Player]: Player,
  [PieceType.Hazard]: Hazard,
  [PieceType.Obstacle]: Obstacle,
  [PieceType.Platform]: Platform,
}

function LevelBuilder(props) {
  const [width, setWidth] = useState(6)
  const [height, setHeight] = useState(8)
  const [pieces, setPieces] = useState([])
  const [creatingVelocity, setCreatingVelocity] = useState(0)
  const [creatingPieceType, setCreatingPieceType] = useState(PieceType.Obstacle)
  const [showBuildModal, setShowBuildModal] = useState(false)
  const [showLoadModal, setShowLoadModal] = useState(false)
  const [loadText, setLoadText] = useState('')
  const [startingPosition, setStartingPosition] = useState({row: 0, column: 0})

  useEffect(() => {
    const playerPiece = pieces.find(p => p.type === PieceType.Player)
    setStartingPosition(
      playerPiece ? playerPiece.position : {row: 0, column: 0},
    )
  }, [width, height])

  const handleClickSquare = s => {
    const without = pieces.filter(
      p => p.type !== creatingPieceType || !isSameSquare(p.position, s),
    )
    if (without.length === pieces.length) {
      setPieces([
        ...pieces,
        {
          id: uuid(),
          type: creatingPieceType,
          position: s,
          velocity: {columnChange: creatingVelocity, rowChange: 0},
        },
      ])
    } else {
      setPieces(without)
    }
  }

  const handleLoadLevel = () => {
    /** @type {LevelDefinition} level  */
    const level = JSON.parse(loadText)
    setWidth(level.gameBoard.width)
    setHeight(level.gameBoard.height)
    setPieces(
      level.pieces.map(p => ({
        id: uuid(),
        type: p.type,
        position: {row: p.row, column: p.column},
        velocity: {rowChange: p.rowChange, columnChange: p.columnChange},
      })),
    )
    setShowLoadModal(false)
  }

  return (
    <div className="level-builder">
      <div className="level-wrapper">
        <LevelInner
          startingPosition={startingPosition}
          gameBoard={{width, height}}
          pieces={pieces}
          onClickSquare={handleClickSquare}
        />
      </div>
      <div className="controls">
        <p>Width x Height</p>
        <div className="row">
          <NumberInput value={width} onChange={setWidth} />
          <NumberInput value={height} onChange={setHeight} />
        </div>
        <p>Velocity</p>
        <div className="row">
          <NumberInput
            value={creatingVelocity}
            onChange={setCreatingVelocity}
          />
        </div>
        <p>Piece</p>
        <SelectInput
          options={Object.keys(PieceTypeToComponent)}
          value={creatingPieceType}
          renderOption={type => {
            const Component = PieceTypeToComponent[type]
            return type && Component ? (
              <Component piece={{type: type}} />
            ) : (
              <span>?</span>
            )
          }}
          onChange={setCreatingPieceType}
        />
        <div style={{height: '100%'}} />
        <Button onClick={() => setShowBuildModal(true)}>Build</Button>
        <Button
          variant={VARIANT_SECONDARY}
          onClick={() => setShowLoadModal(true)}>
          Load
        </Button>
      </div>

      <Modal onClose={() => setShowBuildModal(false)} isOpen={showBuildModal}>
        <h3>Level Code</h3>
        <textarea
          style={{
            marginTop: '1rem',
            height: '10rem',
            width: '20rem',
          }}
          value={JSON.stringify(
            showBuildModal ? createLevelJSON(width, height, pieces) : '',
          )}
          onChange={() => {}}></textarea>
      </Modal>

      <Modal onClose={() => setShowLoadModal(false)} isOpen={showLoadModal}>
        <h3>Level Code</h3>
        <textarea
          style={{
            marginTop: '1rem',
            height: '10rem',
            width: '20rem',
          }}
          value={loadText}
          onChange={e => setLoadText(e.target.value)}>
          Enter level JSON here
        </textarea>
        <Button onClick={handleLoadLevel} variant={VARIANT_SECONDARY}>
          Load level
        </Button>
      </Modal>
    </div>
  )
}

export default LevelBuilder

/**
 * @param {number} width
 * @param {number} height
 * @param {Array<AbstractPiece>} pieces
 * @return {LevelDefinition}
 */
function createLevelJSON(width, height, pieces) {
  return {
    gameBoard: {
      width,
      height,
    },
    pieces: pieces.map(p => ({
      type: p.type,
      row: p.position.row,
      column: p.position.column,
      rowChange: p.velocity.rowChange,
      columnChange: p.velocity.columnChange,
    })),
  }
}
