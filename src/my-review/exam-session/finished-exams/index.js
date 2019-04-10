import CompletedIcon from 'react-icons/lib/md/check'
import InfoIcon from 'react-icons/lib/fa/info-circle'
import React, { Fragment } from 'react'
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardTitle,
  CardHeader,
  Row,
  Col,
  Table,
  UncontrolledTooltip,
} from 'reactstrap'
import { injectState, provideState } from 'reaclette'
import { ObjectId } from 'bson'
import LoadingIcon from '../../../imgs/button-spinner.gif'
import { map } from 'lodash'

import moment from 'moment'

const withState = provideState({
  initialState: () => ({}),
  effects: {},
})

const FinishedExams = ({
  effects,
  state,
  finishedExams,
  history,
  scrollToExam,
}) => (
  <Card
    // className="h-100"
    style={{
      height: '300px',
      overflow: 'scroll',
      overflowX: 'hidden',
    }}
  >
    <CardHeader style={{ fontWeight: 'bold' }} className="hvr-bounce-to-right">
      <CompletedIcon size="20" /> Examens finis{' '}
      <InfoIcon
        className="float-right"
        color="gray"
        size="20"
        id="finished-exams"
      />
      <UncontrolledTooltip target="finished-exams" placement="top">
        Remontez encore le niveau, cliquez sur un examen pour le repasser !
      </UncontrolledTooltip>
    </CardHeader>
    <CardBody>
      {finishedExams === undefined ? (
        <div className="text-center">
          <img src={LoadingIcon} width="20" height="20" alt="Loading..." />
        </div>
      ) : finishedExams && finishedExams.length === 0 ? (
        <div className="text-center text-muted">
          Vous n'avez réviser aucun examen !&nbsp;
          <br />
        </div>
      ) : (
        <Table size="sm" borderless hover>
          <tbody>
            {map(finishedExams, exam => (
              <Fragment>
                <tr
                  onClick={() => {
                    effects.passExam(exam.examId)
                    scrollToExam()
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <td className="text-center">
                    <h5>
                      <Badge color="info">{exam.module}</Badge>
                    </h5>
                  </td>
                  <td className="text-center">
                    <h5>
                      <Badge color="info">{exam.university}</Badge>
                    </h5>
                  </td>
                  <td>
                    <h5>
                      <Badge color="light">
                        {moment(exam.examDate).format('DD-MM-YYYY')}
                      </Badge>
                    </h5>
                  </td>
                </tr>
                <tr>
                  <td align="center" colspan="3">
                    <span className="progress">
                      <span
                        className="progress-bar progress-bar-striped"
                        role="progressbar"
                        style={{
                          width: `${(exam.grade * 100) / exam.maxGrade}%`,
                        }}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      />
                    </span>
                    <span className="badge badge-light float-right">
                      {`${exam.grade}/${exam.maxGrade}`}
                    </span>
                  </td>
                </tr>
              </Fragment>
            ))}
          </tbody>
        </Table>
      )}
    </CardBody>
  </Card>
)

export default withState(injectState(FinishedExams))
