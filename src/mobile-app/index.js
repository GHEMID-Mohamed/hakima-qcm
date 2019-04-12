import React, { Fragment } from "react";
import MobileIcon from "react-icons/lib/fa/mobile";
import { Card, Row, Col, ListGroup, ListGroupItem, Table } from "reactstrap";
import { injectState } from "reaclette";

const MobileApp = ({ effects, state, history }) => (
  <Card body>
    <h3>
      <MobileIcon /> Installer l'application mobile
    </h3>
    <ListGroup>
      <ListGroupItem color="info">
        <span className="font-weight-bold">1.</span> Ouvrez le site{" "}
        <a href="hakima-qcm.com">Hakima QCM</a> avec le navigateur{" "}
        <span className="font-weight-bold">Google chrome</span> ou avec avec{" "}
        <span className="font-weight-bold">Safari</span> si vous avez un iPhone
      </ListGroupItem>
      <ListGroupItem>
        <span className="font-weight-bold">2.</span> Si vous avez déjà ouvert le
        site sur votre navigateur et que vous n'avez pas encore installer
        l'application, videz l'histoire de votre navigateur et refaites l'étape
        1.
      </ListGroupItem>
      <ListGroupItem color="info">
        <span className="font-weight-bold">3.</span> Une fênetre va surgir dans
        quelques secondes pour vous proposer d'installer l'application mobilie,
        cliquez sur installer et attendez encore quelques secondes et c'est fait
        !
      </ListGroupItem>
      <ListGroupItem>
        <div>
          <span className="font-weight-bold">4.</span> L'application mobile est
          supporté seulement avec les versions de navigateurs suivantes:
        </div>
        <br />
        <Table striped>
          <thead>
            <th>Chrome</th>
            <th>Safari</th>
            <th>Firefox</th>
            <th>Edge</th>
          </thead>
          <tbody>
            <tr>
              <td>Supports > 40</td>
              <td>Supports > 11.1</td>
              <td>Supports > 44</td>
              <td>Supports > 17</td>
            </tr>
          </tbody>
        </Table>
      </ListGroupItem>
    </ListGroup>
    <br />
    <Row>
      <Col md={{ size: 8, offset: 2 }}>
        <Card body>
          <div className="text-center">
            <div className="embed-responsive embed-responsive-16by9">
              <iframe
                className="embed-responsive-item"
                width="560"
                height="315"
                src="https://www.youtube.com/embed/-Onz3dP4wm0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              />
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  </Card>
);

export default injectState(MobileApp);
