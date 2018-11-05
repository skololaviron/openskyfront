import React, { Component, Fragment } from "react";
import { Row, Table, TableHead, TableBody } from "mdbreact";
import * as apiCall from "../../api";
import "./modalForm.css";

const verbs = {
  departure: "departure",
  arrival: "arrival"
};

class ModalForm extends Component {
  state = {
    departure: [],
    arrival: []
  };

  componentDidMount() {
    this.updateData(verbs.departure, 3600);
    this.updateData(verbs.arrival, 3600);
  }

  updateData = (verb, event) => {
    const end = event.target ? event.target.value * 60 : event;
    const currentEpoch = Math.round(Date.now() / 1000) - 24 * 3600;

    apiCall[verb === verbs.departure ? 'getDepartureFlight' : 'getArrivalFlight']({
      airport: this.props.airportCode,
      end: currentEpoch,
      begin: currentEpoch - end
    }).then((data = []) => this.setState({ [verb]: data }));
  };

  renderRow = verb => {
    let data = verb === verbs.departure ? this.state.departure : this.state.arrival;
    return (
      <Fragment>
        <Row key={verb + 1}>
          <span className="ModalForm__name">{verb} in last: </span>
          <select onChange={(e) => this.updateData(verb, e)}>
            <option defaultValue={60}>60</option>
            <option value={10}>10</option>
            <option value={30}>30</option>
            <option value={90}>90</option>
          </select>
          <span className="ModalForm__name">minutes </span>
        </Row>
        <Row key={verb + 2}>
          <Table striped className="ModalForm__table" small>
            <TableHead>
              <tr>
                <th>ICAO</th>
                <th>First Seen</th>
                <th>Last Seen</th>
              </tr>
            </TableHead>
            <TableBody>
              {data.length > 0 ?
                data.map(aircraft => (
                  <tr key={aircraft.icao24 + aircraft.firstSeen}>
                    <th>{aircraft.icao24}</th>
                    <th>{new Date(aircraft.firstSeen * 1000).toString()}</th>
                    <th>{new Date(aircraft.lastSeen * 1000).toString()}</th>
                  </tr>
                ))
                :
                <tr>
                  <th colSpan="3">No current flight in that time range</th>
                </tr>
              }
            </TableBody>
          </Table>
        </Row>
      </Fragment>
    );
  };
  render() {
    return (
      <form className="ModalForm" onSubmit={e => e.preventDefault()}>
        {this.renderRow(verbs.departure)}
        {this.renderRow(verbs.arrival)}
      </form>
    );
  }
}

export default ModalForm;
