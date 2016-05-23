import React from 'react';

import NewArrivalsStore from '../../stores/Store.js';
import Actions from '../../actions/Actions.js';

import {
  makeQuery,
  makeApiCall,
} from '../../utils/utils.js';
import config from '../../../../appConfig.js';

const { newArrival, onOrder } = config.availability;

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
    const queries = makeQuery(this.state.filters, availability);

    Actions.updateAvailabilityType(availability);
    this.selectFilter(queries);
  }

  selectFilter(queries = '') {
    makeApiCall(queries, response => {
      Actions.updateNewArrivalsData(response.data);
    });
  }

  render() {
    return (
      <fieldset className="switch" tabIndex="0">
        <legend>Show new arrivals or books on order?</legend>
        <input
          type="radio"
          className="switch-input"
          name="view"
          value={newArrival.id}
          id="newArrivalInput"
          checked={this.state.availabilityType === newArrival.id}
          onChange={this.onChange}
        />
        <label
          htmlFor="newArrivalInput"
          className="switch-label label-left"
        >
          {newArrival.label}
        </label>
        <input
          type="radio"
          className="switch-input"
          name="view"
          value={onOrder.id}
          id="onOrderInput"
          checked={this.state.availabilityType === onOrder.id}
          onChange={this.onChange}
        />
        <label
          htmlFor="onOrderInput"
          className="switch-label label-right"
        >
          {onOrder.label}
        </label>
        <span className="switch-selection"></span>
      </fieldset>
    );
  }
}

export default FilterToggle;
