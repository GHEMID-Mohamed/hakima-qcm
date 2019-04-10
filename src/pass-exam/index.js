import React from 'react'
import { Row, Col } from 'reactstrap'
import { injectState, provideState } from 'reaclette'

import ExamExplorer from './exam-explorer'
import SearchExams from './search-exam'
import StatExams from '../stat-exams'

const withState = provideState({
  initialState: () => ({
    addExamView: false,
    initialExamData: undefined,
    examLoading: false,
  }),
  effects: {
    displayExamView: () => state => ({
      ...state,
      addExamView: true,
    }),
    hideExamView: () => state => ({
      ...state,
      addExamView: false,
    }),
  },
})

const PassExam = ({ effects, state, history }) => (
  <div style={{ marginTop: '20px' }}>
    <Row>
      <Col md="6">
        <Row>
          <Col>
            <SearchExams history={history} />
          </Col>
        </Row>
      </Col>
      <Col md="6">
        <ExamExplorer history={history} />
      </Col>
    </Row>
    <br />
    <Row>
      <Col>
        <StatExams />
      </Col>
    </Row>
  </div>
)

export default withState(injectState(PassExam))
