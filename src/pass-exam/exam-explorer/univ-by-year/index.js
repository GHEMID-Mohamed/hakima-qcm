import PlusIcon from 'react-icons/lib/fa/plus-square-o'
import MinusIcon from 'react-icons/lib/fa/minus-square-o'
import React from 'react'
import { Row, Col } from 'reactstrap'
import { injectState, provideState } from 'reaclette'
import { map } from 'lodash'
import Universities from '../../../data/cities'
import ExamsByYearUniv from '../exams-by-year-univ'

const withState = provideState({
  initialState: () => ({
    collapse: false,
  }),
  effects: {
    toggle: () => state => {
      state.collapse = !state.collapse
    },
  },
})

const UnivByYear = ({ state, effects, year, _module, history }) => (
  <Row>
    <Col>
      <span
        style={{ cursor: 'pointer' }}
        onClick={effects.toggle}
        className="hvr-bounce-in"
      >
        {!state.collapse ? <PlusIcon size="20" /> : <MinusIcon size="20" />}{' '}
        {year}
      </span>
      {state.collapse &&
        map(Universities, university => (
          <div style={{ marginLeft: '10px' }}>
            <ExamsByYearUniv
              _module={_module}
              year={year}
              university={university.nom}
              history={history}
            />
          </div>
        ))}
    </Col>
  </Row>
)

export default withState(injectState(UnivByYear))
