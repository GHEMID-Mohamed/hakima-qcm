import ResendIcon from 'react-icons/lib/fa/refresh'
import GraduateIcon from 'react-icons/lib/fa/graduation-cap'
import moment from 'moment'
import React from 'react'
import {
  Badge,
  Card,
  CardBody,
  Button,
  ButtonGroup,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
} from 'reactstrap'
import { injectState, provideState } from 'reaclette'
import LoadingIcon from '../../imgs/button-spinner.gif'
import ExamWithAnswers from '../exam-with-answers'
import ReportExam from './report-exam'
import { map, remove, isEmpty, difference, last } from 'lodash'
import { ObjectId } from 'bson'

import CuteKoala from '../../imgs/cute_koala.jpg'

const RED_COLOR = '#bc1e10'
const GREEN_COLOR = '#408f0a'

const withState = provideState({
  initialState: () => ({
    examData: undefined,
    examLoading: false,
    badAnsweredQuestions: {},
    currentQuestionNum: 1,
    currentQuestionIndex: 1,
    selectedAnswers: [],
    answered: false,
    note: 0,
    examEnd: false,
    examMode: true,
    reviewMode: false,
  }),
  effects: {
    initialize: effects => async (state, { match, examId }) => {
      const _examId = (match && match.params && match.params.examId) || examId
      if (examId) {
        state.reviewMode = true
      }
      if (_examId) {
        state.examLoading = true
        try {
          const objectId = new ObjectId(_examId)
          const exam = await state.mongodb.find({ _id: objectId }).asArray()
          state.examData = exam.pop()
          effects.incrementViews(objectId, state.examData.seen || 0)
        } catch (error) {
          effects.handleError(error)
        }
        state.examLoading = false
      }
    },
    incrementViews: (effects, examId, views) => async state => {
      try {
        await state.mongodb.updateOne(
          {
            _id: examId,
          },
          {
            $set: {
              seen: views + 1,
            },
          },
          { upsert: true }
        )
      } catch (error) {
        effects.handleError(error)
      }
    },
    selectAnswer: (effects, answer) => state => {
      if (state.selectedAnswers.includes(answer)) {
        const _selectedAnswers = [...state.selectedAnswers]
        remove(_selectedAnswers, ans => ans === answer)
        state.selectedAnswers = _selectedAnswers
      } else {
        state.selectedAnswers = [...state.selectedAnswers, answer]
      }
    },
    nextQuestion: () => (state, props) => {
      if (state.isLastQuestion && state.answered) {
        state.examEnd = true
        props.onFinishExam &&
          props.onFinishExam({
            examId: state.examData._id,
            _module: state.examData.module,
            university: state.examData.university,
            examDate: state.examData.examDate,
            grade: state.note,
            maxGrade: state.questionsLength,
          })
      }
      if (!state.isLastQuestion && state.answered) {
        state.selectedAnswers = []
        const questionsIndexes = Object.keys(state.examData.exam)
        const indexOfCurrentQuestion = questionsIndexes.indexOf(
          String(state.currentQuestionNum)
        )
        state.currentQuestionNum = +questionsIndexes[indexOfCurrentQuestion + 1]
        state.answered = false
        state.currentQuestionIndex = state.currentQuestionIndex + 1 
      } else if (!state.answered) {
        state.answered = true
        const diff = difference(
          state.currentQuestion.correctAnswers,
          state.selectedAnswers
        )
        if (isEmpty(diff)) {
          // Good answer
          state.note = state.note + 1
        } else {
          // Bad answer
          state.badAnsweredQuestions = {
            ...state.badAnsweredQuestions,
            [state.currentQuestionNum]: state.currentQuestion,
          }
        }
      }
    },
    displayAllAnswers: () => state => ({
      ...state,
      examMode: false,
    }),
    repassBadAnsweredQuestion: () => state => {
      state.examData = {
        ...state.examData,
        exam: { ...state.badAnsweredQuestions },
      }
      state.selectedAnswers = []
      state.currentQuestionNum = +Object.keys(
        state.badAnsweredQuestions
      ).shift()
      state.answered = false
      state.examEnd = false
      state.note = 0
      state.badAnsweredQuestions = {}
      state.currentQuestionIndex = 1
    },
    setExamMode: () => state => ({
      ...state,
      examMode: true,
    }),
  },
  computed: {
    currentQuestion: ({ examData, currentQuestionNum }) => {
      if (examData) {
        return examData.exam[currentQuestionNum]
      }
    },
    isLastQuestion: ({ examData, currentQuestionNum }) =>
      examData
        ? +last(Object.keys(examData.exam)) === currentQuestionNum
        : false,
    questionsLength: ({ examData }) =>
      examData ? Object.keys(examData.exam).length : 0,
    allAnswersAreCorrect: ({ questionsLength, note }) =>
      questionsLength === note,
  },
})

