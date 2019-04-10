import AngleDownIcon from 'react-icons/lib/fa/angle-down'
import TrashIcon from 'react-icons/lib/fa/trash'
import EditIcon from 'react-icons/lib/fa/pencil'
import InfoIcon from 'react-icons/lib/fa/info-circle'
import PlusIcon from 'react-icons/lib/fa/plus'
import React, { Fragment } from 'react'
import {
  Badge,
  Card,
  Col,
  Collapse,
  Row,
  Button,
  ButtonGroup,
  Form,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
} from 'reactstrap'
import { injectState, provideState } from 'reaclette'
import { map } from 'lodash'

import ModalImg from '../components/modal-img'
import ActionButton from '../components/action-button'
import CorrectAnswersPicture from '../imgs/exam-correct-answers.png'

const withState = provideState({
  initialState: ({ answers, correctAnswers, question, lastIndex }) => ({
    question: question || '',
    questionNum: lastIndex,
    A: (answers && answers.A) || '',
    B: (answers && answers.B) || '',
    C: (answers && answers.C) || '',
    D: (answers && answers.D) || '',
    E: (answers && answers.E) || '',
    correctAnswers: correctAnswers || [],
    validatedQuestion: true,
    firstRender: true,
    modalCorrectAnswers: false,
    correctAnswersRequired: false,
  }),
  effects: {
    initialize: () => (state, { question }) => {
      if (state.alreadyValidatedQuestion) {
        state.validatedQuestion = true
      }
    },
    toggleCorrectAnswersPicture: () => state => ({
      modalCorrectAnswers: !state.modalCorrectAnswers,
    }),
    addQuestion: () => (state, props) => {
      if (state.correctAnswers.length === 0) {
        state.correctAnswersRequired = true
      } else {
        const questionData = {
          [state.questionNum]: {
            question: state.question,
            answers: {
              A: state.A,
              B: state.B,
              C: state.C,
              D: state.D,
              E: state.E,
            },
            correctAnswers: state.correctAnswers,
          },
        }
        props.onAddQuestion(questionData)
        state.validatedQuestion = true
        state.firstRender = false
      }
    },
    handleQuestionValues: (_, { target }) => state => ({
      ...state,
      [target.name]: target.value,
    }),
    handleCorrectAnswer: (_, selected) => state => {
      state.correctAnswersRequired = false
      const index = state.correctAnswers.indexOf(selected)
      if (index < 0) {
        state.correctAnswers.push(selected)
      } else {
        state.correctAnswers.splice(index, 1)
      }
      return {
        ...state,
        correctAnswers: [...state.correctAnswers],
      }
    },
    toggleQuestion: () => state => {
      state.validatedQuestion = !state.validatedQuestion
    },
  },
  computed: {
    alreadyValidatedQuestion: (_, { question }) => question,
  },
})

