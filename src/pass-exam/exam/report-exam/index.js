import ActionButton from '../../../components/action-button'
import CheckIcon from 'react-icons/lib/fa/check'
import SendIcon from 'react-icons/lib/fa/space-shuttle'
import WarningIcon from 'react-icons/lib/fa/exclamation-triangle'
import CuteKoala from '../../../imgs/cute_koala.jpg'
import React from 'react'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Row,
  Col,
} from 'reactstrap'
import { injectState, provideState } from 'reaclette'

let _inputRef

const withState = provideState({
  initialState: () => ({
    reportModal: false,
    reportMessage: '',
    reportSent: false,
  }),
  effects: {
    getInputRef: (_, inputRef) => {
      _inputRef = inputRef
    },
    oppenReportModal: () => (state, { _module, questionNum, examDate }) => {
      state.reportModal = true
      state.reportMessage = `Module: ${_module}\nSession: ${examDate}\nQuestion: ${questionNum}\n\nErreur: `
      setTimeout(() => {
        _inputRef && _inputRef.focus()
      }, 1000)
    },
    closeReportModal: () => state => ({
      ...state,
      reportModal: false,
    }),
    sendReport: effects => async (state, { examId, questionNum }) => {
      try {
        await state.mongodb.insertOne({
          type: 'report',
          examId,
          questionNum,
          reportMessage: state.reportMessage,
          creator: state.authId,
          corrected: false,
          date: Date.now(),
        })
        state.reportSent = true
      } catch (error) {
        effects.handleError(error)
      }
    },
    handleReportMessageBody: (_, { target: { value } }) => state => ({
      ...state,
      reportMessage: value,
    }),
  },
})

const ReportExam = ({ state, effects, history }) => (
  <div>
    <span>
      <Button size="xs" color="light" onClick={effects.oppenReportModal}>
        <WarningIcon color="orange" /> Une erreur ! signaler là vite !
      </Button>
    </span>
    <Modal isOpen={state.reportModal} toggle={effects.oppenReportModal}>
      <ModalHeader
        toggle={effects.closeReportModal}
        style={{ backgroundColor: '#e63a3a' }}
      >
        Signaler un problème
      </ModalHeader>
      <ModalBody>
        {state.reportSent ? (
          <div className="text-center" style={{ fontSize: '20px' }}>
            <img src={CuteKoala} alt="koala" height="200" width="200" />
            <br />
            <div>
              Merci, Rapport envoyé avec succés <CheckIcon color="green" />
            </div>
            <div>Grace à vous cet examen va être corrigé</div>
          </div>
        ) : (
          <Input
            type="textarea"
            value={state.reportMessage}
            style={{ height: '200px' }}
            onChange={effects.handleReportMessageBody}
            innerRef={effects.getInputRef}
          />
        )}
      </ModalBody>
      <ModalFooter>
        <Row>
          <Col md="6" />
          <Col md="6">
            <div className="float-right">
              <ActionButton
                text={
                  <span>
                    Envoyer le rapport <SendIcon size="20" />
                  </span>
                }
                action={effects.sendReport}
                width={'200px'}
                disabled={state.reportSent}
              />
            </div>
          </Col>
        </Row>
      </ModalFooter>
    </Modal>
  </div>
)

export default withState(injectState(ReportExam))
