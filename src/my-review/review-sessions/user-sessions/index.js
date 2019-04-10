import React, { Fragment } from "react";
import RocketIcon from "react-icons/lib/fa/rocket";
import CalculatorIcon from "react-icons/lib/fa/calculator";
import { Badge, Button, Table, Row, Col } from "reactstrap";
import { injectState, provideState } from "reaclette";
import { map } from "lodash";
import moment from "moment";

import { Link } from "react-router-dom";
import { ObjectId } from "bson";
import LoadingIcon from "../../../imgs/button-spinner.gif";

const withState = provideState({
  effects: {
    deleteExam: (effects, examId) => async state => {
      try {
        const objectId = new ObjectId(examId);
        await state.mongodb.deleteOne({ _id: objectId });
        effects.getPostedexamSessions();
        effects.notifySuccess("Examen bien supprimé !");
      } catch (error) {
        effects.handleError(error);
      }
    }
  }
});

const userSessions = ({ examSessions }) =>
  !examSessions ? (
    <Row className="my-3">
      <Col md={{ size: 2, offset: 5 }}>
        <br />
        <div className="text-center">
          <img src={LoadingIcon} width="50" height="50" alt="Loading..." />
          <p>Calcul de votre progrés</p>
          <div style={{ marginTop: "10px" }}>
            <CalculatorIcon size="40" color="gray" />
          </div>
        </div>
      </Col>
    </Row>
  ) : examSessions && examSessions.length === 0 ? (
    <h3 className="text-center text-muted">
      <br />
      Pas de révision ajoutée :( &nbsp;
      <br />
    </h3>
  ) : (
    <Table size="sm" hover>
      <thead>
        <th>Module</th>
        <th>Progrès par rapports aux examens complétés</th>
        <th>
          <span className="float-right">action</span>
        </th>
      </thead>
      <tbody>
        <Fragment>
          {map(examSessions, session => (
            <tr>
              <td>
                <h5>
                  <Badge color="info">{session.module}</Badge>
                </h5>
              </td>
              <td>
                <div className="progress">
                  <span
                    className="progress-bar bg-info progress-bar-striped"
                    role="progressbar"
                    style={{
                      width: `${(session.numberOfPassedExams * 100) /
                        session.numberOfExistingExams}%`
                    }}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  />
                </div>
                <h5>
                  <span className="badge badge-light float-right">
                    {`${session.numberOfPassedExams}/${
                      session.numberOfExistingExams
                    } examen passé`}
                  </span>
                </h5>
              </td>
              <td>
                <Link
                  className="btn btn-dark btn-sm float-right hvr-icon-fade hvr-icon-float-away"
                  to={`/marevision/${session._id.toString()}`}
                >
                  Suivre <RocketIcon className="hvr-icon" />
                </Link>
              </td>
            </tr>
          ))}
        </Fragment>
      </tbody>
    </Table>
  );

export default withState(injectState(userSessions));
