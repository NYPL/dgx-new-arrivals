import React from 'react';
import {
  every as _every,
  map as _map,
  keys as _keys,
} from 'underscore';
import {
  XIcon,
} from 'dgx-svg-icons';


import NewArrivalsStore from '../../stores/Store.js';
import Actions from '../../actions/Actions.js';

import {
  makeQuery,
  makeApiCall,
} from '../../utils/utils.js';

class SelectedFilters extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.getFilterList = this.getFilterList.bind(this);
    this.removeFilter = this.removeFilter.bind(this);

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
    return _map(_keys(filters), (filter, i) => {
      const value = filters[filter];

      if (value) {
        return (
          <li key={i}>
            <a href="#" onClick={() => this.removeFilter(filter)}>
              {value}
              <XIcon height="20" width="20" />
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

    // If every filter is blank, then we want to remove the Active flag
    // for the toggle popup.
    const active = _every(filters, f => f === '');

    if (active) {
      Actions.updateActiveFilters(false);
    }

    // let items = 18;

    // if (queries) {
    //   items = 18 * (this.state.pageNum - 1);
    // }

    const queries = makeQuery(filters, availability);

    Actions.updateFiltered(filters);

    makeApiCall(queries, response => {
      Actions.updateNewArrivalsData(response.data);
    });
  }

  render() {
    const filters = this.getFilterList(this.state.filters);

    return filters && filters.length ? <ul className="selectedFilters">{filters}</ul> : null;
  }
}

export default SelectedFilters;
