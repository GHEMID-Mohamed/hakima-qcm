import Modules from '../data/modules.json'
import React from 'react'
import { Button, Card, CardBody, CardText, Row, Col } from 'reactstrap'
import { injectState, provideState } from 'reaclette'

import LoadingIcon from '../imgs/button-spinner.gif'
import Chart from 'chart.js'

const withState = provideState({
  initialState: () => ({
    loading: true,
  }),
  effects: {
    initialize: effects => async state => {
      state.loading = true
      const modulesExamsNumber = []
      const modules = Object.values(Modules)
      for (let moduleName of modules) {
        try {
          const examsNumber = await state.mongodb.count({
            type: 'exam',
            module: moduleName,
            approved: true,
          })
          modulesExamsNumber.push(examsNumber)
        } catch (error) {
          effects.handleError(error)
        }
      }

      document.getElementById('exams-chart') &&
        new Chart(document.getElementById('exams-chart'), {
          type: 'bar',
          data: {
            labels: modules,
            datasets: [
              {
                label: "Nombre d'examen",
                backgroundColor: [
                  '#3e95cd',
                  '#8e5ea2',
                  '#3cba9f',
                  '#e8c3b9',
                  '#c45850',
                  '#3e95cd',
                  '#8e5ea2',
                  '#3cba9f',
                  '#e8c3b9',
                  '#c45850',
                  '#3e95cd',
                  '#8e5ea2',
                  '#3cba9f',
                  '#e8c3b9',
                  '#c45850',
                  '#3e95cd',
                  '#8e5ea2',
                  '#3cba9f',
                  '#e8c3b9',
                  '#c45850',
                  '#3e95cd',
                  '#8e5ea2',
                  '#3cba9f',
                  '#e8c3b9',
                  '#c45850',
                ],
                data: modulesExamsNumber,
              },
            ],
          },
          options: {
            legend: { display: false },
            title: {
              display: true,
              text: "Nombre d'examens saisit par module",
            },
            scales: {
              yAxes: [
                {
                  // barPercentage: 0.5,
                  // barThickness: 6,
                  // maxBarThickness: 8,
                  minBarLength: 1,
                  // gridLines: {
                  //     offsetGridLines: true
                  // }
                },
              ],
            },
          },
        })
      state.loading = false
    },
  },
})

const StatExams = ({ state }) => (
  <Card style={{ boxShadow: '0 3px 5px rgba(0,0,0,.1)' }} className="h-100">
    {state.loading && (
      <Row className="my-3">
        <Col md={{ size: 2, offset: 5 }}>
          <br />
          <div className="text-center">
            <img src={LoadingIcon} width="50" height="50" alt="Loading..." />
          </div>
          <div className="text-center">
            <p className="text-muted">
              Chargement de graphe de nombre d'examen par module
            </p>
          </div>
        </Col>
      </Row>
    )}
    <canvas id="exams-chart" width="400" height="200" />
  </Card>
)

export default withState(injectState(StatExams))
