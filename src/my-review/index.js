import GraduateIcon from 'react-icons/lib/fa/graduation-cap'
import UserPlusIcon from 'react-icons/lib/fa/user-plus'
import UserIcon from 'react-icons/lib/fa/user-md'
import React from 'react'
import ReviewSessions from './review-sessions'
import { Button, Card, CardBody, CardText, Row, Col } from 'reactstrap'
import { injectState, provideState } from 'reaclette'

import CuteKoala from '../imgs/cute_koala.jpg'

const withState = provideState({
  initialState: () => ({}),
  effects: {},
})

const MyReviewCard = ({ history, state, effects }) =>
  state.logged ? (
    <Card style={{ boxShadow: '0 3px 5px rgba(0,0,0,.1)' }} className="h-100">
      <span
        style={{
          backgroundColor: '#7bc3d1',
          color: 'white',
          display: 'block',
          cursor: 'pointer',
        }}
        className="text-center"
      >
        <h5 style={{ marginTop: '10px' }}>
          Ma révision&nbsp;
          <GraduateIcon size="22" />
        </h5>
      </span>
      <CardBody>
        <CardText>
          <ReviewSessions />
        </CardText>
      </CardBody>
    </Card>
  ) : (
    <Card style={{ boxShadow: '0 3px 5px rgba(0,0,0,.1)' }} className="h-100">
      <CardBody>
        <CardText style={{ textAlign: 'center', fontSize: '20px' }}>
          <Row>
            <Col>
              Voulez vous suivre votre révision ? trier les examens déjà passé ?
              avoir la possibilité de voir votre progression ?
            </Col>
          </Row>
          <Row>
            <Col>
              Créez un compte et profitez du suivie intelligent de{' '}
              <strong>Hakima QCM</strong>
            </Col>
          </Row>
          <br />
          <Row style={{ marginBottom: '10px' }}>
            <Col>
              <Button
                color="dark"
                onClick={() => {
                  history.push('/authenticate?toggle=authentication')
                }}
                className="hvr-icon-fade"
              >
                Se connecter&nbsp;
                <UserIcon size="18" className="hvr-icon" />
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button
                color="info"
                onClick={() => {
                  history.push('/authenticate?toggle=createAccount')
                }}
                className="hvr-icon-fade"
              >
                Créer un compte&nbsp;
                <UserPlusIcon size="18" className="hvr-icon" />
              </Button>
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <div className="text-center">
                <img
                  src={CuteKoala}
                  alt="cute koala"
                  height="200"
                  width="200"
                />
              </div>
            </Col>
          </Row>
        </CardText>
      </CardBody>
    </Card>
  )

export default withState(injectState(MyReviewCard))
