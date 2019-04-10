import CheckIcon from "react-icons/lib/fa/check";
import WarningIcon from "react-icons/lib/fa/exclamation-triangle";
import CloseIcon from "react-icons/lib/fa/close";
import DatePicker from "react-datepicker";
import FloopyIcon from "react-icons/lib/fa/floppy-o";
import PlusIcon from "react-icons/lib/fa/plus";
import PlayIcon from "react-icons/lib/fa/play";
import InfoIcon from "react-icons/lib/fa/info-circle";
import ScanIcon from "react-icons/lib/md/scanner";
import KeyboardIcon from "react-icons/lib/md/keyboard";
import React, { Fragment } from "react";
import {
  Alert,
  Col,
  Row,
  Button,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  UncontrolledTooltip,
  Label,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink
} from "reactstrap";
import { injectState, provideState } from "reaclette";
import { map } from "lodash";
import classnames from "classnames";

import "react-datepicker/dist/react-datepicker.css";
import Universities from "../data/cities";
import ActionButton from "../components/action-button";
import ExamDatePicture from "../imgs/exam-date.jpg";
import ModalImg from "../components/modal-img";
import Modules from "../data/modules";
import QuestionForm from "../question-form";
import UploadExam from "../upload-exam";

import "../style/hover.css";
import "./modal-img-style.css";
import "./input-date-style.css";

const MIN_QUESTIONS_LENGTH = 10;

const withState = provideState({
  initialState: ({ data, verified, university }) => ({
    module: (data && data.module) || "",
    examDate: (data && data.examDate && new Date(data.examDate)) || "",
    _university: (data && data.university) || university || "",
    questions: (data && data.exam) || {},
    moduleExists: !verified,
    examCompleted: false,
    modalExamPicture: false,
    examProof: (data && data.examProof) || "",
    activeTab: "scan-mode"
  }),
  effects: {
    addExam: effects => async (state, { onHideExamView }) => {
      if (Object.keys(state.questions).length < MIN_QUESTIONS_LENGTH) {
        effects.notifyError(
          `Il faut au minimum ${MIN_QUESTIONS_LENGTH} questions pour ajouter un examen`
        );
      } else {
        let creator = {};
        if (state.authId !== "5c2e153a6071059caef396ac") {
          creator = { creator: state.authId };
        }
        try {
          await state.mongodb.updateOne(
            {
              module: state.module,
              examDate: new Date(state.examDate).valueOf(),
              university: state._university
            },
            {
              $set: {
                type: "exam",
                examDate: new Date(state.examDate).valueOf(),
                ...creator,
                date: Date.now(),
                completed: true,
                approved: false, //TODO: make it always false
                university: state._university,
                examProof: state.examProof,
                exam: {
                  ...state.questions
                }
              }
            },
            { upsert: true }
          );
          state.examCompleted = true;
          effects.notifySuccess(
            "Merci, votre examen est ajouté avec succés !, Il sera vérifié et publier bientôt :)"
          );
          onHideExamView();
          effects.getPostedExams();
          effects.getLastPostedExams();
        } catch (error) {
          effects.handleError(error);
        }
      }
    },
    toggleExamDatePicture: () => state => ({
      ...state,
      modalExamPicture: !state.modalExamPicture
    }),
    handleExamValues: (_, { target }) => state => ({
      ...state,
      [target.name]: target.value
    }),
    handleExamDate: (_, date) => state => {
      state.examDate = new Date(date);
    },
    addQuestionView: () => state => {
      const questionKeys = Object.keys(state.questions);
      const lastKey = questionKeys.length > 0 ? +questionKeys.pop() : 0;
      state.questions = {
        ...state.questions,
        [lastKey + 1]: {}
      };
    },
    deleteLastQuestion: () => state => {
      const questionKeys = Object.keys(state.questions);
      const lastKey = +questionKeys.pop();
      let _questions = { ...state.questions };
      delete _questions[lastKey];
      state.questions = _questions;
    },
    addQuestion: (_, questionData) => state => {
      let questions = { ...state.questions };
      questions = {
        ...questions,
        ...questionData
      };
      return {
        ...state,
        questions
      };
    },
    setQuestions: (_, questions) => state => {
      return {
        ...state,
        questions
      };
    },
    saveExamForLater: (effects, close = true) => async (
      state,
      { onHideExamView }
    ) => {
      let creator = {};
      if (state.authId !== "5c2e153a6071059caef396ac") {
        creator = { creator: state.authId };
      }
      try {
        await state.mongodb.updateOne(
          {
            module: state.module,
            examDate: new Date(state.examDate).valueOf(),
            university: state._university
          },
          {
            $set: {
              type: "exam",
              examDate: new Date(state.examDate).valueOf(),
              ...creator,
              date: Date.now(),
              completed: false,
              approved: false,
              university: state._university,
              examProof: state.examProof,
              exam: {
                ...state.questions
              }
            }
          },
          { upsert: true }
        );
        state.examCompleted = true;
        close &&
          effects.notifySuccess(
            "l'examen est sauvegardé avec succées, vous pouvez le compléter dans votre tableau d'examen"
          );
        close && onHideExamView();
        effects.getPostedExams();
      } catch (error) {
        effects.handleError(error);
      }
    },
    verifyModuleExisting: effects => async state => {
      const cursor = await state.mongodb
        .find({
          module: state.module,
          examDate: new Date(state.examDate).valueOf(),
          university: state._university
        })
        .iterator();
      const res = await cursor.next();
      if (res) {
        effects.notifyError(
          "Cet examen est en cours d'être remplis par un autre utilisateur ou existe déjà :( S'il vous plait, choisisssez un autre examen :) S'il vous plait, choisisssez un autre examen :)"
        );
      } else {
        effects.saveExamForLater(false);
        return {
          ...state,
          moduleExists: false
        };
      }
    },
    toggleExamMode: (_, mode) => state => ({
      ...state,
      activeTab: mode
    })
  },
  computed: {
    validInitialExamData: ({ year, examDate, module, _university }) =>
      examDate !== "" && module !== "" && _university !== "",
    addExamStarted: ({ moduleExists }) => !moduleExists,
    lastQuestionIndex: ({ questions }) => {
      const questionKeys = Object.keys(questions);
      return questionKeys.length > 0 ? +questionKeys.pop() : 0;
    }
  }
});