const QuestionForm = ({
  effects,
  state,
  lastIndex,
  onDeleteLastQuestion,
  isLastQuestion,
}) => (
  <div>
    <InputGroup style={{ marginBottom: '16px' }}>
      <Input
        style={{ fontWeight: 'bold' }}
        disabled
        value={`Question ${state.questionNum}`}
      />
      <Input disabled value={`Réponses ${state.correctAnswers}`} />
      <InputGroupAddon addonType="prepend">
        <Button onClick={effects.toggleQuestion} outline>
          {!state.validatedQuestion ? <AngleDownIcon /> : <EditIcon />}
        </Button>
      </InputGroupAddon>
    </InputGroup>
    <Collapse isOpen={!state.validatedQuestion}>
      <Card body style={{ marginBottom: '30px' }}>
        <Form id={`question-form-${lastIndex + 1}`}>
          <Row>
            <Col>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>{`Question ${
                    state.questionNum
                  }`}</InputGroupText>
                </InputGroupAddon>
                <Input
                  autoFocus
                  name="question"
                  onChange={effects.handleQuestionValues}
                  required
                  type="text"
                  placeholder="Question *"
                  value={state.question}
                />
              </InputGroup>
              <FormGroup />
            </Col>
          </Row>
          <Row>
            <Col>
              <FormGroup>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">A</InputGroupAddon>
                  <Input
                    name="A"
                    value={state.A}
                    onChange={effects.handleQuestionValues}
                    placeholder="Proposition A"
                    required
                  />
                </InputGroup>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormGroup>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">B</InputGroupAddon>
                  <Input
                    name="B"
                    value={state.B}
                    onChange={effects.handleQuestionValues}
                    placeholder="Proposition B"
                    required
                  />
                </InputGroup>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormGroup>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">C</InputGroupAddon>
                  <Input
                    name="C"
                    value={state.C}
                    onChange={effects.handleQuestionValues}
                    placeholder="Proposition C"
                    required
                  />
                </InputGroup>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormGroup>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">D</InputGroupAddon>
                  <Input
                    name="D"
                    value={state.D}
                    onChange={effects.handleQuestionValues}
                    placeholder="Proposition D"
                    required
                  />
                </InputGroup>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormGroup>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">E</InputGroupAddon>
                  <Input
                    name="E"
                    value={state.E}
                    onChange={effects.handleQuestionValues}
                    placeholder="Proposition E"
                    required
                  />
                </InputGroup>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <span className="text-muted">Bonne réponses &nbsp;</span>
              <ButtonGroup>
                <Button
                  color="light"
                  onClick={() => effects.handleCorrectAnswer('A')}
                  active={state.correctAnswers.includes('A')}
                >
                  &nbsp;A&nbsp;
                </Button>
                <Button
                  color="light"
                  onClick={() => effects.handleCorrectAnswer('B')}
                  active={state.correctAnswers.includes('B')}
                >
                  &nbsp;B&nbsp;
                </Button>
                <Button
                  color="light"
                  onClick={() => effects.handleCorrectAnswer('C')}
                  active={state.correctAnswers.includes('C')}
                >
                  &nbsp;C&nbsp;
                </Button>
                <Button
                  color="light"
                  onClick={() => effects.handleCorrectAnswer('D')}
                  active={state.correctAnswers.includes('D')}
                >
                  &nbsp;D&nbsp;
                </Button>
                <Button
                  color="light"
                  onClick={() => effects.handleCorrectAnswer('E')}
                  active={state.correctAnswers.includes('E')}
                >
                  &nbsp;E&nbsp;
                </Button>
                <Button
                  color="light"
                  onClick={effects.toggleCorrectAnswersPicture}
                >
                  <InfoIcon
                    color="orange"
                    size="23"
                    style={{ verticalAlign: 'bottom' }}
                  />
                  {state.modalCorrectAnswers && (
                    <ModalImg
                      picture={CorrectAnswersPicture}
                      onCloseImgModal={effects.toggleCorrectAnswersPicture}
                    />
                  )}
                </Button>
              </ButtonGroup>
              &nbsp; &nbsp;
              {state.correctAnswers.length > 0 && (
                <Fragment>
                  <span className="text-muted">
                    Réponses selectionnées &nbsp;
                  </span>
                  <span>
                    {map(state.correctAnswers, answer => (
                      <Badge key={answer} color="light">
                        {answer}
                      </Badge>
                    ))}
                  </span>
                </Fragment>
              )}
            </Col>
          </Row>
          {state.correctAnswersRequired && (
            <Row>
              <Col>
                <span style={{ color: 'red' }}>
                  Il faut choisir au moins une réponse :)
                </span>
              </Col>
            </Row>
          )}
          <Row style={{ marginTop: '20px' }}>
            <Col md="5" />
            <Col md="3">
              {isLastQuestion && (
                <Button
                  color="light"
                  block
                  onClick={() => {
                    const response = window.confirm(
                      'Etes vous sûr de vouloir supprimer cette question ?'
                    )
                    if (response) {
                      onDeleteLastQuestion()
                    }
                  }}
                >
                  Supprimer question <TrashIcon />
                </Button>
              )}
            </Col>
            <Col md="4">
              <ActionButton
                text={
                  <span>
                    {!state.alreadyValidatedQuestion
                      ? 'Ajouter question'
                      : 'Modifier question'}{' '}
                    <PlusIcon />
                  </span>
                }
                color="info"
                block={true}
                action={effects.addQuestion}
                form={`question-form-${lastIndex + 1}`}
              />
            </Col>
          </Row>
        </Form>
      </Card>
    </Collapse>
  </div>
)

export default withState(injectState(QuestionForm))
