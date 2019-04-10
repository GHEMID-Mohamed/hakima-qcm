/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import MobileIcon from 'react-icons/lib/fa/mobile'

import MobileIconImg from '../imgs/app-icon-brand.png'

class MobileAppModal extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <Modal
          isOpen={this.props.mobileAppModalOpen}
          toggle={this.props.onClose}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle}>
            <MobileIcon /> Application mobile
          </ModalHeader>
          <ModalBody>
            <div
              className="text-center"
              style={{ fontSize: '20px', fontWeight: 'bold' }}
            >
              Installez l'application mobile en 2 secondes
            </div>
            <br />
            <div className="text-center">
              <img
                src={MobileIconImg}
                alt="app icon"
                height="130"
                width="160"
              />
            </div>
            <br />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.props.onAction}>
              Installer
            </Button>{' '}
            <Button color="secondary" onClick={this.props.onClose}>
              Quitter
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

export default MobileAppModal
