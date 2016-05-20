import React from 'react';

import axios from 'axios';

import NewArrivalsStore from '../../stores/Store.js';
import Actions from '../../actions/Actions.js';

import { makeQuery } from '../../utils/utils.js';

// can select multiple filters but only one per each category.
class FilterToggle extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.stateChange = this.stateChange.bind(this);
    this.selectFilter = this.selectFilter.bind(this);
    this.state = NewArrivalsStore.getState();
  }

  componentDidMount() {
    NewArrivalsStore.listen(this.stateChange);
  }

  componentWillUnmount() {
    NewArrivalsStore.unlisten(this.stateChange);
  }

  stateChange() {
    this.setState(NewArrivalsStore.getState());
  }

  onChange(e) {
    const availability = e.currentTarget.value;

    const filters = this.state.filters;
    const queries = makeQuery(filters, availability);

    Actions.updateAvailabilityType(availability);
    this.selectFilter(queries);
  }

  selectFilter(queries = '') {
    axios
      .get(`/api?${queries}`)
      .then(response => {
        Actions.updateNewArrivalsData(response.data);
      })
      .catch(error => {
        console.log(`error making ajax call: ${error}`);
      }); /* end Axios call */
  }

  render() {
    return (
      <fieldset className="switch" tabIndex="0">
        <legend>Show new arrivals or books on order?</legend>
        <input
          type="radio"
          className="switch-input"
          name="view"
          value="New Arrival" id="newArrivalInput"
          checked={this.state.availabilityType === 'New Arrival'}
          onChange={this.onChange}
        />
        <label
          htmlFor="newArrivalInput"
          className="switch-label label-left"
        >
          New Arrivals
        </label>
        <input
          type="radio"
          className="switch-input"
          name="view"
          value="On Order"
          id="onOrderInput"
          checked={this.state.availabilityType === 'On Order'}
          onChange={this.onChange}
        />
        <label
          htmlFor="onOrderInput"
          className="switch-label label-right"
        >
          On Order
        </label>
        <span className="switch-selection"></span>
      </fieldset>
    );
  }
}

export default FilterToggle;
