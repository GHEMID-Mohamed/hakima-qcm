import React from 'react'
import { Card, CardBody, CardText, Row, Col } from 'reactstrap'
import { injectState } from 'reaclette'
import { Link } from 'react-router-dom'

const WhoRus = ({ history, state }) => (
  <Card
    style={{ boxShadow: '0 3px 5px rgba(0,0,0,.1)', fontSize: '18px' }}
    className="h-100"
  >
    <CardBody>
      <CardText>
        Nous sommes une équipe qui travaille sur le E-learning. Nous veillons à
        vous offrir les meilleurs moyens pour mémoriser l'information et la
        faire graver au plus profond de vos cerveaux.
      </CardText>
      <CardText>
        Nous utilisons l'intelligence artificiel pour identifier les choses que
        vous avez mal à retenir, ensuite, appuyer là dessus pour vous aider à
        surmonter tous les défis de la révision par qcm.
      </CardText>
      <CardText>
        Toutes fois, nous avons besoin de votre{' '}
        <Link to="/contribuer">collaboration</Link> que ce soit dans la saisit
        des examens où dans les <Link to="/contacteznous">retours</Link> de
        votre expérience de l'utilisation de <strong>Hakima QCM</strong>.
      </CardText>
      <CardText>
        Nous avons besoin de coopérer, avoir le sens de partage, être
        responsable de l'enseignement des générations à venir. Je vous invite à{' '}
        <Link to="/authenticate?toggle=createAccount">créer à un compte</Link>{' '}
        et ajouter qu'un seul examen, laissez votre trace avant de vous lancer
        dans la vie professionel. Votre contribution sera une aide pour des
        milliers d'étudiants qui vont vous succéder et vous sera aussi très
        bénifique quand vous préparerez pour le <strong>concours</strong>. Or,
        si vous êtes croyant, votre contribution sera un aumône perpetuel que
        vous trouverez dans l'haut delàs.
      </CardText>
      <hr />
      <CardText>
        <div>
          <a href="mailto:ghemidp8@gmail.com" className="float-right">
            Contactez le développeur{' '}
          </a>
        </div>
      </CardText>
    </CardBody>
    <br />
  </Card>
)

export default injectState(WhoRus)
