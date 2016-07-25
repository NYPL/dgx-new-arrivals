import React from 'react';

import NewArrivalsStore from '../../stores/Store.js';
import Actions from '../../actions/Actions.js';

import {
  makeFrontEndQuery,
  makeApiCall,
  createAppHistory,
  manageHistory,
  trackNewArrivals,
} from '../../utils/utils.js';
import config from '../../../../appConfig.js';

const { newArrival, onOrder } = config.availability;

const history = createAppHistory();

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

  onChange(e) {
    const {
      filters,
      pageNum,
      publicationType,
    } = this.state;
    const availability = e.currentTarget.value;
    const update = true;
    const queries = makeFrontEndQuery(filters, availability, pageNum, publicationType, update);

    trackNewArrivals('Toggle Availability Type', availability);
    Actions.updateAvailabilityType(availability);
    this.selectFilter(queries);
  }

  stateChange() {
    this.setState(NewArrivalsStore.getState());
  }

  selectFilter(queries = '') {
    makeApiCall(queries, response => {
      const displayPagination = response.data.bibItems.length !== 0;
      Actions.updateDisplayPagination(displayPagination);
      Actions.updateNewArrivalsData(response.data);
      manageHistory(this.state, history);
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
          aria-labelledby="label-newArrivals"
        />
        <label
          htmlFor="newArrivalInput"
          className="switch-label label-left"
          id="label-newArrivals"
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
          aria-labelledby="label-onOrder"
        />
        <label
          htmlFor="onOrderInput"
          className="switch-label label-right"
          id="label-onOrder"
        >
          {onOrder.label}
        </label>
        <span className="switch-selection"></span>
      </fieldset>
    );
  }
}

export default FilterToggle;
