import LightIcon from 'react-icons/lib/fa/lightbulb-o'
import CloseIcon from 'react-icons/lib/fa/close'
import React from 'react'
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardText,
  CardTitle,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
} from 'reactstrap'
import { injectState, provideState } from 'reaclette'

import ScanImg from '../imgs/ocr-scan.jpg'

const withState = provideState({
  initialState: () => ({
    collapse: false,
  }),
  effects: {
    toggle: () => state => ({
      ...state,
      collapse: !state.collapse,
    }),
  },
})

const ScanInfoCard = ({ effects, state }) => (
  <div>
    <Row>
      <Col>
        <h4>
          <Badge
            color="warning"
            pill
            className="hvr-float-shadow"
            style={{ cursor: 'pointer' }}
            onClick={effects.toggle}
          >
            Vous n'avez pas à taper l'examen, cliquez ici{' '}
            <LightIcon size="20" />
          </Badge>
        </h4>
      </Col>
    </Row>
    {state.collapse && (
      <Card
        style={{ boxShadow: '0 3px 5px rgba(0,0,0,.1)', fontSize: '18px' }}
        className="h-100"
      >
        <CardTitle style={{ fontWeight: 'bold', textAlign: 'center' }}>
          <div style={{ margin: '10px' }}>
            Utilisez le scanneur de caractères en ligne
          </div>
          <div>
            <img src={ScanImg} alt="ocr scan" width="80" height="80" />
          </div>
        </CardTitle>
        <CardBody>
          <CardText>
            Etapes:
            <ListGroup>
              <ListGroupItem>
                <span style={{ fontWeight: 'bold' }}>1.</span> Entrez sur le
                site{' '}
                <a href="https://www.onlineocr.net/" target="_blank">
                  https://www.onlineocr.net/
                </a>
              </ListGroupItem>
              <ListGroupItem>
                <span style={{ fontWeight: 'bold' }}>2.</span> Créer un compte
                pour pouvoir scanner des documents qui comportent plusieurs
                pages
              </ListGroupItem>
              <ListGroupItem>
                <span style={{ fontWeight: 'bold' }}>3.</span> Selectionnez un
                examen après avoir vérifier qu'il n'existe pas encore dans
                Hakima QCM
              </ListGroupItem>
              <ListGroupItem>
                <span style={{ fontWeight: 'bold' }}>4.</span> Choisissez{' '}
                <strong>Text Plain (txt)</strong> comme format de sortie
              </ListGroupItem>
              <ListGroupItem>
                <span style={{ fontWeight: 'bold' }}>5.</span> Cliquez sur le
                boutton <strong>Convert</strong> et voilà vous avez votre examen
                scanné
              </ListGroupItem>
              <ListGroupItem>
                <span style={{ fontWeight: 'bold' }}>6.</span> Maintenant vous
                n'avez qu'à organiser les questions et les réponses en les
                copiant sur l'outil de saisit des examens de{' '}
                <strong>Hakima QCM</strong>
              </ListGroupItem>
            </ListGroup>
          </CardText>
          <div className="float-right">
            <Button onClick={effects.toggle} size="sm">
              fermer <CloseIcon />
            </Button>
          </div>
        </CardBody>
      </Card>
    )}
  </div>
)

export default withState(injectState(ScanInfoCard))
