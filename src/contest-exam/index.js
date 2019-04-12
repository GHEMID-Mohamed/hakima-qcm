import React from "react";
import { Card, CardBody, Button, CardText, Row, Col } from "reactstrap";
import { injectState } from "reaclette";
import CuteKoala from "../imgs/cute_koala.jpg";

const ContestExam = ({ history, state }) => (
  <Card style={{ boxShadow: "0 3px 5px rgba(0,0,0,.1)" }} className="h-100">
    <CardBody>
      <CardText style={{ textAlign: "center", fontSize: "20px" }}>
        <Row>
          <Col>
            Il y a pas assez d'examens saisis pour commencer un concours :(
          </Col>
        </Row>
        <Row>
          <Col>S'il vous plait, pensez à contribuer :)</Col>
        </Row>
        <br />
        <Row>
          <Col>
            <Button
              color="info"
              onClick={() => {
                if (state.logged) {
                  history.push("/contribuer");
                } else {
                  history.push("/authenticate");
                }
              }}
            >
              Ajouter un examen
            </Button>
          </Col>
        </Row>
        <br />
        <Row>
          <Col md={{ size: 8, offset: 2 }}>
            <Card body>
              <div className="text-center">
                <h3>Voir comment ajouter un examen sur Hakima QCM</h3>
                <div className="embed-responsive embed-responsive-16by9">
                  <iframe
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/6fu5EjWm3BE"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  />
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </CardText>
    </CardBody>
  </Card>
);

export default injectState(ContestExam);
