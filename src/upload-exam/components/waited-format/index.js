import React, { Fragment } from 'react'
import { Card, CardTitle, Row, Col, Input } from 'reactstrap'
import { injectState, provideState } from 'reaclette'

const withState = provideState({
  initialState: () => ({
    waitedFormat: `
    1. Le psoriasis est.
      A. Une dermatose auto-immune
      B. Une dermatose auto-inflammatoire
      C. Une dermatose infectieuse
      D. Qui touche la peau exclusivement
      E. Qui évolue d'un seul tenant
    Rep: B

    2. Le psoriasis à début précoce est.
      A. Associé surtout au gène PSORS4
      B. Associé surtout au gène PSORS1
      C. Associé fortement à l'allèle HLA-Cw*602
      D. Rare
      E. Plus sévère dans son étendu
    Rep: B, C, E

    ETC ...
    `,
  }),
  effects: {},
})

const WaitedFormat = ({ effects, state, history }) => (
  <Card body className="h-100">
    <CardTitle className="text-center text-muted">Format attendu</CardTitle>
    <Input
      type="textarea"
      disabled={true}
      value={state.waitedFormat}
      style={{ height: '400px' }}
    />
  </Card>
)

export default withState(injectState(WaitedFormat))
