import PlusIcon from 'react-icons/lib/fa/plus'
import React, { Fragment } from 'react'
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  Row,
} from 'reactstrap'
import { injectState, provideState } from 'reaclette'
import { map } from 'lodash'

import Modules from '../../data/modules.json'
import UserSessions from './user-sessions'
import ActionButton from '../../components/action-button'

const withState = provideState({
  initialState: () => ({
    examSessions: undefined,
    module: '',
  }),
  effects: {
    initialize: async effects => {
      await effects.getUserExamSessions()
    },
    handleSessionInputs: (_, { target }) => state => ({
      ...state,
      [target.name]: target.value,
    }),
    getUserExamSessions: effects => async state => {
      try {
        const _examSessions = await state.mongodb
          .find(
            { type: 'review', creator: state.authId },
            {
              sort: { date: -1 },
            }
          )
          .asArray()
        for (let session of _examSessions) {
          const numberOfExams = await state.mongodb.count({
            type: 'exam',
            module: session.module,
          })
          const numberOfPassedExams = await state.mongodb.count({
            type: 'passed-exam',
            reviewId: session._id,
          })

          session.numberOfExistingExams = numberOfExams
          session.numberOfPassedExams = numberOfPassedExams
        }
        state.examSessions = _examSessions
      } catch (error) {
        effects.handleError(error)
      }
    },
    createReviewSession: effects => async state => {
      try {
        // Verifying if session exists
        const cursor = await state.mongodb
          .find({
            type: 'review',
            creator: state.authId,
            module: state.module,
          })
          .iterator()
        const res = await cursor.next()
        if (res) {
          effects.notifyError(
            'Vous avez déjà ouvert une session pour ce module !'
          )
        } else {
          // Start creating the session
          await state.mongodb.insertOne({
            type: 'review',
            creator: state.authId,
            module: state.module,
            date: Date.now(),
            passedExams: [],
          })
          await effects.getUserExamSessions()
          effects.notifySuccess(
            'Session créée avec succés, Vous pouvez la commencer en appuyant sur le boutton [suivre] sur votre tableau de révision dessous'
          )
        }
      } catch (error) {
        effects.handleError(error)
      }
    },
  },
})

const ReviewSessions = ({ effects, state }) => (
  <Fragment>
    <Row>
      <Col>
        <span className="text-muted" style={{ fontSize: '16px' }}>
          Suivez votre révision en créant une session pour le module que vous
          souhaitez réviser
        </span>
        <span className="float-right">
          <Form id="session-form">
            <FormGroup>
              <InputGroup>
                <Input
                  name="module"
                  onChange={effects.handleSessionInputs}
                  required
                  type="select"
                  value={state.module}
                  disabled={state.addExamStarted}
                >
                  <option value="">Module *</option>
                  {Modules &&
                    map(Modules, module => (
                      <option key={module} value={module}>
                        {module}
                      </option>
                    ))}
                </Input>
                <InputGroupAddon
                  addonType="append"
                  style={{ cursor: 'pointer' }}
                >
                  <ActionButton
                    className="hvr-icon-forward"
                    text={
                      <span>
                        Ajouter une révision <PlusIcon className="hvr-icon" />
                      </span>
                    }
                    color="info"
                    action={effects.createReviewSession}
                    form="session-form"
                  />
                </InputGroupAddon>
              </InputGroup>
            </FormGroup>
          </Form>
        </span>
      </Col>
    </Row>
    <hr />
    <Row>
      <Col>
        <span className="text-muted">Mes sessions de révision</span>
      </Col>
    </Row>
    <Row>
      <Col>
        <UserSessions examSessions={state.examSessions} />
      </Col>
    </Row>
  </Fragment>
)

export default withState(injectState(ReviewSessions))
