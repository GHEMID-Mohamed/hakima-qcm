import React from 'react'
import CheckCircleIcon from 'react-icons/lib/fa/check-circle'
import { Col, Form, FormGroup, Input, Row } from 'reactstrap'
import { injectState, provideState } from 'reaclette'
import { UserPasswordAuthProviderClient } from 'mongodb-stitch-browser-sdk'

import LoadingIcon from '../imgs/button-spinner.gif'
import ActionButton from '../components/action-button'

const withState = provideState({
  initialState: () => ({
    id: '',
    resetPasswordEmailSent: false,
    loading: false,
  }),
  effects: {
    handleId: (_, { target: { value } }) => state => ({
      ...state,
      id: value,
    }),
    resetPassword: effects => state => {
      const emailPassClient = state.serverInstance.auth.getProviderClient(
        UserPasswordAuthProviderClient.factory
      )
      // state.loading = true
      emailPassClient
        .sendResetPasswordEmail(state.id)
        .then(() => {
          // state.loading = false
          state.resetPasswordEmailSent = true
        })
        .catch(err => {
          effects.handleError(err)
        })
    },
  },
})

const ResetPassword = ({ effects, state }) => (
  <Row>
    <Col>
      {state.loading ? (
        <Col md={{ size: 2, offset: 5 }}>
          <img src={LoadingIcon} alt="Loading..." height="100" width="100" />
        </Col>
      ) : state.resetPasswordEmailSent ? (
        <div className="text-center">
          <CheckCircleIcon
            color="green"
            size="35"
            style={{ marginBottom: '5px' }}
          />
          <p className="text-center">
            Un email de rénitialisation de mot de passe est envoyé à votre
            adresse e-mail
          </p>
        </div>
      ) : (
        <Form id="reset-form">
          <FormGroup>
            <Input
              type="email"
              placeholder="Entrez votre email !"
              value={state.id}
              onChange={effects.handleId}
              required
            />
          </FormGroup>
          <ActionButton
            text={<span style={{ fontWeight: 'bold' }}>Reset password</span>}
            color="success"
            action={effects.resetPassword}
            form="reset-form"
          />
        </Form>
      )}
    </Col>
  </Row>
)

export default withState(injectState(ResetPassword))
