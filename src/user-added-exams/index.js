import BellIcon from 'react-icons/lib/fa/bell'
import EyeIcon from 'react-icons/lib/fa/eye'
import IncompletedIcon from 'react-icons/lib/md/timelapse'
import CompletedIcon from 'react-icons/lib/md/check'
import PublishedIcon from 'react-icons/lib/fa/globe'
import TrashIcon from 'react-icons/lib/fa/trash'
import VerificationIcon from 'react-icons/lib/fa/hourglass-2'
import React, { Fragment } from 'react'
import { Card, Badge, Button, UncontrolledTooltip } from 'reactstrap'
import { injectState, provideState } from 'reaclette'
import moment from 'moment'

import SortedTable from '../components/sorted-table'
import * as Utils from '../utils'
import { Link } from 'react-router-dom'
import { ObjectId } from 'bson'

const withState = provideState({
  effects: {
    deleteExam: (effects, examId) => async state => {
      try {
        const objectId = new ObjectId(examId)
        await state.mongodb.deleteOne({ _id: objectId })
        effects.getPostedExams()
        effects.notifySuccess('Examen bien supprimé !')
      } catch (error) {
        effects.handleError(error)
      }
    },
  },
})

const columns = [
  {
    name: 'Module',
    itemRenderer: (value, state, effects) => (
      <h5>
        <Badge color="info">{value.module}</Badge>
      </h5>
    ),
    sortIteratee: 'module',
  },
  {
    name: 'Université',
    itemRenderer: (value, state, effects) => (
      <h5>
        <Badge color="light">{value.university}</Badge>
      </h5>
    ),
    sortIteratee: 'university',
  },
  {
    name: 'Session',
    itemRenderer: (value, state, effects) => (
      <h5>
        <Badge color="light">
          {moment(value.examDate).format('DD-MM-YYYY')}
        </Badge>
      </h5>
    ),
    sortIteratee: 'examDate',
  },
  {
    name: 'Date de création',
    itemRenderer: (value, state, effects) => (
      <h5>
        <Badge color="light">{moment(value.date).format('DD-MM-YYYY')}</Badge>
      </h5>
    ),
    sortIteratee: 'date',
  },
  {
    name: (
      <span>
        Doit être publié avant le &nbsp;
        <BellIcon color="red" size="20" id={`bell-icon`} />
        <UncontrolledTooltip placement="top" target={`bell-icon`}>
          Vite terminez cet examen avant qu'il soit supprimé après l'échéance de
          la date dessous
        </UncontrolledTooltip>
      </span>
    ),
    itemRenderer: (value, state, effects) =>
      value.approved ? (
        <span />
      ) : (
        <h5>
          <Badge color="danger">
            {moment(value.date)
              .add(7, 'days')
              .format('DD-MM-YYYY')}
          </Badge>
        </h5>
      ),
    sortIteratee: 'date',
  },
  {
    name: 'Vue',
    itemRenderer: (value, state, effects) => (
      <h5>
        <Badge color="light">
          {value.seen || 0} &nbsp; <EyeIcon />
        </Badge>
      </h5>
    ),
    sortIteratee: 'seen',
  },
  {
    name: 'Etât',
    itemRenderer: (value, state, effects) => {
      const generatedKey = Utils.generateKey()
      return value.completed ? (
        <Fragment>
          <CompletedIcon
            color="green"
            size="25"
            id={`complete-icon-${generatedKey}`}
          />
          <UncontrolledTooltip
            placement="top"
            target={`complete-icon-${generatedKey}`}
          >
            Complet
          </UncontrolledTooltip>
        </Fragment>
      ) : (
        <Fragment>
          <IncompletedIcon
            color="orange"
            size="25"
            id={`incomplete-icon-${generatedKey}`}
          />
          <UncontrolledTooltip
            placement="top"
            target={`incomplete-icon-${generatedKey}`}
          >
            Incomplet
          </UncontrolledTooltip>
        </Fragment>
      )
    },
    sortIteratee: undefined,
  },
  {
    name: 'Action',
    itemRenderer: (value, state, effects) => (
      <Fragment>
        {value.completed ? (
          <Link
            className="btn btn-outline-dark btn-sm"
            // target="_blank"
            to={`/contribuer/${value._id.toString()}`}
          >
            Modifier
          </Link>
        ) : (
          <Link
            className="btn btn-outline-info btn-sm"
            // target="_blank"
            to={`/contribuer/${value._id.toString()}`}
          >
            Compléter
          </Link>
        )}
        &nbsp;
        {!value.completed && (
          <Button
            size="sm"
            color="danger"
            outline
            onClick={() => {
              const response = window.confirm(
                'Etes vous sûr de vouloir abondonner cet examen ?'
              )
              if (response) {
                effects.deleteExam(value._id.toString())
              }
            }}
          >
            <TrashIcon size="15" />
          </Button>
        )}
      </Fragment>
    ),
    sortIteratee: undefined,
  },
  {
    name: 'Publication',
    itemRenderer: (value, state, effects) => {
      const generatedKey = Utils.generateKey()
      return value.approved ? (
        <Fragment>
          <PublishedIcon
            color="green"
            size="25"
            id={`published-icon-${generatedKey}`}
          />
          <UncontrolledTooltip
            placement="top"
            target={`published-icon-${generatedKey}`}
          >
            Votre examen est en ligne
          </UncontrolledTooltip>
        </Fragment>
      ) : (
        <Fragment>
          <VerificationIcon
            color="orange"
            size="25"
            id={`on-verification-icon-${generatedKey}`}
          />
          <UncontrolledTooltip
            placement="top"
            target={`on-verification-icon-${generatedKey}`}
          >
            En vérification
          </UncontrolledTooltip>
        </Fragment>
      )
    },
    sortIteratee: undefined,
  },
]

const UserAddedExamss = ({ effects, state, lastIndex, exams }) => (
  <SortedTable
    columns={columns}
    collection={exams}
    filteredCollection={exams}
    initialSortIteratee={'date'}
    initialSortDirection={'desc'}
    pagination={exams && exams.length > 10}
    uniqueKey={'_id'}
  />
)

export default withState(injectState(UserAddedExamss))
