import GraduateIcon from 'react-icons/lib/fa/graduation-cap'
import React from 'react'
import { Card, CardBody, Button, CardText, CardImg } from 'reactstrap'
import { injectState } from 'reaclette'
import ExamImg from '../imgs/exam.png'

const ExamCard = ({ history, state }) => (
  <Card
    style={{ boxShadow: '0 3px 5px rgba(0,0,0,.1)' }}
    className="h-100 hvr-sweep-to-bottom"
  >
    <CardImg
      top
      width="100%"
      style={{ cursor: 'pointer' }}
      src={ExamImg}
      alt="Card image cap"
      onClick={() => {
        history.push('/examen')
      }}
    />
    <span
      onClick={() => {
        history.push('/examen')
      }}
      className="text-center"
      style={{
        backgroundColor: '#7bc3d1',
        color: 'white',
        display: 'block',
        cursor: 'pointer',
      }}
    >
      <h5 style={{ marginTop: '10px' }}>
        Passer un examen&nbsp;
        <GraduateIcon size="25" />
      </h5>
    </span>
    <CardBody>
      <CardText style={{ textAlign: 'center', fontSize: '18px' }}>
        Envie de savoir où vous en êtes dans votre révision ? remontez le niveau
        en passant des <strong>QCM</strong> en ligne. Vous voulez encore plus ?
        Créer un compte et profitez du suvie de révision crée spécialement par
        des experts de E-learning pour organiser votre révision.
        <div style={{ marginTop: '10px' }}>
          <Button
            style={{ backgroundColor: '#e63a3a' }}
            onClick={() => {
              history.push('/examen')
            }}
          >
            Passer un examen
          </Button>
        </div>
      </CardText>
    </CardBody>
  </Card>
)

export default injectState(ExamCard)
