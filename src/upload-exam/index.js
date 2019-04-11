import React, { Fragment } from "react";
import ScanIcon from "react-icons/lib/io/qr-scanner";
import { Card, CardBody, Form, CardText, Row, Col } from "reactstrap";
import { injectState, provideState } from "reaclette";
import { Link } from "react-router-dom";

import { isEmpty } from "lodash";
import FileInput from "../file-input";
import ActionButton from "../components/action-button";
import Instruction from "./components/instruction";
import ScanImg from "../imgs/scan-icon.gif";
import WaitedFormat from "./components/waited-format";
import ScannedText from "./components/scanned-text";
import QuestionForm from "../question-form";

import { map, forEach } from "lodash";

const Tesseract = window.Tesseract;

const withState = provideState({
  initialState: () => ({
    uploadedFiles: undefined,
    scannedText: undefined,
    loading: false,
    currentScanedImg: 1,
    scanStatus: "",
    scanProgress: 0
  }),
  effects: {
    async uploadedFiles(_, event) {
      let extractedText = "";

      const { state } = this;

      state.loading = true;
      let index = 1;
      for (let file of state.uploadedFiles) {
        try {
          const result = await Tesseract.recognize(file, {
            lang: "fra"
            // tessedit_char_blacklist: 'e',
          }).progress(function(p) {
            state.scanStatus = p.status;
            state.scanProgress = p.progress;
          });
          extractedText = extractedText + "\n" + result.text;
        } catch (error) {
          this.effects.handleError(error);
        }
        index++;
        state.currentScanedImg = index;
      }
      state.loading = false;
      state.scannedText = extractedText;
    },
    setQuestions(_, extractedQuestions) {
      this.props.onQuestions(extractedQuestions);
    },
    setFilesToUpload: (_, uploadedFiles) => state => ({
      ...state,
      uploadedFiles
    })
  }
});

const UploadExam = ({ state, effects, questions }) => (
  <Card
    style={{ boxShadow: "0 3px 5px rgba(0,0,0,.1)", fontSize: "18px" }}
    className="h-100"
    body
  >
    <Form id="upload-exam-form">
      <Row>
        <Col md="9">
          <FileInput onSelectFiles={effects.setFilesToUpload} />
          <div style={{ marginTop: "10px" }}>
            <span className="text-muted">Format acceptés:</span>{" "}
            <span className="font-weight-bold">png, jpeg</span>{" "}
          </div>
        </Col>
        <Col md="3" className="align-bottom">
          <ActionButton
            className="hvr-icon-forward"
            text={
              <span>
                Scanner &nbsp; <ScanIcon className="hvr-icon" />
              </span>
            }
            color="success"
            action={effects.uploadedFiles}
            form="upload-exam-form"
            block={true}
            disabled={
              isEmpty(state.uploadedFiles) || state.scannedText !== undefined
            }
          />
        </Col>
      </Row>
      {state.scannedText === undefined && !state.loading && (
        <Fragment>
          <br />
          <Row>
            <Col>
              <Instruction />
            </Col>
          </Row>
        </Fragment>
      )}
    </Form>
    <br />
    {state.loading && (
      <Fragment>
        <div className="text-center">
          <img src={ScanImg} alt="loading" />
        </div>
        <div className="progress">
          <span
            className="progress-bar bg-info progress-bar-striped"
            role="progressbar"
            style={{
              width: `${state.scanProgress * 100}%`
            }}
            aria-valuemin="0"
            aria-valuemax="100"
          />
        </div>
        <div className="text-center text-muted">
          Image {state.currentScanedImg}: {state.scanStatus}
        </div>
      </Fragment>
    )}
    {state.scannedText !== undefined && (
      <Fragment>
        <Row>
          <Col md="4" className="animated fadeInRight delay-1s">
            <WaitedFormat />
          </Col>
          <Col md="8" className="animated fadeInLeft delay-1s">
            <ScannedText
              text={state.scannedText}
              onQuestionExtraction={effects.setQuestions}
            />
          </Col>
        </Row>
        <br />
        {!isEmpty(questions) && (
          <Row>
            <Col>
              {map(questions, (questData, index) => (
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
            </Col>
          </Row>
        )}
      </Fragment>
    )}
  </Card>
);

export default withState(injectState(UploadExam));
