import React from 'react'
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  CardHeader,
  Row,
  Col,
} from 'reactstrap'
import { injectState, provideState } from 'reaclette'
import { ObjectId } from 'bson'
import LoadingIcon from '../../imgs/button-spinner.gif'
import scrollToComponent from 'react-scroll-to-component'
import { differenceBy } from 'lodash'

import FinishedExams from './finished-exams'
import UnfinishedExams from './unfinished-exams'
import Exam from '../../pass-exam/exam'
import CuteKoala from '../../imgs/cute_koala.jpg'

let finishedExamsRef, unfinishedExamsRef, examRef

const withState = provideState({
  initialState: () => ({
    examSessionLoading: true,
    currentExamId: undefined,
    review: undefined,
    unfinishedExams: undefined,
    finishedExams: undefined,
  }),
  effects: {
    initialize: effects => async (state, { match }) => {
      // await state.mongodb.deleteMany({ type: 'passed-exam' })
      const reviewId = match && match.params && match.params.reviewId
      if (reviewId) {
        state.examSessionLoading = true
        try {
          const objectId = new ObjectId(reviewId)
          const review = await state.mongodb.find({ _id: objectId }).asArray()
          state.review = review.pop()
        } catch (error) {
          effects.handleError(error)
        }
        state.examSessionLoading = false
      }
      await effects.getFinishedExams()
      await effects.getUnfinishedExams()
    },
    getFinishedExams: effects => async state => {
      try {
        const finishedExams = await state.mongodb
          .find({ type: 'passed-exam', reviewId: state.review._id })
          .asArray()
        state.finishedExams = finishedExams
      } catch (error) {
        effects.handleError(error)
      }
    },
    getUnfinishedExams: effects => async state => {
      try {
        const allExams = await state.mongodb
          .find(
            { type: 'exam', module: state.review.module, approved: true },
            {
              projection: {
                _id: 1,
                examDate: 1,
                university: 1,
                module: 1,
              },
            }
          )
          .asArray()
        state.unfinishedExams = differenceBy(
          allExams,
          state.finishedExams,
          'examDate'
        )
      } catch (error) {
        effects.handleError(error)
      }
    },
    handleExamSessionValues: (_, { target }) => state => ({
      ...state,
      [target.name]: target.value,
    }),
    passExam: (_, examId) => state => {
      state.currentExamId = undefined
      setTimeout(() => {
        state.currentExamId = examId
      }, 200)
    },
    onFinishExam: (
      effects,
      { examId, _module, university, examDate, grade, maxGrade }
    ) => async state => {
      await state.mongodb.updateOne(
        {
          module: _module,
          type: 'passed-exam',
          examId: new ObjectId(examId),
          reviewId: new ObjectId(state.review._id),
        },
        {
          $set: {
            type: 'passed-exam',
            reviewId: state.review._id,
            module: _module,
            examId,
            university,
            examDate,
            grade,
            maxGrade,
          },
        },
        { upsert: true }
      )
      await effects.getFinishedExams()
      await effects.getUnfinishedExams()
      scrollToComponent(finishedExamsRef, { offset: 0, align: 'top' })
    },
  },
  computed: {
    examStarted: ({ currentExamId }) => Boolean(currentExamId),
  },
})

const ExamSession = ({ effects, state, history }) =>
  state.examSessionLoading ? (
    <Row className="my-3">
      <Col md={{ size: 2, offset: 5 }}>
        <br />
        <div className="text-center">
          <img src={LoadingIcon} width="50" height="50" alt="Loading..." />
        </div>
        <p className="text-muted text-center">Examen en chargement ...</p>
      </Col>
    </Row>
  ) : (
    <div>
      <Row>
        <Col md="4">
          <Row style={{ marginBottom: '10px' }}>
            <Col>
              <FinishedExams
                history={history}
                finishedExams={state.finishedExams}
                ref={_ref => {
                  finishedExamsRef = _ref
                }}
                scrollToExam={() =>
                  scrollToComponent(examRef, { offset: 0, align: 'top' })
                }
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <UnfinishedExams
                history={history}
                unfinishedExams={state.unfinishedExams}
                ref={_ref => {
                  unfinishedExamsRef = _ref
                }}
                scrollToExam={() =>
                  scrollToComponent(examRef, { offset: 0, align: 'top' })
                }
              />
            </Col>
          </Row>
        </Col>
        <Col md="8">
          <Card className="h-100" outline>
            <CardBody>
              {state.examStarted ? (
                <Exam
                  examId={state.currentExamId}
                  onFinishExam={effects.onFinishExam}
                  ref={_ref => {
                    examRef = _ref
                  }}
                />
              ) : (
                <div>
                  <span style={{ fontWeight: 'bold' }}>
                    Révision du module{' '}
                    <span style={{ color: '#2098d1' }}>
                      {state.review.module}
                    </span>
                  </span>
                  <div
                    className="text-muted"
                    style={{
                      fontSize: '25px',
                      textAlign: 'center',
                      marginTop: '100px',
                    }}
                  >
                    Cliquez sur un examen pour le commencer
                    <div className="text-center" style={{ marginTop: '20px' }}>
                      <img
                        src={CuteKoala}
                        alt="koala"
                        height="200"
                        width="200"
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  )

export default withState(injectState(ExamSession))
