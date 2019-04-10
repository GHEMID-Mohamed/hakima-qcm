import React from 'react'
import { Row, Col } from 'reactstrap'
import { injectState } from 'reaclette'

import IdeaCard from './idea-card'
import SecurityCard from './security-card'
import SolutionCard from './solution-card'
import ProblemCard from './problem-card'

const IllustrationIdeaCard = ({ history, state }) => (
  <Row>
    <Col md="3" xs="12" style={{ marginBottom: '15px' }}>
      <ProblemCard />
    </Col>
    <Col md="3" xs="12" style={{ marginBottom: '15px' }}>
      <SolutionCard />
    </Col>
    <Col md="3" xs="12" style={{ marginBottom: '15px' }}>
      <IdeaCard />
    </Col>
    <Col md="3" xs="12" style={{ marginBottom: '15px' }}>
      <SecurityCard />
    </Col>
  </Row>
)

export default injectState(IllustrationIdeaCard)
