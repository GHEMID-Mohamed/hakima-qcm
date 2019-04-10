import AngleLeft from 'react-icons/lib/fa/angle-left'
import AngleRight from 'react-icons/lib/fa/angle-right'
import CaretDown from 'react-icons/lib/fa/caret-down'
import CaretUp from 'react-icons/lib/fa/caret-up'
import debounceDecorator from 'debounce-input-decorator'
import ExclamationIcon from 'react-icons/lib/fa/exclamation'
import React from 'react'
import SortIcon from 'react-icons/lib/fa/sort'
import { iteratee, map, orderBy } from 'lodash'
import { injectState, provideState } from 'reaclette'
import {
  Button,
  Col,
  Input,
  InputGroup,
  InputGroupAddon,
  Row,
  Table,
} from 'reactstrap'

import LoadingIcon from '../imgs/button-spinner.gif'

const DEFAULT_ITEMS_PER_PAGE = 10

const InputDebounced = debounceDecorator(250)(Input)

const sortIconDirection = sortDirection =>
  sortDirection === 'desc' ? <CaretDown /> : <CaretUp />

const createSortByEffect = (sortIteratee, effects) => state => {
  const sortDirection =
    state.sortIteratee !== sortIteratee
      ? 'desc'
      : state.sortDirection === 'asc'
      ? 'desc'
      : 'asc'
  return {
    ...state,
    sortDirection,
    sortIteratee,
  }
}

const withState = provideState({
  initialState: ({ initialSortDirection, initialSortIteratee }) => ({
    page: 1,
    sortDirection: initialSortDirection || undefined,
    sortIteratee: initialSortIteratee || undefined,
  }),
  effects: {
    selectPreviousPage: effects => state => {
      effects._setPage(state.page - 1)
    },
    selectNextPage: effects => state => {
      effects._setPage(state.page + 1)
    },
    setPage: (effects, { target: { value, dataset } }) => {
      value = +value
      if (value > 0 && value <= dataset.numberofpages) {
        effects._setPage(value)
      }
    },
    sortBy: (effects, { currentTarget: { dataset } }) =>
      createSortByEffect(dataset.sortIteratee, effects),
    _setPage: (_, page) => state => {
      return { ...state, page }
    },
  },

  computed: {
    numberItemsPerPage: (_, { itemsPerPage }) =>
      itemsPerPage || DEFAULT_ITEMS_PER_PAGE,
    sortedValues: ({ sortDirection, sortIteratee }, { filteredCollection }) => {
      if (sortIteratee === undefined) {
        return filteredCollection
      }

      sortIteratee = iteratee(sortIteratee)
      return orderBy(
        filteredCollection,
        obj => {
          const value = sortIteratee(obj)
          return typeof value === 'string' ? value.toLowerCase() : value
        },
        sortDirection
      )
    },
    numberOfPages: ({ numberItemsPerPage, sortedValues }) =>
      Math.ceil(sortedValues.length / numberItemsPerPage) || 1,
    visibleValues: ({ numberItemsPerPage, page, sortedValues }) =>
      sortedValues.slice(
        (page - 1) * numberItemsPerPage,
        page * numberItemsPerPage
      ),
  },
})

const SortedTable = ({
  collection,
  columns,
  data,
  effects,
  filter,
  filteredCollection,
  pagination,
  state,
  uniqueKey,
}) => (
  <div>
    {collection === undefined ? (
      <Row className="my-3">
        <Col md={{ size: 2, offset: 5 }}>
          <br />
          <div className="text-center">
            <img src={LoadingIcon} width="50" height="50" alt="Loading..." />
          </div>
          <p className="text-muted text-center">
            Examens postés en chargement ...
          </p>
        </Col>
      </Row>
    ) : filteredCollection.length === 0 ? (
      <h3 className="text-center text-muted">
        <br />
        Pas d'examens ajoutés :( &nbsp;
        <ExclamationIcon size="30" />
        <br />
      </h3>
    ) : (
      <div>
        <Row>
          <Col>
            <Table hover striped size="sm">
              <thead>
                <tr>
                  {map(columns, column =>
                    column.sortIteratee === undefined ? (
                      <th key={column.name}>{column.name}</th>
                    ) : (
                      <th
                        data-sort-iteratee={column.sortIteratee}
                        key={column.name}
                        onClick={effects.sortBy}
                        style={{ cursor: 'pointer' }}
                      >
                        {column.name} &nbsp;
                        {state.sortIteratee === column.sortIteratee ? (
                          sortIconDirection(state.sortDirection)
                        ) : (
                          <SortIcon />
                        )}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {map(state.visibleValues, value => (
                  <tr key={value[uniqueKey]}>
                    {map(columns, column => (
                      <td key={column.name} style={{ verticalAlign: 'center' }}>
                        {column.itemRenderer(value, state, effects)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>

        {pagination && (
          <Row>
            <Col md={{ size: 6, offset: 3 }}>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <Button
                    disabled={state.page === 1}
                    onClick={effects.selectPreviousPage}
                  >
                    <AngleLeft /> Previous
                  </Button>
                </InputGroupAddon>
                <InputDebounced
                  data-numberofpages={state.numberOfPages}
                  onChange={effects.setPage}
                  type="number"
                  value={state.page}
                />
                <InputGroupAddon addonType="append">/</InputGroupAddon>
                <Input disabled value={state.numberOfPages} />
                <InputGroupAddon addonType="append">
                  <Button
                    disabled={state.page === state.numberOfPages}
                    onClick={effects.selectNextPage}
                  >
                    Next <AngleRight />
                  </Button>
                </InputGroupAddon>
              </InputGroup>
            </Col>
          </Row>
        )}
      </div>
    )}
  </div>
)

export default withState(injectState(SortedTable))
