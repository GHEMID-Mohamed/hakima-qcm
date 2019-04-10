import Cookies from 'js-cookie'
import React from 'react'
import { Col, Form, FormFeedback, FormGroup, Input, Row } from 'reactstrap'
import { map } from 'lodash'
import { injectState, provideState } from 'reaclette'
import { UserPasswordAuthProviderClient } from 'mongodb-stitch-browser-sdk'

// import * as Api from '../../api'
import Universities from '../data/cities'
import ActionButton from '../components/action-button'
import CockIcon from 'react-icons/lib/fa/clock-o'

const withState = provideState({
  initialState: () => ({
    id: '',
    password: '',
    passwordConfirmation: '',
    university: '',
  }),
  effects: {
    handleUniversityChange: (_, { target: { value } }) => state => {
      Cookies.set('university', value)
      return {
        ...state,
        university: value,
      }
    },
    handleId: (_, { target: { value } }) => (state, { history }) => {
      return {
        ...state,
        id: value,
      }
    },
    handlePassword: (_, { target: { value } }) => state => ({
      ...state,
      password: value,
    }),
    handlePasswordConfirmation: (_, { target: { value } }) => state => ({
      ...state,
      passwordConfirmation: value,
    }),
    submit: (effects, event) => async (state, { history }) => {
      if (event) {
        event.preventDefault()
      }

      if (state.isValidPasswordConfirmation) {
        const emailPassClient = state.serverInstance.auth.getProviderClient(
          UserPasswordAuthProviderClient.factory
        )

        try {
          await emailPassClient.registerWithEmail(state.id, state.password)
          Cookies.set('authEmail', state.id)
          history.push('/confirm')
        } catch (error) {
          effects.handleError(error)
        }
      }
    },
  },
  computed: {
    isValidPasswordConfirmation: ({ passwordConfirmation, password }) =>
      password === passwordConfirmation,
  },
})

const CreateAccount = ({ effects, state }) => (
  <Row>
    <Col>
      <div className="text-center text-muted" style={{ marginBottom: '10px' }}>
        Créer un compte en 2 secondes <CockIcon />
      </div>
      <Form id="creation-form">
        <FormGroup>
          <Input
            autoFocus
            type="email"
            placeholder="Votre email !"
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
        <FormGroup>
          <Input
            type="password"
            placeholder="Encore le même mot de passe !"
            value={state.passwordConfirmation}
            onChange={effects.handlePasswordConfirmation}
            required
            invalid={!state.isValidPasswordConfirmation}
          />
          <FormFeedback>
            Les mots de passes ne sont pas identiques !
          </FormFeedback>
        </FormGroup>
        <FormGroup>
          <Input
            name="university"
            onChange={effects.handleUniversityChange}
            required
            type="select"
            value={state.university}
          >
            <option value="">Faculté *</option>
            {Universities &&
              map(Universities, university => (
                <option key={university.code} value={university.nom}>
                  {`${university.code} - ${university.nom}`}
                </option>
              ))}
          </Input>
        </FormGroup>
        <ActionButton
          text={<span style={{ fontWeight: 'bold' }}>Inscription</span>}
          color="info"
          action={effects.submit}
          form="creation-form"
        />
      </Form>
    </Col>
  </Row>
)

export default withState(injectState(CreateAccount))
