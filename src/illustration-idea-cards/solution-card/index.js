import React from 'react'
import { Card, CardBody, CardText, CardImg } from 'reactstrap'
import { injectState } from 'reaclette'
import PileStackLampImg from '../../imgs/pile-stack-lamp.jpg'
import '../../style/hover.css'

const SolutionCard = ({ history, state }) => (
  <Card style={{ boxShadow: '0 3px 5px rgba(0,0,0,.1)' }} className="h-100 hvr-sweep-to-bottom">
    <CardImg
      top
      width="100%"
      src={PileStackLampImg}
      style={{ cursor: 'pointer' }}
      alt="Card image cap"
    />
    <CardBody>
      <CardText style={{ textAlign: 'center', fontSize: '18px' }}>
        <strong>Hakima QCM</strong> vous aide à
        mieux réviser en organisant et triant les examens à votre place
      </CardText>
    </CardBody>
  </Card>
)

export default injectState(SolutionCard)
