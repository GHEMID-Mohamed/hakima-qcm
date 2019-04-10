import React, { Fragment } from "react";
import { Button, Card, CardTitle, Row, Col, Input } from "reactstrap";
import { injectState, provideState } from "reaclette";
import { forEach } from "lodash";

import BarCode from "react-icons/lib/fa/barcode";

const withState = provideState({
  initialState: ({ text }) => ({
    scannedText: text
  }),
  effects: {
    handleText(
      _,
      {
        target: { value }
      }
    ) {
      this.state.scannedText = value;
    },
    extractQuestions() {
      try {
        let fullQuestions = this.state.scannedText.split(
          new RegExp(/^\s*$(?:\r\n?|\n)/gm)
        );
        let questions = {};
        forEach(fullQuestions, (quest, index) => {
          const sections = quest.split("\n");
          questions = {
            ...questions,
            [index + 1]: {
              question: sections[0].substring(2, sections[0].length).trim(),
              answers: {
                A: sections[1].substring(2, sections[0].length).trim(),
                B: sections[2].substring(2, sections[0].length).trim(),
                C: sections[3].substring(2, sections[0].length).trim(),
                D: sections[4].substring(2, sections[0].length).trim(),
                E: sections[5].substring(2, sections[0].length).trim()
              },
              correctAnswers: sections[6]
                .substring(4, sections[6].length)
                .trim()
                .split(",")
            }
          };
        });
        this.props.onQuestionExtraction(questions);
      } catch (error) {
        this.effects.notifyError(
          `Format incorrect, vous devez suivre le modèle à gauche de l'écran`
        );
      }
    }
  }
});

const ScannedText = ({ effects, state, history }) => (
  <Card body className="h-100">
    <CardTitle className="text-center text-muted">Examen scanné</CardTitle>
    <Input
      type="textarea"
      value={state.scannedText}
      style={{ height: "400px" }}
      onChange={effects.handleText}
    />
    <br />
    <Row>
      <Col md="7" />
      <Col>
        <Button
          onClick={effects.extractQuestions}
          color="success"
          className="float-right"
        >
          Extraire les questions <BarCode size="22" />
        </Button>
      </Col>
    </Row>
  </Card>
);

export default withState(injectState(ScannedText));
