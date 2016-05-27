import React from 'react';
import { createHistory } from 'history';

import NewArrivalsStore from '../../stores/Store.js';
import Actions from '../../actions/Actions.js';

import {
  makeQuery,
  makeApiCall,
} from '../../utils/utils.js';
import config from '../../../../appConfig.js';
import { mapObject as _mapObject } from 'underscore';

const { newArrival, onOrder } = config.availability;
const history = createHistory();

// can select multiple filters but only one per each category.
class FilterToggle extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.stateChange = this.stateChange.bind(this);
    this.selectFilter = this.selectFilter.bind(this);
    this.manageHistory = this.manageHistory.bind(this);
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
    const queries = makeQuery(filters, availability, pageNum, update, publicationType);

    Actions.updateAvailabilityType(availability);
    this.selectFilter(queries);
  }

  stateChange() {
    this.setState(NewArrivalsStore.getState());
  }

  manageHistory() {
    let query = '?';
    const {
      filters,
      availabilityType,
      publicationType,
      pageNum,
    } = this.state;

    _mapObject(filters, (val, key) => {
      if (val) {
        query += `&${key}=${val}`;
      }
    });

    if (this.state.availabilityType === 'On Order') {
      query += '&availability=On%20Order';
    }

    if (publicationType === 'justAdded') {
      query += '&publishYear=justAdded';
    }

    if (pageNum !== 2) {
      query += `&pageNum=${pageNum-1}`;
    }

    query = (query === '?') ? '' : query;

    history.push({
      // pathname: '/the/path',
      search: query,
      // state: { the: 'state' }
    })
  }

  selectFilter(queries = '') {
    makeApiCall(queries, response => {
      Actions.updateNewArrivalsData(response.data);
      this.manageHistory();
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
