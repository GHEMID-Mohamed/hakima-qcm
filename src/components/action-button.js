import React from 'react'
import { Button } from 'reactstrap'
import { injectState, provideState } from 'reaclette'

import ButtonSpinner from '../imgs/button-spinner.gif'

const withState = provideState({
  initialState: () => ({
    loading: false,
  }),
  effects: {
    initialize: effects => (_, { form }) => {
      if (form) {
        document
          .getElementById(form)
          .addEventListener('submit', effects.executeAction)
      }
    },
    executeAction: (effects, event) => async (
      state,
      { action, afterEffect }
    ) => {
      if (event) {
        event.preventDefault()
      }
      if (action) {
        state.loading = true
        try {
          await action(event)
          if (afterEffect) {
            await afterEffect()
          }
        } catch (error) {
          console.log(error)
          effects.handleError(error) // Extern
        }
        state.loading = false
      }
    },
  },
  finalize: effects => (_, { form }) => {
    if (form) {
      document
        .getElementById(form)
        .removeEventListener('submit', effects.executeAction)
    }
  },
})

const ActionButton = ({
  color,
  effects,
  disabled,
  outline,
  state,
  text,
  width,
  form,
  block,
}) => {
  const props = {
    disabled: state.loading || disabled,
    outline: outline === 'true' ? true : false,
    style: { width: `${width}px` },
  }

  if (color) {
    props.color = color
  } else {
    props.color = 'dark'
  }

  if (form) {
    props.type = 'submit'
  } else {
    props.onClick = effects.executeAction
  }

  return (
    <Button {...props} block>
      {text} &nbsp;{' '}
      {state.loading && (
        <img src={ButtonSpinner} alt="button spinner" height="20" width="20" />
      )}
    </Button>
  )
}

export default withState(injectState(ActionButton))
