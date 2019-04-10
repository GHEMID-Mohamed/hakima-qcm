import Modules from '../data/modules.json'
import React, { Fragment } from 'react'
import UserIcon from 'react-icons/lib/fa/user-md'
import SearchIcon from 'react-icons/lib/fa/search'
import ContributeIcon from 'react-icons/lib/fa/cubes'
import FollowIcon from 'react-icons/lib/fa/rss-square'
import { Button, Card, CardBody, CardText, Row, Col } from 'reactstrap'
import { injectState } from 'reaclette'

const MobileAppNav = ({ state, history }) => (
  <Card
    style={{ boxShadow: '0 3px 5px rgba(0,0,0,.1)' }}
    className="h-100"
    style={{ border: 'none' }}
  >
    {!state.logged && (
      <Fragment>
        <Card
          body
          style={{ boxShadow: '0 3px 5px rgba(0,0,0,.1)' }}
          className="h-100 w-100 hvr-sweep-to-bottom"
          onClick={() => history.push('/authenticate')}
        >
          <CardText className="text-center">
            <UserIcon size="30" />
          </CardText>
          <CardText
            className="text-center"
            style={{
              fontSize: '20px',
              fontVariant: 'small-caps',
              fontWeight: 'bold',
            }}
          >
            se connecter / s'inscrire
          </CardText>
        </Card>
        <br />
      </Fragment>
    )}
    <Card
      body
      style={{ boxShadow: '0 3px 5px rgba(0,0,0,.1)' }}
      className="h-100 w-100 hvr-sweep-to-bottom"
      onClick={() => history.push('/examen')}
    >
      <CardText className="text-center">
        <SearchIcon size="30" />
      </CardText>
      <CardText
        className="text-center"
        style={{
          fontSize: '20px',
          fontVariant: 'small-caps',
          fontWeight: 'bold',
        }}
      >
        chercher un module
      </CardText>
    </Card>
    <br />
    <Card
      body
      style={{ boxShadow: '0 3px 5px rgba(0,0,0,.1)' }}
      className="h-100 w-100 hvr-sweep-to-bottom"
      onClick={() => history.push('/marevision')}
    >
      <CardText className="text-center">
        <FollowIcon size="30" />
      </CardText>
      <CardText
        className="text-center"
        style={{
          fontSize: '20px',
          fontVariant: 'small-caps',
          fontWeight: 'bold',
        }}
      >
        suivre votre révision
      </CardText>
    </Card>
    <br />
    <Card
      body
      style={{ boxShadow: '0 3px 5px rgba(0,0,0,.1)' }}
      className="h-100 w-100 hvr-sweep-to-bottom"
      onClick={() =>
        history.push(
          state.logged ? '/contribuer' : '/authenticate?toggle=authentication'
        )
      }
    >
      <CardText className="text-center">
        <ContributeIcon size="30" />
      </CardText>
      <CardText
        className="text-center"
        style={{
          fontSize: '20px',
          fontVariant: 'small-caps',
          fontWeight: 'bold',
        }}
      >
        contribuer
      </CardText>
    </Card>
  </Card>
)

export default injectState(MobileAppNav)
