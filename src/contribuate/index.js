import PlusIcon from "react-icons/lib/fa/plus";
import GlobeIcon from "react-icons/lib/fa/globe";
import DownloadIcon from "react-icons/lib/fa/download";
import React, { Fragment } from "react";
import { Badge, Button, Card, Row, Col } from "reactstrap";
import { injectState, provideState } from "reaclette";

import UserAddedExams from "../user-added-exams";
import ExamForm from "../exam-form";
import LoadingIcon from "../imgs/button-spinner.gif";
import ScanInfoCard from "../scan-info-card";
import SendExamsEmail from "../send-exams-email";

import "../style/hover.css";

import { ObjectId } from "bson";

const withState = provideState({
  initialState: () => ({
    addExamView: false,
    initialExamData: undefined,
    examLoading: false,
    queryString: false
  }),
  effects: {
    initialize: effects => async (state, { match }) => {
      const examId = match && match.params && match.params.examId;
      if (examId) {
        state.examLoading = true;
        const objectId = new ObjectId(examId);
        const exam = await state.mongodb.find({ _id: objectId }).asArray();
        state.initialExamData = exam.pop();
        state.examLoading = false;
        state.addExamView = true;
      }
      const params = new URLSearchParams(window.location.hash.split("?")[1]);
      const _module = params.get("module");
      const university = params.get("university");
      if (_module && university) {
        state.queryString = true;
        state.initialExamData = {
          module: _module,
          university: university
        };
        effects.displayExamView();
      }
      window.scrollTo(0, 0);
    },
    displayExamView: () => state => ({
      ...state,
      addExamView: true
    }),
    hideExamView: () => state => ({
      ...state,
      addExamView: false
    })
  }
});

const Contribuate = ({ effects, state }) => (
  <div style={{ marginTop: "20px" }}>
    <Row>
      <Col md="9">
        <h5 className="text-muted hvr-icon-spin">
          Le monde n'a pas été crée en un jour{" "}
          <GlobeIcon
            size="22"
            className="hvr-icon"
            style={{ color: "#0e627f" }}
          />
        </h5>
      </Col>
      <Col md="3">
        <Button
          className="float-right hvr-icon-pulse-grow"
          onClick={effects.displayExamView}
          disabled={state.addExamView}
          block
          color="success"
        >
          <span style={{ fontSize: "16px", fontWeight: "bold" }}>
            Ajouter un examen
          </span>{" "}
          <PlusIcon color="white" size="20" className="hvr-icon" />
        </Button>
      </Col>
    </Row>
    <Row>
      <Col>
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
        ) : (
          state.addExamView && (
            <ExamForm
              data={state.initialExamData}
              onHideExamView={effects.hideExamView}
              verified={
                state.queryString ? false : state.initialExamData ? true : false
              }
              university={state.university}
            />
          )
        )}
      </Col>
    </Row>
    <hr />
    {state.authId && (
      <Row>
        <Col>
          <p className="text-muted" style={{ fontWeight: "bold" }}>
            Mes examens postés
          </p>
          <Card body>
            <UserAddedExams exams={state.postedExams} />
          </Card>
        </Col>
      </Row>
    )}
    <br />
    <br />
    <Row>
      <Col>{/* <ScanInfoCard /> */}</Col>
      <Col>
        <h4 className="float-right">
          <a
            href="https://mega.nz/#F!auwVTA4B!qkw06O3Sq8pnXcFxPgiL0w"
            target="_blank"
            style={{
              textDecoration: "none"
            }}
          >
            <Badge
              color="info"
              pill
              className="hvr-float-shadow"
              style={{ cursor: "pointer" }}
            >
              2017-2018 EMD Scannés <DownloadIcon />{" "}
            </Badge>
          </a>
        </h4>
      </Col>
    </Row>
    <Row>
      <Col>
        <SendExamsEmail />
      </Col>
    </Row>
  </div>
);

export default withState(injectState(Contribuate));