const Exam = ({ state, effects, history }) => {
  const questionStyle = key => {
    if (state.answered && state.currentQuestion.correctAnswers.includes(key)) {
      return {
        backgroundColor: GREEN_COLOR,
        cursor: 'pointer',
        color: 'white',
        borderRadius: '10px',
      }
    } else if (
      state.answered &&
      !state.currentQuestion.correctAnswers.includes(key) &&
      state.selectedAnswers.includes(key)
    ) {
      return {
        backgroundColor: RED_COLOR,
        cursor: 'pointer',
        color: 'white',
        borderRadius: '10px',
      }
    } else if (!state.answered && state.selectedAnswers.includes(key)) {
      return {
        backgroundColor: '#7bc3d1',
        cursor: 'pointer',
        borderRadius: '10px',
      }
    } else {
      return { cursor: 'pointer', borderRadius: '10px' }
    }
  }
  return state.examMode ? (
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
          QCM&nbsp;
          <GraduateIcon size="25" />
        </h5>
      </span>
      <CardBody>
        {state.examLoading ? (
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
              <p className="text-muted text-center">Examen en chargement ...</p>
            </Col>
          </Row>
        ) : state.examEnd ? (
          <div style={{ marginTop: '20px' }}>
            <h4 className="text-center">
              <Badge color="light">
                Note&nbsp;&nbsp;
                <Badge color="dark">
                  {state.note} / {state.questionsLength}
                </Badge>
              </Badge>
            </h4>
            {!state.reviewMode && (
              <div className="text-center" style={{ margin: '15px' }}>
                <ButtonGroup vertical>
                  {!state.allAnswersAreCorrect && (
                    <Button outline onClick={effects.repassBadAnsweredQuestion}>
                      Repasser les questions mal répondus <ResendIcon />
                    </Button>
                  )}
                  <Button
                    outline
                    onClick={() => {
                      history.push('/examen')
                    }}
                  >
                    Passer un autre examen
                  </Button>
                  <Button outline onClick={effects.displayAllAnswers}>
                    Afficher toutes les réponses
                  </Button>
                </ButtonGroup>
              </div>
            )}
            <div className="text-center">
              <img src={CuteKoala} alt="koala" height="200" width="200" />
            </div>
          </div>
        ) : (
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
            <Row style={{ marginBottom: '10px' }}>
              <Col>
                {!state.reviewMode && (
                  <div className="float-left">
                    <Button
                      size="xs"
                      color="success"
                      outline
                      onClick={effects.displayAllAnswers}
                    >
                      Afficher toutes les réponses
                    </Button>
                  </div>
                )}
                <h4 className="float-right">
                  <Badge color="light">
                    {state.currentQuestionIndex} / {state.questionsLength}{' '}
                    <span className="text-muted">Questions</span>
                  </Badge>
                </h4>
              </Col>
            </Row>
            <Row>
              <Col>
                <Card body>
                  {state.currentQuestion && (
                    <div style={{ marginBottom: '10px' }}>
                      <h5>
                        <strong>{state.currentQuestionNum}</strong>.{' '}
                        {state.currentQuestion.question}
                      </h5>
                      <br />
                      <ListGroup>
                        {map(state.currentQuestion.answers, (answer, key) => (
                          <div style={{ marginBottom: '8px' }}>
                            <ListGroupItem
                              className="hvr-bounce-in"
                              style={questionStyle(key)}
                              onClick={() => effects.selectAnswer(key)}
                            >
                              <strong>{key}</strong>. {answer}
                            </ListGroupItem>
                          </div>
                        ))}
                      </ListGroup>
                    </div>
                  )}
                  <Row>
                    <Col>
                      <span className="float-left">
                        <ReportExam
                          _module={state.examData && state.examData.module}
                          examId={state.examData && state.examData._id}
                          questionNum={state.currentQuestionNum}
                          examDate={moment(
                            state.examData && state.examData.examDate
                          ).format('DD-MM-YYYY')}
                        />
                      </span>
                    </Col>
                    <Col>
                      <Button
                        color="dark"
                        className="float-right"
                        onClick={effects.nextQuestion}
                      >
                        {state.isLastQuestion && state.answered
                          ? 'Terminer'
                          : state.answered
                          ? 'Suivant >>'
                          : 'Corriger'}
                      </Button>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </CardBody>
    </Card>
  ) : (
    <ExamWithAnswers examData={state.examData} />
  )
}

export default withState(injectState(Exam))
