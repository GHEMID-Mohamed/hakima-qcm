import PlusIcon from 'react-icons/lib/fa/plus-square-o'
import MinusIcon from 'react-icons/lib/fa/minus-square-o'
import React from 'react'
import EyeIcon from 'react-icons/lib/fa/eye'
import moment from 'moment'
import StartIcon from 'react-icons/lib/fa/play-circle-o'
import { Badge, Button, Row, Col, Table } from 'reactstrap'
import { injectState, provideState } from 'reaclette'
import { map } from 'lodash'
import LoadingIcon from '../../../imgs/button-spinner.gif'

const withState = provideState({
  initialState: () => ({
    collapseExams: false,
    loadingExams: false,
    exams: undefined,
  }),
  effects: {
    toggleExams: effects => async state => {
      if (!state.collapseExams) {
        await effects.getExamsByYearAndUniv()
      }
      return {
        ...state,
        collapseExams: !state.collapseExams,
      }
    },
    getExamsByYearAndUniv: () => async (
      state,
      { year, university, _module }
    ) => {
      state.loadingExams = true
      const result = await state.mongodb
        .find(
          {
            type: 'exam',
            module: _module,
            university: university,
            examDate: {
              $lte: moment(`30/12/${year}`, 'DD-MM-YYYY').valueOf(),
              $gte: moment(`01/01/${year}`, 'DD-MM-YYYY').valueOf(),
            },
          },
          {
            sort: { examDate: -1 },
            projection: {
              _id: 1,
              examDate: 1,
              university: 1,
              module: 1,
              seen: 1,
            },
          }
        )
        .asArray()
      state.exams = result
      state.loadingExams = false
    },
  },
})

const UnivByYear = ({ state, effects, history, university }) => (
  <Row>
    <Col>
      <span
        style={{ cursor: 'pointer' }}
        onClick={effects.toggleExams}
        className="hvr-bounce-in"
      >
        {state.loadingExams ? (
          <img src={LoadingIcon} alt="loading" height="20" width="20" />
        ) : !state.collapseExams ? (
          <PlusIcon size="20" />
        ) : (
          <MinusIcon size="20" />
        )}
        {university}
      </span>
      {state.collapseExams && state.exams && state.exams.length === 0 && (
        <div style={{ marginLeft: '10px' }} className="text-muted">
          Pas d'examens trouvés
        </div>
      )}
      {state.collapseExams && state.exams && state.exams.length > 0 && (
        <Table hover size="sm">
          <tbody>
            {map(state.exams, exam => (
              <tr
                onClick={() => {
                  history.push(`/examen/${exam._id}`)
                }}
                style={{ cursor: 'pointer' }}
              >
                <td className="text-center">
                  <h5>
                    <Badge color="info">{exam.module}</Badge>
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
                    <Badge color="light">{exam.seen || 0}</Badge> &nbsp;
                    <EyeIcon size="20" />
                  </h5>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Col>
  </Row>
)

export default withState(injectState(UnivByYear))
