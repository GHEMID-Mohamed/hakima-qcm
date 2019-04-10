import React from 'react'
import { Card, CardBody, CardText, CardImg } from 'reactstrap'
import { injectState } from 'reaclette'
import PileStackIdeaImg from '../../imgs/pile-stack-idea.jpg'
import '../../style/hover.css'

const IdeaCard = ({ history, state }) => (
  <Card
    style={{ boxShadow: '0 3px 5px rgba(0,0,0,.1)' }}
    className="h-100 hvr-sweep-to-bottom"
  >
    <CardImg
      top
      width="100%"
      src={PileStackIdeaImg}
      style={{ cursor: 'pointer' }}
      alt="Card image cap"
    />
    <CardBody>
      <CardText style={{ textAlign: 'center', fontSize: '18px' }}>
        <strong>Jetez les papiers</strong>. Avec votre{' '}
        <strong>smartphone</strong> ou avec votre{' '}
        <strong>ordinateur portable</strong> vous pouvez consulter tous les
        examens des <strong>promotions précédentes</strong>
      </CardText>
    </CardBody>
  </Card>
)

export default injectState(IdeaCard)
