import AddExamIcon from 'react-icons/lib/md/control-point'
import ExclamationIcon from 'react-icons/lib/fa/exclamation'
import ModuleIcon from 'react-icons/lib/fa/medkit'
import SearchIcon from 'react-icons/lib/fa/search'
import StartIcon from 'react-icons/lib/fa/play-circle-o'
import React, { Fragment } from 'react'
import EyeIcon from 'react-icons/lib/fa/eye'
import moment from 'moment'
import {
  Badge,
  Card,
  CardBody,
  Button,
  CardText,
  Form,
  FormGroup,
  Input,
  Table,
} from 'reactstrap'
import { injectState, provideState } from 'reaclette'
import { map } from 'lodash'

import ActionButton from '../../components/action-button'
import CuteKoala from '../../imgs/cute_koala.jpg'
import Universities from '../../data/cities'
import Modules from '../../data/modules'

const generateYears = () => {
  const years = []
  for (
    let y = new Date().getFullYear();
    y > new Date().getFullYear() - 25;
    y--
  ) {
    years.push(y)
  }
  return years
}

const withState = provideState({
  initialState: () => ({
    module: '',
    year: '',
    _university: '',
    searchResult: undefined,
  }),
  effects: {
    handleExamValues: (_, { target }) => state => ({
      ...state,
      [target.name]: target.value,
    }),
    handleSearchExam: () => async state => {
      let _examDate = {}
      if (state.year !== '') {
        _examDate = {
          examDate: {
            $lte: moment(`30/12/${state.year}`, 'DD-MM-YYYY').valueOf(),
            $gte: moment(`01/01/${state.year}`, 'DD-MM-YYYY').valueOf(),
          },
        }
      }
      const result = await state.mongodb
        .find(
          {
            type: 'exam',
            module: state.module,
            university: state._university,
            ..._examDate,
          },
          {
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
      state.searchResult = result
    },
  },
})

const SearchExams = ({ history, state, effects }) => (
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
        Chercher un examen &nbsp;
        <SearchIcon size="25" />
      </h5>
    </span>
    <CardBody>
      <CardText>
        <Form id="search-exam-form">
          <FormGroup>
            <Input
              name="module"
              onChange={effects.handleExamValues}
              required
              type="select"
              value={state.module}
              disabled={state.addExamStarted}
            >
              <option value="">Module *</option>
              {Modules &&
                map(Modules, module => (
                  <option key={module} value={module}>
                    {module}
                  </option>
                ))}
            </Input>
          </FormGroup>
          <FormGroup>
            <Input
              name="_university"
              onChange={effects.handleExamValues}
              required
              type="select"
              value={state._university}
              disabled={state.addExamStarted}
            >
              <option value="">Université *</option>
              {Universities &&
                map(Universities, university => (
                  <option key={university.code} value={university.nom}>
                    {`${university.code} - ${university.nom}`}
                  </option>
                ))}
            </Input>
          </FormGroup>
          <FormGroup>
            <Input
              name="year"
              onChange={effects.handleExamValues}
              type="select"
              value={state.year}
            >
              <option value="">Année</option>
              {Modules &&
                map(generateYears(), year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
            </Input>
          </FormGroup>
          <ActionButton
            text={
              <span>
                Chercher &nbsp; <SearchIcon />
              </span>
            }
            action={effects.handleSearchExam}
            block={true}
            form="search-exam-form"
          />
        </Form>
        <br />
        {state.searchResult !== undefined ? (
          <Fragment>
            <span className="text-muted">Résultat de recherches</span>
            <hr />
          </Fragment>
        ) : (
          <div className="text-center">
            <img src={CuteKoala} alt="koala" height="200" width="200" />
          </div>
        )}
        <div>
          {state.searchResult && state.searchResult.length === 0 ? (
            <div className="text-center text-muted">
              <br />
              <h3>
                Pas d'examens trouvés :( &nbsp;
                <ExclamationIcon size="30" />
              </h3>
              <br />
              <div>
                <Button
                  color="warning"
                  onClick={() => {
                    if (state.logged) {
                      history.push(
                        `/contribuer?module=${state.module}&university=${
                          state._university
                        }`
                      )
                    } else {
                      history.push('/authenticate')
                    }
                  }}
                >
                  Saisir cet examen <AddExamIcon size="18" />
                </Button>
              </div>
            </div>
          ) : (
            <Table size="sm" hover>
              <tbody>
                {map(state.searchResult, exam => (
                  <tr
                    onClick={() => {
                      history.push(`/examen/${exam._id}`)
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <td className="text-center">
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
                        <Badge color="light">{exam.seen || 0}</Badge> &nbsp;
                        <EyeIcon size="20" />
                      </h5>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </CardText>
    </CardBody>
  </Card>
)

export default withState(injectState(SearchExams))
