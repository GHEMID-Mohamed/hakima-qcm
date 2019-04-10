import React from 'react'
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap'
import { injectState, provideState } from 'reaclette'
import { Link } from 'react-router-dom'

const withState = provideState({
  initialState: () => ({
    dropdownOpen: false,
  }),
  effects: {
    toggle: () => state => ({
      ...state,
      dropdownOpen: !state.dropdownOpen,
    }),
  },
})

const AccountMenu = ({ effects, state, history }) => (
  <Dropdown
    nav
    direction="down"
    isOpen={state.dropdownOpen}
    toggle={effects.toggle}
  >
    <DropdownToggle
      nav
      caret
      style={{
        color: '#e2e3e4',
      }}
      className="hvr-underline-reveal"
    >
      Réviser un module
    </DropdownToggle>
    <DropdownMenu style={{ backgroundColor: '#222534' }}>
      <Link to={`/examen`} style={{ color: 'white', textDecoration: 'none' }}>
        <DropdownItem
          style={{ color: '#e2e3e4', cursor: 'pointer', fontSize: '18px' }}
          className="hvr-bounce-to-right"
          onClick={effects.toggleNavbar}
        >
          Chercher un QCM
        </DropdownItem>
      </Link>
      <Link
        to={`/marevision`}
        style={{ color: 'white', textDecoration: 'none' }}
      >
        <DropdownItem
          style={{ color: '#e2e3e4', cursor: 'pointer', fontSize: '18px' }}
          className="hvr-bounce-to-right"
          onClick={effects.toggleNavbar}
        >
          Ma révision
        </DropdownItem>
      </Link>
    </DropdownMenu>
  </Dropdown>
)

export default withState(injectState(AccountMenu))
