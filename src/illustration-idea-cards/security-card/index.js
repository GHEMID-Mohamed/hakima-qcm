import React from "react";
import { Card, CardBody, CardText, CardImg } from "reactstrap";
import { Link } from "react-router-dom";
import { injectState } from "reaclette";
import PilePassword from "../../imgs/pile-password.jpg";
import "../../style/hover.css";

const SecurityCard = ({ history, state }) => (
  <Card
    style={{ boxShadow: "0 3px 5px rgba(0,0,0,.1)" }}
    className="h-100 hvr-sweep-to-bottom"
  >
    <CardImg
      top
      width="100%"
      src={PilePassword}
      style={{ cursor: "pointer" }}
      alt="Card image cap"
    />
    <CardBody>
      <CardText style={{ textAlign: "center", fontSize: "18px" }}>
        <Link to={`/authenticate?toggle=createAccount`}>Créez un compte</Link>{" "}
        et suivez votre révision jusqu'au concours
      </CardText>
      <CardText style={{ textAlign: "center", fontSize: "18px" }}>
        <strong>Hakima QCM</strong> vous aide à vous focaliser sur vos
        faiblesses
      </CardText>
    </CardBody>
  </Card>
);

export default injectState(SecurityCard);
