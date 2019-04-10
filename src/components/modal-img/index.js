import CloseIcon from 'react-icons/lib/fa/close'
import React from 'react'
import { injectState } from 'reaclette'

import './modal-img-style.css'

const ModalImg = ({ effects, picture, onCloseImgModal }) => (
  <div className="img-modal">
    <span className="close-modal">
      <CloseIcon onClick={() => onCloseImgModal()} color="white" />
    </span>
    <img
      className="modal-content"
      src={picture}
      alt="illustration d'ajout d'examen"
    />
    <div id="caption" />
  </div>
)

export default injectState(ModalImg)