const ExamForm = ({ effects, state, onHideExamView }) => {
  const datePickerProps = {
    dateFormat: "dd/MM/yyyy",
    onChange: effects.handleExamDate,
    placeholderText: "Date examen *",
    className: "input-date-style",
    disabled: state.addExamStarted
  };
  if (state.examDate !== "") {
    datePickerProps.selected = state.examDate;
  }
  return (
    <div>
      <Form id="exam-form">
        <Row>
          <Col md="3">
            <FormGroup>
              <Label className="text-muted">Module</Label>
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
          </Col>
          <Col md="3">
            <FormGroup>
              <Label className="text-muted">Université</Label>
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
          </Col>
          <Col md="3">
            <FormGroup>
              <Label className="text-muted">Date - Session</Label>
              <InputGroup>
                <DatePicker class="form-control" {...datePickerProps} />
                <InputGroupAddon
                  addonType="append"
                  style={{ cursor: "pointer" }}
                  onClick={effects.toggleExamDatePicture}
                >
                  <InputGroupText>
                    <InfoIcon color="orange" size="20" />
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </FormGroup>
          </Col>
          <Col md="3">
            <FormGroup>
              <Label className="text-muted">&nbsp;</Label>
              <ActionButton
                className="hvr-icon-forward"
                text={
                  <span>
                    Commencer &nbsp; <PlayIcon className="hvr-icon" />
                  </span>
                }
                color="success"
                action={effects.verifyModuleExisting}
                block={true}
                disabled={!state.validInitialExamData || !state.moduleExists}
              />
            </FormGroup>
          </Col>
        </Row>
        <br />
        {!state.moduleExists && (
          <Fragment>
            <Nav tabs fill>
              <NavItem style={{ cursor: "pointer" }}>
                <NavLink
                  className={classnames({
                    active: state.activeTab === "scan-mode"
                  })}
                  onClick={() => {
                    effects.toggleExamMode("scan-mode");
                  }}
                  style={
                    state.activeTab === "scan-mode"
                      ? { color: "#0e627f", fontWeight: "bold" }
                      : {}
                  }
                >
                  <ScanIcon size="22" /> Mode scan
                </NavLink>
              </NavItem>
              <NavItem style={{ cursor: "pointer" }}>
                <NavLink
                  className={classnames({
                    active: state.activeTab === "type-mode"
                  })}
                  onClick={() => {
                    effects.toggleExamMode("type-mode");
                  }}
                  style={
                    state.activeTab === "type-mode"
                      ? { color: "#0e627f", fontWeight: "bold" }
                      : {}
                  }
                >
                  <KeyboardIcon size="22" /> Mode saisit
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={state.activeTab}>
              <TabPane tabId="scan-mode">
                <Row>
                  <Col>
                    <br />
                    <UploadExam
                      onQuestions={effects.setQuestions}
                      questions={state.questions}
                    />
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId="type-mode">
                <Row>
                  <Col>
                    <br />
                    {map(state.questions, (questData, index) => (
                      <QuestionForm
                        question={questData.question}
                        answers={questData.answers}
                        correctAnswers={questData.correctAnswers}
                        key={+index}
                        lastIndex={+index}
                        onAddQuestion={effects.addQuestion}
                        onDeleteLastQuestion={effects.deleteLastQuestion}
                        isLastQuestion={state.lastQuestionIndex === +index}
                      />
                    ))}
                    <Row>
                      <Col md="8" />
                      <Col md="4">
                        <Button
                          className="float-right hvr-icon-pulse"
                          onClick={effects.addQuestionView}
                          disabled={!state.validInitialExamData}
                          color="warning"
                        >
                          Ajouter une question <PlusIcon className="hvr-icon" />
                        </Button>
                        &nbsp;
                        <Button
                          color="light"
                          className="float-right"
                          id="delete-info"
                          onClick={() => {}}
                        >
                          <InfoIcon
                            color="orange"
                            size="23"
                            style={{ verticalAlign: "bottom" }}
                          />
                        </Button>
                        <UncontrolledTooltip
                          placement="left"
                          target="delete-info"
                        >
                          Pour Respecter l'ordre des questions ajoutées, Nous
                          vous offrons la possiblité de supprimer seulement la
                          dernière question ajoutée
                        </UncontrolledTooltip>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <FormGroup>
                          <Label className="text-muted">Preuve d'examen</Label>
                          <Input
                            name="examProof"
                            placeholder="Peut être le lien de l'examen dans Drive ou Dropbox. Exemple https://drive.google.com/open?id=1Q3sMhD_BwAczA6gsTVhq_Q43TZTigZXk"
                            onChange={effects.handleExamValues}
                            type="text"
                            value={state.examProof}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Alert color="warning">
                          <WarningIcon /> Vous avez que 7 jours pour terminer la
                          saisie de cet examen
                        </Alert>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </TabPane>
            </TabContent>
          </Fragment>
        )}
        <br />
        <br />
        {state.addExamStarted && (
          <Row>
            <Col md="2">
              <Button
                className="float-left"
                color="warning"
                block
                onClick={() => {
                  const response = window.confirm(
                    "Etes vous sûr de vouloir quitter sans sauvegarder l'examen pour plus tard ?"
                  );
                  if (response) {
                    onHideExamView();
                  }
                }}
              >
                Quitter <CloseIcon color="red" />
              </Button>
            </Col>
            <Col md="2" />
            <Col md="4">
              <ActionButton
                text={
                  <span>
                    Sauvegarder pour plus tard <FloopyIcon />
                  </span>
                }
                action={effects.saveExamForLater}
                disabled={!state.addExamStarted}
                block={true}
              />
            </Col>
            <Col md="4">
              <ActionButton
                text={
                  <span>
                    Ajouter l'examen <CheckIcon />
                  </span>
                }
                color="success"
                action={effects.addExam}
                form="exam-form"
                disabled={!state.addExamStarted}
                block={true}
              />
            </Col>
          </Row>
        )}
      </Form>
      {state.modalExamPicture && (
        <ModalImg
          picture={ExamDatePicture}
          onCloseImgModal={effects.toggleExamDatePicture}
        />
      )}
    </div>
  );
};

export default withState(injectState(ExamForm));
