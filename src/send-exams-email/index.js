import React from 'react'
import CopyIcon from 'react-icons/lib/fa/copy'
import {
  Card,
  Button,
  InputGroup,
  InputGroupAddon,
  Input,
  Row,
  Col,
  Tooltip,
} from 'reactstrap'
import { provideState, injectState } from 'reaclette'

let emailInputRef = React.createRef()

const withState = provideState({
  initialState: () => ({
    tooltip: false,
  }),
  effects: {
    initialize: () => {},
    copyEmail() {
      emailInputRef.select()
      document.execCommand('copy')
      this.state.tooltip = true
    },
  },
})

const SendExamsEmail = ({ effects, state }) => (
  <Card body>
    <Row>
      <Col>
        Envoyez nous vos examens bien scannés sur l'adresse email indiquée à
        droite. Pas besoin d'avoir un scanneur, utilisez l'application{' '}
        <a href="https://play.google.com/store/apps/details?id=com.appxy.tinyscanner&hl=fr">
          Tiny Scanner
        </a>
      </Col>
      <Col md="4">
        <InputGroup>
          <Input
            value="medical.dz.qcm@gmail.com"
            innerRef={ref => (emailInputRef = ref)}
          />
          <InputGroupAddon addonType="append">
            <Button
              color="info"
              outline
              onClick={effects.copyEmail}
              id="copytooltip"
            >
              Copier l'email <CopyIcon />
            </Button>
          </InputGroupAddon>
          <Tooltip placement="right" isOpen={state.tooltip} target="copytooltip">
            Email copié
          </Tooltip>
        </InputGroup>
      </Col>
    </Row>
  </Card>
)

export default withState(injectState(SendExamsEmail))
