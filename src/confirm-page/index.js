import Cookies from 'js-cookie'
import EnvelopeIcon from 'react-icons/lib/fa/envelope'
import ResendIcon from 'react-icons/lib/fa/refresh'
import CheckIcon from 'react-icons/lib/fa/check'
import React from 'react'
import { Alert, Button, Card, CardBody, CardTitle, Col, Row } from 'reactstrap'
import { injectState, provideState } from 'reaclette'
import { UserPasswordAuthProviderClient } from 'mongodb-stitch-browser-sdk'

import LoadingIcon from '../imgs/button-spinner.gif'
import ActionButton from '../components/action-button'

const withState = provideState({
  initialState: () => ({
    confirmed: false,
    loading: false,
    emailResent: false,
  }),
  effects: {
    initialize: effects => async state => {
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
          await emailPassClient.confirmUser(token, tokenId)
          state.confirmed = true
        } catch (err) {
          effects.handleError(err)
        }
        state.loading = false
      }
    },
    redirectToAuthenticate: () => (_, { history }) => {
      history.push('/authenticate')
    },
    resendEmail: effects => async state => {
      const emailPassClient = state.serverInstance.auth.getProviderClient(
        UserPasswordAuthProviderClient.factory
      )
      const userEmail = Cookies.get('authEmail')
      if (userEmail) {
        try {
          console.log('Mail resent to ', userEmail)
          await emailPassClient.resendConfirmationEmail(userEmail)
          state.emailResent = true
        } catch (err) {
          effects.handleError(err)
        }
      }
    },
  },
})

const ConfirmPage = ({ effects, state }) => {
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
        <p className="text-center" style={{ fontSize: '18px' }}>
          <CheckIcon color="green" /> &nbsp; Votre inscription est confrimé avec
          succés, veuillez vous identifier pour activer votre compte
        </p>
        <div className="text-center">
          <Button color="warning" onClick={effects.redirectToAuthenticate}>
            S'authentifier
          </Button>
        </div>
      </CardBody>
    </Card>
  ) : (
    <Card body>
      <CardTitle className="text-center" style={{ fontWeight: 'bold' }}>
        Confirmation de l'inscription
      </CardTitle>
      <CardBody>
        <p className="text-center" style={{ fontSize: '18px' }}>
          Vite! vite! Consultez votre email pour confirmer votre inscription{' '}
          <EnvelopeIcon />
        </p>
        <Row>
          <Col md={{ size: 4, offset: 4 }}>
            <ActionButton
              text={
                <span>
                  Renvoyer l'email de confirmation <ResendIcon />
                </span>
              }
              action={effects.resendEmail}
            />
            <br />
            {state.emailResent && (
              <Alert color="success" className="text-center">
                Email renvoyer avec succés
              </Alert>
            )}
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}

export default withState(injectState(ConfirmPage))
