import HistoryIcon from 'react-icons/lib/fa/history'
import React from 'react'
import { Card, CardBody, Button, CardText } from 'reactstrap'
import { injectState } from 'reaclette'

const PassedExams = ({ history }) => (
  <Card style={{ boxShadow: '0 3px 5px rgba(0,0,0,.1)' }} className="h-100">
    <span
      className="text-center"
      style={{
        backgroundColor: '#f5c018',
        display: 'block',
        cursor: 'pointer',
      }}
    >
      <h5 style={{ fontWeight: 'bold', marginTop: '10px' }}>
        Examens déjà passé&nbsp;
        <HistoryIcon size="25" />
      </h5>
    </span>
    <CardBody>
      <CardText style={{ textAlign: 'center' }} />
    </CardBody>
  </Card>
)

export default injectState(PassedExams)
