import React, { Fragment } from 'react'
import MobileIcon from 'react-icons/lib/fa/mobile'
import { Card, Row, Col } from 'reactstrap'
import { injectState, provideState } from 'reaclette'

import ContributeCard from '../contribute-card'
import ExamCard from '../exam-card'
import IllustrationIdeaCard from '../illustration-idea-cards'
import MobileAppNav from '../mobile-app-nav'
import PublishedExams from '../published-exams'

const withState = provideState({
  initialState: () => ({
    activeTab: 'authentication',
    launchedFromAPK: false,
  }),
  effects: {
    initialize: () => state => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        state.launchedFromAPK = true
      }
    },
    toggle: (_, activeTab) => state => ({
      ...state,
      activeTab,
    }),
  },
})

const Home = ({ effects, state, history }) => (
  <div>
    {state.launchedFromAPK && (
      <Fragment>
        <MobileAppNav history={history} />
        <br />
      </Fragment>
    )}
    <IllustrationIdeaCard />
    <br />
    <Row>
      <Col md="6" style={{ marginBottom: '15px' }}>
        <PublishedExams history={history} />
      </Col>
      <Col md="3" style={{ marginBottom: '15px' }}>
        <ContributeCard history={history} />
      </Col>
      <Col md="3" style={{ marginBottom: '15px' }}>
        <ExamCard history={history} />
      </Col>
    </Row>
    <br />
    <Row>
      <Col md={{ size: 8, offset: 2 }}>
        <Card body>
          <div className="text-center">
            <h3>
              <MobileIcon /> Installer l'application mobile
            </h3>
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/-Onz3dP4wm0"
              frameborder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            />
          </div>
        </Card>
      </Col>
    </Row>
  </div>
)

export default withState(injectState(Home))
