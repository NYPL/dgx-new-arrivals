import React from 'react';
import ReactDOM from 'react-dom';

import _ from 'underscore';

import NewArrivalsStore from '../../stores/Store.js';
import Actions from '../../actions/Actions.js';

// can select multiple filters but only one per each category.
class FilterToggle extends React.Component {
  constructor(props) {
    super(props);

    this.manageSelected = this.manageSelected.bind(this);
    this._onChange = this._onChange.bind(this);
    this.state = {
      value: 'newArrival',
    }
  }

  _selectFilter(queries) {
    axios
      .get(`/api?${queries}&itemCount=18`)
      .then(response => {
        console.log(response.data);
        Actions.updateNewArrivalsData(response.data);
        Actions.updateFiltered(this.state);

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
      [filter]: item.selected
    });
  }

  _onChange(e) {
    console.log(e.currentTarget.value);
    this.setState({
      value: e.currentTarget.value,
    });
  }

  render() {
    // console.log(this.state);
    return (
      <fieldset className="switch" tabIndex="0">
        <legend>Show new arrivals or books on order?</legend>
        <input type="radio" className="switch-input"
          name="view" value="newArrival" id="newArrivalInput"
          checked={this.state.value === 'newArrival'}
          onChange={this._onChange} />
        <label htmlFor="newArrivalInput" className="switch-label label-left">New Arrival</label>
        <input type="radio" className="switch-input"
          name="view" value="onOrder" id="onOrderInput"
          checked={this.state.value === 'onOrder'} 
          onChange={this._onChange} />
        <label htmlFor="onOrderInput" className="switch-label label-right">On Order</label>
        <span className="switch-selection"></span>
      </fieldset>
    );
  }
}

export default FilterToggle;
