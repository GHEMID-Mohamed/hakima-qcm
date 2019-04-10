import CompletedIcon from 'react-icons/lib/md/check'
import CloseIcon from 'react-icons/lib/fa/close'
import React from 'react'
import { Card, Badge, Button } from 'reactstrap'
import { injectState, provideState } from 'reaclette'

import SortedTable from '../../components/sorted-table'
import { Link } from 'react-router-dom'
import { ObjectId } from 'bson'

const withState = provideState({
  initialState: () => ({
    allPostedReports: undefined,
  }),
  effects: {
    initialize: effects => {
      effects.getAllReports()
    },
    getAllReports: effects => async state => {
      try {
        state.allPostedReports = undefined
        const reports = await state.mongodb.find({ type: 'report' }).asArray()
        state.allPostedReports = reports
      } catch (error) {
        effects.handleError(error)
      }
    },
    setAsNotCorrected: (effects, id) => async state => {
      try {
        const objectId = new ObjectId(id)
        await state.mongodb.updateOne(
          {
            _id: objectId,
          },
          {
            $set: {
              corrected: false,
            },
          },
          { upsert: true }
        )
        effects.getAllReports()
      } catch (error) {
        effects.handleError(error)
      }
    },
    setAsCorrected: (effects, id) => async state => {
      try {
        const objectId = new ObjectId(id)
        await state.mongodb.updateOne(
          {
            _id: objectId,
          },
          {
            $set: {
              corrected: true,
            },
          },
          { upsert: true }
        )
        effects.getAllReports()
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
        <Badge color="light">{value.creator}</Badge>
      </h5>
    ),
    sortIteratee: undefined,
  },
  {
    name: 'Message',
    itemRenderer: (value, state, effects) => (
      <Card body>{value.reportMessage}</Card>
    ),
    sortIteratee: undefined,
  },
  {
    name: 'Action',
    itemRenderer: (value, state, effects) => (
      <Link
        className="btn btn-outline-dark"
        target="_blank"
        to={`/contribuer/${value.examId}`}
      >
        Modifier
      </Link>
    ),
    sortIteratee: undefined,
  },
  {
    name: 'Corrigé',
    itemRenderer: (value, state, effects) =>
      value.corrected ? (
        <CompletedIcon size="25" color="green" />
      ) : (
        <CloseIcon size="25" color="red" />
      ),
    sortIteratee: undefined,
  },
  {
    name: '',
    itemRenderer: (value, state, effects) =>
      value.corrected ? (
        <Button
          outline
          color="dark"
          onClick={() => effects.setAsNotCorrected(value._id)}
        >
          Marquer comme pas corrigé
        </Button>
      ) : (
        <Button
          outline
          color="success"
          onClick={() => effects.setAsCorrected(value._id)}
        >
          Marquer comme corrigé
        </Button>
      ),
    sortIteratee: undefined,
  },
]

const AdminReports = ({ effects, state, history }) => (
  <Card body>
    <SortedTable
      columns={columns}
      collection={state.allPostedReports}
      filteredCollection={state.allPostedReports}
      initialSortIteratee={'date'}
      initialSortDirection={'desc'}
      pagination={state.allPostedReports && state.allPostedReports.length > 10}
      uniqueKey={'_id'}
    />
  </Card>
)

export default withState(injectState(AdminReports))
