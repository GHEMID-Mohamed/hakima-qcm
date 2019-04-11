import React, { Fragment } from "react";
import LightIcon from "react-icons/lib/fa/lightbulb-o";
import {
  Badge,
  Card,
  CardTitle,
  Row,
  Col,
  Input,
  ListGroup,
  ListGroupItem
} from "reactstrap";
import { injectState, provideState } from "reaclette";

import ScanDemoImg from "../../../imgs/scan_demo.png";

const Instruction = ({ state }) => (
  <Row>
    <Col md="5">
      <img
        src={ScanDemoImg}
        alt="scan demo"
        height="400"
        width="400"
        className="animated fadeInLeft delay-1s"
      />
    </Col>
    <Col md="7" className="animated fadeInRight delay-1s">
      <p>
        <LightIcon size="20" />{" "}
        <span className="font-weight-bold">Étapes à suivre</span>
      </p>
      <ListGroup>
        <ListGroupItem>
          <span className="font-weight-bold">1.</span> Scannez l'examen avec un
          scanneur numérique ou seulement en utilisant une application mobile de
          scan sur votre smartphone comme{" "}
          <a href="https://play.google.com/store/apps/details?id=com.appxy.tinyscanner&hl=fr">
            Tiny Scanner
          </a>
        </ListGroupItem>
        <ListGroupItem>
          <span className="font-weight-bold">2.</span> Les images doivent être
          soigneusement scannés pour faciliter l'extraction du texte ({" "}
          <span className="font-weight-bold">
            Lignes horizontales, pas de bordure noir, bonne résolution de
            l'image{" "}
          </span>
          )
        </ListGroupItem>
        <ListGroupItem>
          <span className="font-weight-bold">3.</span> Entrez les examens par
          ordre en cliquant sur le bouton{" "}
          <Badge color="light">Choisir l'examen en photos</Badge> et cliquez sur
          le bouton <Badge color="success">scanner</Badge>{" "}
        </ListGroupItem>
        <ListGroupItem>
          <span className="font-weight-bold">4.</span> Réorganiser le texte
          extrait des images sous le format montré sur l'étape suivante{" "}
        </ListGroupItem>
        <ListGroupItem>
          <span className="font-weight-bold">5.</span> Cliquez sur le bouton{" "}
          <Badge color="success">Extraire les questions</Badge>, faites une
          dernière vérification et validez l'ajout d'examen en cliquant sur{" "}
          <Badge color="success">Ajouter l'examen</Badge>
        </ListGroupItem>
      </ListGroup>
    </Col>
  </Row>
);

export default injectState(Instruction);
