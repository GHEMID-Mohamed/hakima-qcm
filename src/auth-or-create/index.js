import PersonAdd from 'react-icons/lib/fa/user-plus'
import Person from 'react-icons/lib/fa/user'
import React from 'react'
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Row,
  Card,
  Col,
} from 'reactstrap'
import classnames from 'classnames'
import { injectState, provideState } from 'reaclette'

import AuthenticationForm from '../authentication-form'
import CreateAccount from '../create-account'

const navStyle = {
  cursor: 'pointer',
}

const withState = provideState({
  initialState: () => ({
    activeTab: 'authentication',
  }),
  effects: {
    initialize: () => state => {
      const params = new URLSearchParams(window.location.hash.split('?')[1])
      state.activeTab = params.get('toggle') || 'authentication'
    },
    toggle: (_, activeTab) => state => ({
      ...state,
      activeTab,
    }),
  },
})

const AuthOrCreate = ({ effects, state, history }) => (
  <Row>
    <Col md={{ size: 4, offset: 4 }} style={{ marginTop: '50px' }}>
      <Card className="h-100" style={{ boxShadow: '0 3px 5px rgba(0,0,0,.1)' }}>
        <Nav tabs fill>
          <NavItem style={navStyle}>
            <NavLink
              className={classnames({
                active: state.activeTab === 'authentication',
              })}
              onClick={() => {
                effects.toggle('authentication')
              }}
              style={
                state.activeTab === 'authentication'
                  ? { color: '#0e627f', fontWeight: 'bold' }
                  : {}
              }
            >
              <Person /> &nbsp;Authentification
            </NavLink>
          </NavItem>
          <NavItem style={navStyle}>
            <NavLink
              className={classnames({
                active: state.activeTab === 'createAccount',
              })}
              onClick={() => {
                effects.toggle('createAccount')
              }}
              style={
                state.activeTab === 'createAccount'
                  ? { color: '#0e627f', fontWeight: 'bold' }
                  : {}
              }
            >
              <PersonAdd /> &nbsp;Créer un compte
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={state.activeTab}>
          <TabPane tabId="authentication" style={{ padding: '20px' }}>
            <Row>
              <Col sm="12">
                <AuthenticationForm history={history} />
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="createAccount" style={{ padding: '20px' }}>
            <Row>
              <Col sm="12">
                <CreateAccount history={history} />
              </Col>
            </Row>
          </TabPane>
        </TabContent>
      </Card>
    </Col>
  </Row>
)

export default withState(injectState(AuthOrCreate))
