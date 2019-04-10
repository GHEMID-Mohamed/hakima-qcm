import React, { Fragment } from 'react'
import {
  Nav,
  TabContent,
  TabPane,
  NavItem,
  NavLink,
  Row,
  Col,
} from 'reactstrap'
import { injectState, provideState } from 'reaclette'

import AdminAuth from './admin-authentication'
import AdminExams from './admin-exams'
import Reports from './admin-reports'
import Messages from './admin-messages'
import classnames from 'classnames'

const withState = provideState({
  initialState: () => ({
    activeTab: "Approbation d'examns", // Signalisation d'examens || Messages utilisateurs
  }),
  effects: {
    toggle: (_, activeTab) => state => ({
      ...state,
      activeTab,
    }),
  },
})

const Admin = ({ effects, state, history }) => (
  <Row>
    <Col>
      {state.adminLogged && (
        <Fragment>
          <Nav tabs fill>
            <NavItem style={{ cursor: 'pointer', fontWeight: 'bold' }}>
              <NavLink
                className={classnames({
                  active: state.activeTab === "Approbation d'examns",
                })}
                onClick={() => {
                  effects.toggle("Approbation d'examns")
                }}
              >
                Approbation d'examns
              </NavLink>
            </NavItem>
            <NavItem style={{ cursor: 'pointer', fontWeight: 'bold' }}>
              <NavLink
                className={classnames({
                  active: state.activeTab === "Signalisation d'examens",
                })}
                onClick={() => {
                  effects.toggle("Signalisation d'examens")
                }}
              >
                Signalisation d'examens
              </NavLink>
            </NavItem>
            <NavItem style={{ cursor: 'pointer', fontWeight: 'bold' }}>
              <NavLink
                className={classnames({
                  active: state.activeTab === 'Messages utilisateurs',
                })}
                onClick={() => {
                  effects.toggle('Messages utilisateurs')
                }}
              >
                Messages utilisateurs
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={state.activeTab}>
            <TabPane tabId="Approbation d'examns">
              <AdminExams history={history} />
            </TabPane>
            <TabPane tabId="Signalisation d'examens">
              <Reports history={history} />
            </TabPane>
            <TabPane tabId="Messages utilisateurs">
              <Messages history={history} />
            </TabPane>
          </TabContent>
        </Fragment>
      )}

      {!state.adminLogged && (
        <Row>
          <Col md={{ size: 4, offset: 4 }}>
            <AdminAuth
              onAdminLogged={effects.setAdminLogged}
              history={history}
            />
          </Col>
        </Row>
      )}
    </Col>
  </Row>
)

export default withState(injectState(Admin))
