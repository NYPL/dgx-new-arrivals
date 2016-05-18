import React from 'react';

import {
  every as _every,
  map as _map,
  mapObject as _mapObject,
  omit as _omit,
} from 'underscore';

import axios from 'axios';

import NewArrivalsStore from '../../stores/Store.js';
import Actions from '../../actions/Actions.js';

import { formatFilters } from '../../utils/utils.js';

class SelectedFilters extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.getFilterList = this.getFilterList.bind(this);
    this.removeFilter = this.removeFilter.bind(this);
    this.makeQuery = this.makeQuery.bind(this);

    this.state = NewArrivalsStore.getState();
  }

  componentDidMount() {
    NewArrivalsStore.listen(this.onChange);
  }

  componentWillUnmount() {
    NewArrivalsStore.unlisten(this.onChange);
  }

  onChange() {
    this.setState(NewArrivalsStore.getState());
  }

  getFilterList(filters) {
    return _map(Object.keys(filters), (filter, i) => {
      const value = filters[filter];

      if (value && filter !== 'active') {
        return (
          <li key={i}>
            <a href="#" onClick={() => this.removeFilter(filter)}>
              {value}
              <span className="nypl-icon-solo-x icon"></span>
            </a>
          </li>
        );
      }

      return null;
    });
  }

  removeFilter(filter) {
    const availability = this.state.availabilityType;
    const filters = this.state.filters;
    filters[filter] = '';

    Actions.updateFiltered(_omit(filters, 'active'));

    const active = _every(filters, f => f === '');

    if (active) {
      Actions.updateActiveFilters(false);
    }

    const queries = this.makeQuery(filters);
    let items = 18;

    if (queries) {
      items = 18 * (this.state.pageNum - 1);
    }

    axios
      .get(`/api?${queries}&availability=${availability}&itemCount=${items}`)
      .then(response => {
        Actions.updateNewArrivalsData(response.data);
      })
      .catch(error => {
        console.log(`error making ajax call: ${error}`);
      }); /* end Axios call */
  }

  makeQuery(filters) {
    let queries = '';

    _mapObject(filters, (val, key) => {
      if (val !== '') {
        queries += `&${key}=${val}`;
      } else if (key === 'format') {
        queries += `&format=${formatFilters()}`;
      }
    });

    return queries;
  }

  render() {
    const filters = this.getFilterList(this.state.filters);

    return filters && filters.length ? <ul className="selectedFilters">{filters}</ul> : null;
  }
}

export default SelectedFilters;
