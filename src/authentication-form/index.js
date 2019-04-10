import React from 'react'
import { Col, Form, FormGroup, Input, Row } from 'reactstrap'
import { injectState, provideState } from 'reaclette'
import { UserPasswordCredential } from 'mongodb-stitch-browser-sdk'

import ResetPasswordForm from '../reset-password-form'
import ActionButton from '../components/action-button'

const withState = provideState({
  initialState: () => ({
    id: '',
    password: '',
    resetPasswordView: false,
  }),
  effects: {
    handleId: (_, { target: { value } }) => state => ({
      ...state,
      id: value,
    }),
    handlePassword: (_, { target: { value } }) => state => ({
      ...state,
      password: value,
    }),
    logIn: (effects, event) => async (state, props) => {
      if (event) {
        event.preventDefault()
      }

      try {
        const credential = new UserPasswordCredential(state.id, state.password)
        const authId = await state.serverInstance.auth.loginWithCredential(
          credential
        )
        await effects.signIn(authId.id)
        props.history.push('/')
      } catch (error) {
        effects.handleError(error)
      }
    },
    displayResetPassword: () => state => ({
      ...state,
      resetPasswordView: true,
    }),
  },
})

const AuthentificationForm = ({ effects, state }) => (
  <Row>
    <Col>
      <Form id="login-form">
        <FormGroup>
          <Input
            autoFocus
            type="email"
            placeholder="Email !"
            value={state.id}
            onChange={effects.handleId}
            required
          />
        </FormGroup>
        <FormGroup>
          <Input
            type="password"
            placeholder="Mot de passe !"
            value={state.password}
            onChange={effects.handlePassword}
            required
          />
        </FormGroup>
        <ActionButton
          text={<span style={{ fontWeight: 'bold' }}>Connexion</span>}
          color="info"
          action={effects.logIn}
          form="login-form"
        />
        <br />
        <p
          className="text-center text-muted"
          style={{
            textDecoration: 'underline',
            cursor: 'pointer',
          }}
          onClick={effects.displayResetPassword}
        >
          Mot de passe oublié !
        </p>
      </Form>
      {state.resetPasswordView && <ResetPasswordForm />}
    </Col>
  </Row>
)

export default withState(injectState(AuthentificationForm))
