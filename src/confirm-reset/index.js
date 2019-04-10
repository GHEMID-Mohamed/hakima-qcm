import ResendIcon from 'react-icons/lib/fa/refresh'
import CheckIcon from 'react-icons/lib/fa/check'
import React from 'react'
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Form,
  FormGroup,
  Input,
  Row,
} from 'reactstrap'
import { injectState, provideState } from 'reaclette'
import { UserPasswordAuthProviderClient } from 'mongodb-stitch-browser-sdk'

import LoadingIcon from '../imgs/button-spinner.gif'
import ActionButton from '../components/action-button'

const withState = provideState({
  initialState: () => ({
    confirmed: false,
    loading: false,
    newPassword: '',
  }),
  effects: {
    confirmResetPassword: effects => async state => {
      const url = window.location.hash.split('?')[1]
      const params = new URLSearchParams(url)
      const token = params.get('token')
      const tokenId = params.get('tokenId')
      if (token && tokenId) {
        state.loading = true
        const emailPassClient = state.serverInstance.auth.getProviderClient(
          UserPasswordAuthProviderClient.factory
        )
        try {
          await emailPassClient.resetPassword(token, tokenId, state.newPassword)
          state.confirmed = true
          effects.clearAccountConfirmtion()
        } catch (err) {
          effects.handleError(err)
        }
        state.loading = false
      }
    },
    handleNewPassword: (_, { target: { value } }) => state => ({
      ...state,
      newPassword: value,
    }),
    redirectToAuthenticate: () => (_, { history }) => {
      history.push('/authenticate')
    },
  },
})

const ConfirmReset = ({ effects, state }) => {
  return state.loading ? (
    <Col md={{ size: 2, offset: 5 }}>
      <img src={LoadingIcon} alt="Loading..." height="100" width="100" />
    </Col>
  ) : state.confirmed ? (
    <Card body>
      <CardTitle className="text-center" style={{ fontWeight: 'bold' }}>
        Confirmation de l'inscription
      </CardTitle>
      <CardBody>
        <p className="text-center">
          <CheckIcon color="green" /> &nbsp; Votre mot de passe a été bien
          réinitialisé
        </p>
        <div className="text-center">
          <Button color="light" onClick={effects.redirectToAuthenticate}>
            S'authentifier <ResendIcon />
          </Button>
        </div>
      </CardBody>
    </Card>
  ) : (
    <Card body>
      <CardTitle className="text-center" style={{ fontWeight: 'bold' }}>
        Réinitialisation du mot de passe
      </CardTitle>
      <CardBody>
        <Row>
          <Col md={{ size: 4, offset: 4 }}>
            <Form id="confirm-reset-password">
              <FormGroup>
                <Input
                  type="password"
                  placeholder="Entrez votre nouveau mot de passe!"
                  value={state.newPassword}
                  onChange={effects.handleNewPassword}
                  required
                />
              </FormGroup>
              <ActionButton
                text={
                  <span style={{ fontWeight: 'bold' }}>Reset password</span>
                }
                color="success"
                form="confirm-reset-password"
                action={effects.confirmResetPassword}
              />
            </Form>
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}

export default withState(injectState(ConfirmReset))
