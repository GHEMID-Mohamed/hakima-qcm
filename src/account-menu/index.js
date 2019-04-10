import React from 'react'
import UserIcon from 'react-icons/lib/fa/user-md'
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap'
import { injectState, provideState } from 'reaclette'

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
      className="hvr-icon-fade"
    >
      <UserIcon size="20" className="hvr-icon" /> &nbsp; Profile
    </DropdownToggle>
    <DropdownMenu style={{ backgroundColor: '#222534' }}>
      <DropdownItem header>
        {state.serverInstance.auth.user.profile.data.email}
      </DropdownItem>
      <DropdownItem
        onClick={effects.logOut}
        style={{ color: '#e2e3e4', fontSize: '18px' }}
        className="hvr-bounce-to-right"
      >
        Déconnecter
      </DropdownItem>
    </DropdownMenu>
  </Dropdown>
)

export default withState(injectState(AccountMenu))
