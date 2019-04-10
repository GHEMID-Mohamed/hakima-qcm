import BookIcon from 'react-icons/lib/fa/book'
import React from 'react'
import Modules from '../../data/modules'
import { Card, CardBody } from 'reactstrap'
import { injectState } from 'reaclette'
import { map } from 'lodash'
import ModuleByYear from './module-by-year'

const ExamExplorer = ({ state, history }) => (
  <Card style={{ boxShadow: '0 3px 5px rgba(0,0,0,.1)' }} className="h-100">
    <span
      className="text-center hvr-bounce-to-right"
      style={{
        backgroundColor: '#7bc3d1',
        color: 'white',
        display: 'block',
        cursor: 'pointer',
      }}
    >
      <h5 style={{ fontWeight: 'bold', marginTop: '10px' }}>
        Explorateur d'examens&nbsp;
        <BookIcon size="25" />
      </h5>
    </span>
    <CardBody
      style={{
        height: '300px',
        overflow: 'scroll',
        overflowX: 'hidden',
        fontSize: '18px',
      }}
    >
      {map(Modules, _module => (
        <ModuleByYear history={history} _module={_module} />
      ))}
    </CardBody>
  </Card>
)

export default injectState(ExamExplorer)
