import React from 'react';

import _ from 'underscore';
import axios from 'axios';

import NewArrivalsStore from '../../stores/Store.js';
import Actions from '../../actions/Actions.js';

class SelectedFilters extends React.Component {
  constructor(props) {
    super(props);

    this._onChange = this._onChange.bind(this);
    this._getFilterList = this._getFilterList.bind(this);
    this._removeFilter = this._removeFilter.bind(this);
    this._makeQuery = this._makeQuery.bind(this);
    this.state = NewArrivalsStore.getState();
  }

  componentDidMount() {
    NewArrivalsStore.listen(this._onChange);
  }

  componentWillUnmount() {
    NewArrivalsStore.unlisten(this._onChange);
  }

  _onChange() {
    this.setState(NewArrivalsStore.getState());
  }

  _makeQuery(filters) {
    let queries = '';

    for (const filter in filters) {
      if (filters[filter] !== '') {
        queries += `&${filter}=${filters[filter]}`;
      }
    }

    return queries;
  }

  _removeFilter(filter) {
    const filters = this.state.filters;
    filters[filter] = '';

    Actions.updateFiltered(_.omit(filters, 'active'));

    if (!filters.length) {
      Actions.updateActiveFilters(false);
    }

    const queries = this._makeQuery(filters);

    axios
      .get(`/api?${queries}&itemCount=18`)
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

  _getFilterList(filters) {
    return _.map(Object.keys(filters), (filter, i) => {
      const value = filters[filter];

      if (value && filter !== 'active') {
        return (
          <li key={i}>
            <a href="#" onClick={this._removeFilter.bind(this, filter)}>
              {value}
              <span className="nypl-icon-solo-x icon"></span>
            </a>
          </li>
        );
      }

      return null;
    });
  }

  render() {
    const filters = this._getFilterList(this.state.filters);

    return filters && filters.length ? <ul className="selectedFilters">{filters}</ul> : null;
  }
}

export default SelectedFilters;
