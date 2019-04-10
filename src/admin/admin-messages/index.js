import React from 'react'
import { Card, Badge } from 'reactstrap'
import { injectState, provideState } from 'reaclette'
import moment from 'moment'

import SortedTable from '../../components/sorted-table'

const withState = provideState({
  initialState: () => ({
    messages: undefined,
  }),
  effects: {
    initialize: effects => {
      effects.getAllSentMessages()
    },
    getAllSentMessages: effects => async state => {
      try {
        state.messages = undefined
        const messages = await state.mongodb.find({ type: 'message' }).asArray()
        state.messages = messages
      } catch (error) {
        effects.handleError(error)
      }
    },
  },
})

const columns = [
  {
    name: 'Auteur',
    itemRenderer: (value, state, effects) => (
      <h5>
        <Badge color="light">{value.creator && value.creator}</Badge>
      </h5>
    ),
    sortIteratee: undefined,
  },
  {
    name: 'Message',
    itemRenderer: (value, state, effects) => <Card body>{value.message}</Card>,
    sortIteratee: 'message',
  },
  {
    name: 'Email',
    itemRenderer: (value, state, effects) => (
      <h5>
        <Badge color="info">{value.email}</Badge>
      </h5>
    ),
    sortIteratee: undefined,
  },
  {
    name: 'Date',
    itemRenderer: (value, state, effects) => (
      <h5>
        <Badge color="light">{moment(value.date).format('DD-MM-YYYY')}</Badge>
      </h5>
    ),
    sortIteratee: 'date',
  },
]

const AdminReports = ({ effects, state, history }) => (
  <Card body>
    <SortedTable
      columns={columns}
      collection={state.messages}
      filteredCollection={state.messages}
      initialSortIteratee={'date'}
      initialSortDirection={'desc'}
      pagination={state.messages && state.messages.length > 10}
      uniqueKey={'_id'}
    />
  </Card>
)

export default withState(injectState(AdminReports))
