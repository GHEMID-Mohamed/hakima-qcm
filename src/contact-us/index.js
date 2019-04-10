import EnvelopeIcon from 'react-icons/lib/fa/envelope'
import CheckIcon from 'react-icons/lib/fa/check'
import PlaneIcon from 'react-icons/lib/fa/paper-plane'
import React from 'react'
import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Col,
} from 'reactstrap'
import { injectState, provideState } from 'reaclette'
import ActionButton from '../components/action-button'
import CuteKoala from '../imgs/cute_koala.jpg'

const withState = provideState({
  initialState: () => ({
    name: '',
    email: '',
    message: '',
    messageSent: false,
  }),
  effects: {
    handleContactUsValues: (_, { target }) => state => ({
      ...state,
      [target.name]: target.value,
    }),
    sendMessage: effects => async state => {
      let creator = {}
      if (state.authId) {
        creator = {
          creator: state.authId,
        }
      }
      try {
        await state.mongodb.insertOne({
          type: 'message',
          ...creator,
          name: state.name,
          email: state.email,
          message: state.message,
          date: Date.now(),
        })
        state.messageSent = true
      } catch (error) {
        effects.handleError(error)
      }
    },
  },
})

const ContactUs = ({ effects, state }) =>
  state.messageSent ? (
    <Row>
      <Col md={{ size: 8, offset: 2 }}>
        <Card body>
          <CardTitle
            className="text-center hvr-bounce-to-right"
            style={{ fontWeight: 'bold' }}
          >
            Contactez-nous
          </CardTitle>
          <CardBody>
            <p className="text-center" style={{ fontSize: '18px' }}>
              <CheckIcon color="green" /> &nbsp; Votre message est envoyé avec
              succés, il sera lu dans les plus bref délais
            </p>
            <div className="text-center">
              <img src={CuteKoala} alt="koala" height="200" width="200" />
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  ) : (
    <Row>
      <Col md={{ size: 8, offset: 2 }}>
        <Card
          style={{ boxShadow: '0 3px 5px rgba(0,0,0,.1)' }}
          className="h-100"
        >
          <span
            className="text-center hvr-bounce-to-right"
            style={{
              backgroundColor: '#7bc3d1',
              color: 'white',
              display: 'block',
              cursor: 'pointer',
            }}
          >
            <h5 style={{ marginTop: '10px' }}>
              Contactez-nous&nbsp;
              <EnvelopeIcon size="22" />
            </h5>
          </span>
          <CardBody>
            <CardText>
              <Form id="contact-us-form">
                <FormGroup>
                  <Label className="text-muted">Nom</Label>
                  <Input
                    name="name"
                    onChange={effects.handleContactUsValues}
                    required
                    type="text"
                    placeholder="Votre nom ! *"
                    value={state.name}
                  />
                </FormGroup>
                <FormGroup>
                  <Label className="text-muted">Email</Label>
                  <Input
                    name="email"
                    onChange={effects.handleContactUsValues}
                    required
                    type="email"
                    placeholder="Votre email ! *"
                    value={state.email}
                  />
                </FormGroup>
                <FormGroup>
                  <Label className="text-muted">Message</Label>
                  <Input
                    name="message"
                    onChange={effects.handleContactUsValues}
                    required
                    type="textarea"
                    placeholder="Message *"
                    value={state.message}
                    style={{ height: '200px' }}
                  />
                </FormGroup>
                <Row>
                  <Col md="4" />
                  <Col md="4" />
                  <Col>
                    <ActionButton
                      text={
                        <span style={{ fontWeight: 'bold' }}>
                          Envoyer <PlaneIcon />
                        </span>
                      }
                      color="info"
                      action={effects.sendMessage}
                      form="contact-us-form"
                    />
                  </Col>
                </Row>
              </Form>
            </CardText>
          </CardBody>
        </Card>
      </Col>
    </Row>
  )

export default withState(injectState(ContactUs))
