import React from 'react'
import BankIcon from 'react-icons/lib/fa/bank'
import ModuleIcon from 'react-icons/lib/fa/medkit'
import EyeIcon from 'react-icons/lib/fa/eye'
import StartIcon from 'react-icons/lib/fa/play-circle-o'
import moment from 'moment'
import { Badge, Button, Card, CardBody, Table, Row, Col } from 'reactstrap'
import { injectState } from 'reaclette'
import { map } from 'lodash'
import PublishedIcon from 'react-icons/lib/fa/cloud-upload'

import LoadingIcon from '../imgs/button-spinner.gif'
import ExclamationIcon from 'react-icons/lib/fa/exclamation'

import '../style/hover.css'

const PublishedExams = ({ state, history }) => (
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
      <h5 style={{ marginTop: '10px' }}>
        Examens ajoutés Récements&nbsp;&nbsp;
        <PublishedIcon size="25" />
      </h5>
    </span>
    <CardBody>
      <Table hover size="sm">
        <tbody>
          {!state.lastPostedExams ? (
            <Row className="my-3">
              <Col md={{ size: 2, offset: 5 }}>
                <br />
                <div className="text-center">
                  <img
                    src={LoadingIcon}
                    width="50"
                    height="50"
                    alt="Loading..."
                  />
                </div>
              </Col>
            </Row>
          ) : state.lastPostedExams && state.lastPostedExams.length === 0 ? (
            <h3 className="text-center text-muted">
              <br />
              Pas d'examens ajoutés :( &nbsp;
              <ExclamationIcon size="30" />
              <br />
            </h3>
          ) : (
            map(state.lastPostedExams, exam => (
              <tr
                onClick={() => {
                  history.push(`/examen/${exam._id}`)
                }}
                style={{ cursor: 'pointer' }}
              >
                <td>
                  <h5>
                    <Badge color="info">
                      <ModuleIcon />
                      &nbsp;{exam.module}
                    </Badge>
                  </h5>
                </td>
                <td>
                  <h5>
                    <Badge color="light">
                      {moment(exam.examDate).format('DD-MM-YYYY')}
                    </Badge>
                  </h5>
                </td>
                <td>
                  <h5>
                    <Badge color="light">
                      <BankIcon /> {exam.university}
                    </Badge>
                  </h5>
                </td>
                <td className="align-items-center">
                  <h6>
                    <EyeIcon size="18" color="gray" />
                    &nbsp;
                    <Badge color="light">{exam.seen || 0}</Badge>
                  </h6>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </CardBody>
  </Card>
)

export default injectState(PublishedExams)
