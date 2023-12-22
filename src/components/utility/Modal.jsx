import React from 'react'
import {createPortal} from 'react-dom'
import './Modal.scss'
import Icon, {CLOSE} from './Icon'
import PropTypes from 'prop-types'
import {constructClassString} from '../../lib/utilities'

function Modal(props) {
  return createPortal(
    <div
      className={constructClassString('modal-container', {
        open: props.isOpen,
      })}>
      <div className="modal-overlay" onClick={props.onClose} />
      <div className={constructClassString('modal-content', props.className)}>
        {typeof props.onClose === 'function' && (
          <span className="close-icon" onClick={props.onClose}>
            close <Icon icon={CLOSE} />
          </span>
        )}
        <div className="modal-content-inner">{props.children}</div>
      </div>
    </div>,
    document.body,
  )
}

Modal.propTypes = {
  isOpen: PropTypes.bool,
  children: PropTypes.any.isRequired,
  className: PropTypes.string,
}

export default Modal
