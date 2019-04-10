import IncompletedIcon from 'react-icons/lib/md/timelapse'
import StartIcon from 'react-icons/lib/fa/play-circle-o'
import React from 'react'
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

const UnfinishedExams = ({
  effects,
  state,
  unfinishedExams,
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
      <IncompletedIcon size="20" /> Examens non finis
    </CardHeader>
    <CardBody>
      {unfinishedExams === undefined ? (
        <div className="text-center">
          <img src={LoadingIcon} width="20" height="20" alt="Loading..." />
        </div>
      ) : unfinishedExams && unfinishedExams.length === 0 ? (
        <div className="text-center text-muted">
          Vous avez passer tous les examens. Essayez d'améliorer votre niveau en
          repassant les examens déjà finis&nbsp;
          <br />
        </div>
      ) : (
        <Table size="sm" hover borderless>
          <tbody>
            {map(unfinishedExams, exam => (
              <tr
                onClick={() => {
                  effects.passExam(exam._id)
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
            ))}
          </tbody>
        </Table>
      )}
    </CardBody>
  </Card>
)

export default withState(injectState(UnfinishedExams))
