import PlusIcon from 'react-icons/lib/fa/plus-square-o'
import MinusIcon from 'react-icons/lib/fa/minus-square-o'
import React from 'react'
import { Row, Col } from 'reactstrap'
import { injectState, provideState } from 'reaclette'
import { map } from 'lodash'
import UnivByYear from '../univ-by-year'

const generateYears = () => {
  const years = []
  for (
    let y = new Date().getFullYear();
    y > new Date().getFullYear() - 15;
    y--
  ) {
    years.push(y)
  }
  return years
}

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

const ModuleByYear = ({ state, effects, history, _module }) => (
  <Row>
    <Col>
      <span
        style={{ cursor: 'pointer' }}
        onClick={effects.toggle}
        className="hvr-bounce-in"
      >
        {!state.collapse ? <PlusIcon size="20" /> : <MinusIcon size="20" />}{' '}
        {_module}
      </span>
      {state.collapse &&
        map(generateYears(), year => (
          <div style={{ marginLeft: '10px' }}>
            <UnivByYear _module={_module} year={year} history={history} />
          </div>
        ))}
    </Col>
  </Row>
)

export default withState(injectState(ModuleByYear))
