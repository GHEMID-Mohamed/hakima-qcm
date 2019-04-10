import React from 'react'
import { Card, CardBody, CardText, CardImg } from 'reactstrap'
import { injectState } from 'reaclette'
import PileStackImg from '../../imgs/pile-stack.jpg'
import '../../style/hover.css'

const SolutionCard = ({ history, state }) => (
  <Card
    style={{ boxShadow: '0 3px 5px rgba(0,0,0,.1)' }}
    className="h-100 hvr-sweep-to-bottom"
  >
    <CardImg
      top
      width="100%"
      src={PileStackImg}
      style={{ cursor: 'pointer' }}
      alt="Card image cap"
    />
    <CardBody>
      <CardText style={{ textAlign: 'center', fontSize: '18px' }}>
        Etudiant(e) en <strong>médecine</strong> ?
      </CardText>
      <CardText style={{ textAlign: 'center', fontSize: '18px' }}>
        <strong>Marre d'acheter</strong> des EMD ?
      </CardText>
      <CardText style={{ textAlign: 'center', fontSize: '18px' }}>
        <strong>Fatigué</strong> d'organiser votre révision ?
      </CardText>
    </CardBody>
  </Card>
)

export default injectState(SolutionCard)
