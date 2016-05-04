import React from 'react';

import axios from 'axios';

import Actions from '../../actions/Actions.js';

// can select multiple filters but only one per each category.
class FilterToggle extends React.Component {
  constructor(props) {
    super(props);

    this.manageSelected = this.manageSelected.bind(this);
    this._onChange = this._onChange.bind(this);
    this._selectFilter = this._selectFilter.bind(this);
    this.state = {
      value: 'New Arrival',
    };
  }

  _selectFilter(availability = 'New Arrival', queries = '') {
    axios
      .get(`/api?${queries}&availability=${availability}&itemCount=18`)
      .then(response => {
        Actions.updateNewArrivalsData(response.data);

        setTimeout(() => {
          Actions.isotopeUpdate(true);
        }, 300);
      })
      .catch(error => {
        console.log(`error making ajax call: ${error}`);
      }); /* end Axios call */
  }

  manageSelected(item) {
    const filter = item.filter.toLowerCase();

    // ES6 dynamic keys! woohoo
    this.setState({
      [filter]: item.selected,
    });
  }

  _onChange(e) {
    const availability = e.currentTarget.value;

    this._selectFilter(availability);
    this.setState({
      value: e.currentTarget.value,
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
          value="New Arrival" id="newArrivalInput"
          checked={this.state.value === 'New Arrival'}
          onChange={this._onChange}
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
          checked={this.state.value === 'On Order'}
          onChange={this._onChange}
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
