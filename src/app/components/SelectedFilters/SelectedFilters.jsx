import React from 'react';

import _ from 'underscore';
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

  removeFilter(filter) {
    const availability = this.state.availabilityType;
    const filters = this.state.filters;
    filters[filter] = '';

    Actions.updateFiltered(_.omit(filters, 'active'));

    if (!filters.length) {
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

  getFilterList(filters) {
    return _.map(Object.keys(filters), (filter, i) => {
      const value = filters[filter];

      if (value && filter !== 'active') {
        return (
          <li key={i}>
            <a href="#" onClick={this.removeFilter.bind(this, filter)}>
              {value}
              <span className="nypl-icon-solo-x icon"></span>
            </a>
          </li>
        );
      }

      return null;
    });
  }

  makeQuery(filters) {
    let queries = '';

    for (const filter in filters) {
      if (filters[filter] !== '') {
        queries += `&${filter}=${filters[filter]}`;
      } else if (filter === 'format') {
        queries += `&format=${formatFilters()}`;
      }
    }

    return queries;
  }

  render() {
    const filters = this.getFilterList(this.state.filters);

    return filters && filters.length ? <ul className="selectedFilters">{filters}</ul> : null;
  }
}

export default SelectedFilters;
