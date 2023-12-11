import React from 'react'
import {createPortal} from 'react-dom'
import './Modal.scss'
import Icon, {CLOSE} from './Icon'
import PropTypes from 'prop-types'
import {constructClassString} from '../../lib/utilities'

function Modal(props) {
  return createPortal(
    <div
      className={constructClassString('modal-container', props.className, {
        open: props.isOpen,
      })}>
      <div className="modal-overlay" onClick={props.onClose} />
      <div className="modal-content">
        <span className="close-icon" onClick={props.onClose}>
          close <Icon icon={CLOSE} />
        </span>
        {/* Only render children if we're open */}
        {props.isOpen && props.children}
      </div>
    </div>,
    document.body,
  )
}

Modal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.any.isRequired,
  className: PropTypes.string,
}

export default Modal
