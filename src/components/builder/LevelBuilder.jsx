import React, {useEffect, useState} from 'react'
import './LevelBuilder.scss'
import NumberInput from '../utility/NumberInput'
import Button from '../utility/Button'
import Level, {LevelInner} from '../gameplay/Level'
import SelectInput from '../utility/SelectInput'
import {LevelDefinitionShape, PieceType, Variant} from '../../lib/constants'
import Player from '../environment/Player'
import Hazard from '../environment/Hazard'
import Obstacle from '../environment/Obstacle'
import Platform from '../environment/Platform'
import Goal from '../environment/Goal'
import {isSameSquare} from '../../lib/utilities'
import {v4 as uuid} from 'uuid'
import Modal from '../utility/Modal'
import PropTypes from 'prop-types'

const PieceTypeToComponent = {
  [PieceType.Player]: Player,
  [PieceType.Hazard]: Hazard,
  [PieceType.Obstacle]: Obstacle,
  [PieceType.Platform]: Platform,
  [PieceType.Goal]: Goal,
}

const VariantLabels = {
  '': 'None',
  [Variant.Middle]: 'Middle',
  [Variant.LeftEnd]: 'Left',
  [Variant.RightEnd]: 'Right',
}

function LevelBuilder(props) {
  const [width, setWidth] = useState(6)
  const [height, setHeight] = useState(8)
  const [pieces, setPieces] = useState([])
  const [creatingVelocity, setCreatingVelocity] = useState(0)
  const [creatingVariant, setCreatingVariant] = useState('')
  const [creatingPieceType, setCreatingPieceType] = useState(PieceType.Obstacle)
  const [startingPosition, setStartingPosition] = useState({row: 0, column: 0})

  useEffect(() => {
    const level = props.levelDefinition

    if (level) {
      setWidth(level.gameBoard.width)
      setHeight(level.gameBoard.height)
      setPieces(
        level.pieces.map(p => ({
          id: uuid(),
          type: p.type,
          position: {row: p.row, column: p.column},
          velocity: {rowChange: p.rowChange, columnChange: p.columnChange},
          variant: p.variant,
        })),
      )
    } else {
      setWidth(6)
      setHeight(6)
      setPieces([])
    }
  }, [props.levelDefinition])

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
          variant: creatingVariant ? creatingVariant : undefined,
        },
      ])
    } else {
      setPieces(without)
    }
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
        <p>Variant</p>
        <div className="row">
          <SelectInput
            options={Object.keys(VariantLabels)}
            value={creatingVariant}
            renderOption={l => <span>{VariantLabels[l]}</span>}
            onChange={setCreatingVariant}
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
        <Button
          onClick={() => props.onSave(createLevelJSON(width, height, pieces))}>
          Save
        </Button>
      </div>
    </div>
  )
}

LevelBuilder.propTypes = {
  levelDefinition: LevelDefinitionShape,
  onSave: PropTypes.func,
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
      variant: p.variant || undefined,
    })),
  }
}
