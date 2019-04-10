import EyeIcon from 'react-icons/lib/fa/eye'
import IncompletedIcon from 'react-icons/lib/md/timelapse'
import CompletedIcon from 'react-icons/lib/md/check'
import PublishedIcon from 'react-icons/lib/fa/globe'
import ProofIcon from 'react-icons/lib/fa/question-circle'
import TrashIcon from 'react-icons/lib/fa/trash'
import VerificationIcon from 'react-icons/lib/fa/hourglass-2'
import React, { Fragment } from 'react'
import {
  Card,
  Badge,
  Button,
  UncontrolledTooltip,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap'
import { injectState, provideState } from 'reaclette'
import moment from 'moment'

import SortedTable from '../../components/sorted-table'
import * as Utils from '../../utils'
import { Link } from 'react-router-dom'
import { ObjectId } from 'bson'
import classnames from 'classnames'

const withState = provideState({
  initialState: () => ({
    allPostedExams: undefined,
    allUnpostedExams: undefined,
    activeTab: 'posted', // posted || unposted
  }),
  effects: {
    initialize: effects => {
      effects.getAllPostedExams()
      effects.getAllUnPostedExams()
    },
    getAllPostedExams: effects => async state => {
      try {
        state.allPostedExams = undefined
        const exams = await state.mongodb
          .find({ completed: true }, { sort: { date: -1 } })
          .asArray()
        state.allPostedExams = exams
      } catch (error) {
        effects.handleError(error)
      }
    },
    toggle: (_, activeTab) => state => ({
      ...state,
      activeTab,
    }),
    getAllUnPostedExams: effects => async state => {
      try {
        state.allUnpostedExams = undefined
        const exams = await state.mongodb
          .find({ completed: false }, { sort: { date: -1 } })
          .asArray()
        state.allUnpostedExams = exams
      } catch (error) {
        effects.handleError(error)
      }
    },
    acceptExam: (effects, id) => async state => {
      try {
        const objectId = new ObjectId(id)
        await state.mongodb.updateOne(
          {
            _id: objectId,
          },
          {
            $set: {
              approved: true,
            },
          },
          { upsert: true }
        )
        effects.getAllPostedExams()
        effects.getLastPostedExams()
      } catch (error) {
        effects.handleError(error)
      }
    },
    declineExam: (effects, id) => async state => {
      try {
        const objectId = new ObjectId(id)
        await state.mongodb.updateOne(
          {
            _id: objectId,
          },
          {
            $set: {
              approved: false,
            },
          },
          { upsert: true }
        )
        effects.getAllPostedExams()
        effects.getLastPostedExams()
      } catch (error) {
        effects.handleError(error)
      }
    },
    deleteExam: (effects, examId) => async state => {
      try {
        const objectId = new ObjectId(examId)
        await state.mongodb.deleteOne({ _id: objectId })
        effects.getAllPostedExams()
        effects.getAllUnPostedExams()
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
    name: 'Auteur',
    itemRenderer: (value, state, effects) => (
      <Badge color="light">{value.creator}</Badge>
    ),
    sortIteratee: undefined,
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
    name: 'Preuve',
    itemRenderer: (value, state, effects) => (
      <a href={value.examProof} target="_blank">
        <ProofIcon size="20" />
      </a>
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
    itemRenderer: (value, state, effects) =>
      value.completed ? (
        <Link
          className="btn btn-outline-dark"
          to={`/contribuer/${value._id.toString()}`}
          target="_blank"
        >
          Modifier
        </Link>
      ) : (
        <Link
          className="btn btn-outline-info"
          target="_blank"
          to={`/contribuer/${value._id.toString()}`}
        >
          Compléter
        </Link>
      ),
    sortIteratee: undefined,
  },
  {
    name: 'Published',
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
  {
    name: '',
    itemRenderer: (value, state, effects) => (
      <Button
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
        <TrashIcon size="20" />
      </Button>
    ),
    sortIteratee: undefined,
  },
  {
    name: '',
    itemRenderer: (value, state, effects) =>
      value.approved ? (
        <Button
          outline
          color="warning"
          onClick={() => effects.declineExam(value._id)}
        >
          Cacher
        </Button>
      ) : (
        <Button
          outline
          color="success"
          onClick={() => effects.acceptExam(value._id)}
        >
          Publier
        </Button>
      ),
    sortIteratee: undefined,
  },
]

const AdminExams = ({ effects, state, history }) => (
  <Card body>
    <Nav tabs fill>
      <NavItem style={{ cursor: 'pointer', fontWeight: 'bold' }}>
        <NavLink
          className={classnames({ active: state.activeTab === 'posted' })}
          onClick={() => {
            effects.toggle('posted')
          }}
        >
          Examen complets
        </NavLink>
      </NavItem>
      <NavItem style={{ cursor: 'pointer', fontWeight: 'bold' }}>
        <NavLink
          className={classnames({ active: state.activeTab === 'unposted' })}
          onClick={() => {
            effects.toggle('unposted')
          }}
        >
          Examen incomplets
        </NavLink>
      </NavItem>
    </Nav>
    <TabContent activeTab={state.activeTab}>
      <TabPane tabId="posted">
        <SortedTable
          columns={columns}
          collection={state.allPostedExams}
          filteredCollection={state.allPostedExams}
          initialSortIteratee={'date'}
          initialSortDirection={'desc'}
          pagination={state.allPostedExams && state.allPostedExams.length > 10}
          uniqueKey={'_id'}
        />
      </TabPane>
      <TabPane tabId="unposted">
        <SortedTable
          columns={columns}
          collection={state.allUnpostedExams}
          filteredCollection={state.allUnpostedExams}
          initialSortIteratee={'date'}
          initialSortDirection={'desc'}
          pagination={
            state.allUnpostedExams && state.allUnpostedExams.length > 10
          }
          uniqueKey={'_id'}
        />
      </TabPane>
    </TabContent>
  </Card>
)

export default withState(injectState(AdminExams))
