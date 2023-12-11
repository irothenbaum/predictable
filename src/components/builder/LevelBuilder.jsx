import React, {useState} from 'react'
import './LevelBuilder.scss'
import PropTypes from 'prop-types'
import NumberInput from '../utility/NumberInput'
import Button from '../utility/Button'
import {LevelInner} from '../gameplay/Level'
import SelectInput from '../utility/SelectInput'
import {PieceType} from '../../lib/constants'
import Player from '../environment/Player'
import Hazard from '../environment/Hazard'
import Obstacle from '../environment/Obstacle'
import Platform from '../environment/Platform'
import MoveShadow from '../environment/MoveShadow'
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
  const [showModal, setShowModal] = useState(false)

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

  return (
    <div className="level-builder">
      <div className="level-wrapper">
        <LevelInner
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
        <Button className="build-cta" onClick={() => setShowModal(true)}>
          Build
        </Button>
      </div>

      <Modal onClose={() => setShowModal(false)} isOpen={showModal}>
        <h3>Level Code</h3>
        <textarea
          style={{
            marginTop: '1rem',
            height: '10rem',
            width: '20rem',
          }}>
          {createLevelJSON(width, height, pieces)}
        </textarea>
      </Modal>
    </div>
  )
}

export default LevelBuilder

/**
 * @param {number} width
 * @param {number} height
 * @param {Array<AbstractPiece>} pieces
 * @return {string}
 */
function createLevelJSON(width, height, pieces) {
  return JSON.stringify({
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
  })
}
