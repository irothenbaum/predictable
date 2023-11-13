import React, {useLayoutEffect, useRef, useState} from 'react'
import './ToolTip.scss'
import PropTypes from 'prop-types'
import {capitalizeFirstLetter, constructClassString} from '../../utilities'

export const ANCHOR_TOP = 'top'
export const ANCHOR_BOTTOM = 'bottom'
export const ANCHOR_LEFT = 'left'
export const ANCHOR_RIGHT = 'right'

const anchorToPositionProp = {
  [ANCHOR_TOP]: 'top',
  [ANCHOR_BOTTOM]: 'bottom',
  [ANCHOR_LEFT]: 'left',
  [ANCHOR_RIGHT]: 'right',
}

const anchorToDimensionProp = {
  [ANCHOR_TOP]: 'height',
  [ANCHOR_BOTTOM]: 'height',
  [ANCHOR_LEFT]: 'width',
  [ANCHOR_RIGHT]: 'width',
}

function ToolTip(props) {
  const labelRef = useRef(undefined)
  const [dimension, setDimension] = useState(0)

  const anchorPos = props.anchor || ANCHOR_TOP
  const anchorClass = `anchor-${anchorPos}`
  const positionProp = anchorToPositionProp[anchorPos]
  const dimensionProp = anchorToDimensionProp[anchorPos]

  const calcHeight = () => {
    if (!labelRef.current) {
      return
    }
    setDimension(
      Math.ceil(
        labelRef.current[`client${capitalizeFirstLetter(dimensionProp)}`],
      ),
    )
  }

  useLayoutEffect(() => {
    calcHeight()
  }, [props.label])

  return (
    <div
      className={constructClassString(
        'tooltip',
        anchorClass,
        {hovered: props.isShown},
        props.className,
      )}
      title={props.withTitle ? props.label : undefined}
      onClick={props.onClick}>
      {props.children}
      <div
        className="tooltip-label-container"
        style={{
          [dimensionProp]: dimension,
          [positionProp]: -dimension - 4 /*4 = just a little extra space*/,
          overflow: 'hidden',
        }}>
        <label
          className="tooltip-label"
          ref={r => {
            if (!r) {
              return
            }
            labelRef.current = r
            calcHeight()
          }}>
          {props.label}
        </label>
      </div>
    </div>
  )
}

ToolTip.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
  anchor: PropTypes.string,
  withTitle: PropTypes.bool,
  isShown: PropTypes.bool,
}

export default ToolTip
