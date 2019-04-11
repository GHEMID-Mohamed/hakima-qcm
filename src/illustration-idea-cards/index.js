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
      className="animated bounceInDown delay-1s"
    >
      <ProblemCard />
    </Col>
    <Col
      md="3"
      xs="12"
      style={{ marginBottom: "15px" }}
      className="animated bounceInDown delay-2s"
    >
      <SolutionCard />
    </Col>
    <Col
      md="3"
      xs="12"
      style={{ marginBottom: "15px" }}
      className="animated bounceInDown delay-3s"
    >
      <IdeaCard />
    </Col>
    <Col
      md="3"
      xs="12"
      style={{ marginBottom: "15px" }}
      className="animated bounceInDown delay-4s"
    >
      <SecurityCard />
    </Col>
  </Row>
);

export default injectState(IllustrationIdeaCard);
