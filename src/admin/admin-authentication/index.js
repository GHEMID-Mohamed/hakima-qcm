import React from 'react'
import WorkBench from 'react-icons/lib/fa/wrench'
import { Card, Col, Form, FormGroup, Input, Row } from 'reactstrap'
import { injectState, provideState } from 'reaclette'
import { UserPasswordCredential } from 'mongodb-stitch-browser-sdk'

import ActionButton from '../../components/action-button'

const withState = provideState({
  initialState: () => ({
    id: '',
    password: '',
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
    loginAdmin: (effects, event) => async (state, props) => {
      if (event) {
        event.preventDefault()
      }
      if (state.id === 'admin@admin.dz') {
        try {
          const credential = new UserPasswordCredential(
            state.id,
            state.password
          )
          const authId = await state.serverInstance.auth.loginWithCredential(
            credential
          )
          effects.setAdminLogged()
        } catch (error) {
          effects.handleError(error)
        }
      } else {
        effects.notifyError('Mot de passe incorrect !')
      }
    },
  },
})

const AdminAuth = ({ effects, state }) => (
  <Card body style={{ marginTop: '50px' }}>
    <h3 className="text-center" style={{ marginBottom: '30px' }}>
      Administration <WorkBench />
    </h3>
    <Row>
      <Col>
        <Form id="login-form">
          <FormGroup>
            <Input
              type="email"
              placeholder="User !"
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
            action={effects.loginAdmin}
            form="login-form"
          />
          <br />
        </Form>
      </Col>
    </Row>
  </Card>
)

export default withState(injectState(AdminAuth))
