import React from "react";
import { Row, Col } from "reactstrap";
import { injectState } from "reaclette";

import IdeaCard from "./idea-card";
import SecurityCard from "./security-card";
import SolutionCard from "./solution-card";
import ProblemCard from "./problem-card";

const IllustrationIdeaCard = ({ history, state }) => (
  <Row>
    <Col
      md="3"
      xs="12"
      style={{ marginBottom: "15px" }}
      // className="animated fadeIn delay-1s"
    >
      <ProblemCard />
    </Col>
    <Col
      md="3"
      xs="12"
      style={{ marginBottom: "15px" }}
      // className="animated fadeIn delay-1"
    >
      <SolutionCard />
    </Col>
    <Col
      md="3"
      xs="12"
      style={{ marginBottom: "15px" }}
      // className="animated fadeIn delay-2s"
    >
      <IdeaCard />
    </Col>
    <Col
      md="3"
      xs="12"
      style={{ marginBottom: "15px" }}
      // className="animated fadeIn delay-3s"
    >
      <SecurityCard />
    </Col>
  </Row>
);

export default injectState(IllustrationIdeaCard);
