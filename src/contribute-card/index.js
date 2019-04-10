import EyeIcon from 'react-icons/lib/fa/eye'
import PuzzleIcon from 'react-icons/lib/fa/puzzle-piece'
import React from 'react'
import {
  Card,
  CardBody,
  Button,
  CardText,
  CardImg,
  UncontrolledTooltip,
} from 'reactstrap'
import { injectState } from 'reaclette'
import ContributeImg from '../imgs/contribute.png'

const ContributeCard = ({ history, state }) => (
  <Card
    style={{ boxShadow: '0 3px 5px rgba(0,0,0,.1)' }}
    className="h-100 hvr-sweep-to-bottom"
  >
    <CardImg
      top
      width="100%"
      src={ContributeImg}
      style={{ cursor: 'pointer' }}
      alt="Card image cap"
      onClick={() => {
        if (state.logged) {
          history.push('/contribuer')
        } else {
          history.push('/authenticate')
        }
      }}
    />
    <span
      onClick={() => {
        if (state.logged) {
          history.push('/contribuer')
        } else {
          history.push('/authenticate')
        }
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
        Contribuer&nbsp;
        <PuzzleIcon size="22" />
      </h5>
    </span>
    <CardBody>
      <CardText style={{ textAlign: 'center', fontSize: '18px' }}>
        Vous avez passez un examen ? Pourquoi pas l'ajouter pour que vos
        succusseurs en bénéficieront, ou peut être vous le trouverez quand vous
        réviserez pour le concours. Vivez l'expérience du bénévolat et regardez
        l'ampleur de votre contribution <EyeIcon /> avec Hakima QCM
        <div style={{ marginTop: '10px' }}>
          <Button
            id="contribute-tooltip"
            onClick={() => {
              if (state.logged) {
                history.push('/contribuer')
              } else {
                history.push('/authenticate')
              }
            }}
            style={{ backgroundColor: '#e63a3a' }}
          >
            Contribuer
          </Button>
          <UncontrolledTooltip placement="top" target="contribute-tooltip">
            Dieu a dit: Quiconque viendra avec le bien aura dix fois autant. Al
            An-aam-6-160
          </UncontrolledTooltip>
        </div>
      </CardText>
    </CardBody>
  </Card>
)

export default injectState(ContributeCard)
