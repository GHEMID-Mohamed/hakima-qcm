import GraduateIcon from 'react-icons/lib/fa/graduation-cap'
import moment from 'moment'
import React from 'react'
import {
  Badge,
  Card,
  CardBody,
  Button,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
} from 'reactstrap'
import { injectState, provideState } from 'reaclette'
import { map } from 'lodash'

const GREEN_COLOR = '#408f0a'

const withState = provideState({
  initialState: ({ examData }) => ({ examData }),
})

const Exam = ({ state, effects, history }) => {
  return (
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
          QCM&nbsp;
          <GraduateIcon size="25" />
        </h5>
      </span>
      <CardBody>
        <div>
          <Row>
            <Col>
              <h4>
                <Badge color="light" className="float-left">
                  {state.examData && state.examData.university}
                </Badge>
              </h4>
            </Col>
            <Col>
              <h4 className="text-center">
                <Badge color="dark">
                  {state.examData && state.examData.module}
                </Badge>
              </h4>
            </Col>
            <Col>
              <h4>
                <Badge color="light" className="float-right">
                  {moment(state.examData && state.examData.examDate).format(
                    'DD-MM-YYYY'
                  )}
                </Badge>
              </h4>
            </Col>
          </Row>
          <Row>
            <Col md={{ size: 8, offset: 2 }}>
              {map(
                state.examData.exam,
                (currentQuestion, currentQuestionNum) => (
                  <Card body style={{ marginBottom: '10px' }}>
                    {state.currentQuestion && (
                      <div style={{ marginBottom: '10px' }}>
                        <h5>
                          {currentQuestionNum}. {currentQuestion.question}
                        </h5>
                        <br />
                        <ListGroup>
                          {map(currentQuestion.answers, (answer, key) => (
                            <div style={{ marginBottom: '8px' }}>
                              <ListGroupItem
                                style={
                                  currentQuestion.correctAnswers.includes(key)
                                    ? {
                                        backgroundColor: GREEN_COLOR,
                                        cursor: 'pointer',
                                        color: 'white',
                                        borderRadius: '10px',
                                      }
                                    : {
                                        cursor: 'pointer',
                                        borderRadius: '10px',
                                      }
                                }
                              >
                                {key}. {answer}
                              </ListGroupItem>
                            </div>
                          ))}
                        </ListGroup>
                      </div>
                    )}
                  </Card>
                )
              )}
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="text-center">
                <Button color="dark" onClick={effects.setExamMode}>
                  Passer cet examen
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      </CardBody>
    </Card>
  )
}

export default withState(injectState(Exam))
