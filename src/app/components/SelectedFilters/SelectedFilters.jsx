import React from 'react';
import {
  every as _every,
  map as _map,
  keys as _keys,
  mapObject as _mapObject,
} from 'underscore';
import {
  XIcon,
} from 'dgx-svg-icons';

import NewArrivalsStore from '../../stores/Store.js';
import Actions from '../../actions/Actions.js';

import {
  makeQuery,
  makeApiCall,
  createAppHistory,
} from '../../utils/utils.js';

const history = createAppHistory();

class SelectedFilters extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.getFilterList = this.getFilterList.bind(this);
    this.removeFilter = this.removeFilter.bind(this);
    this.manageHistory = this.manageHistory.bind(this);
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
            <button onClick={() => this.removeFilter(filter)}>
              {value}
              <XIcon height="20" width="20" />
            </button>
          </li>
        );
      }

      return null;
    });
  }

  manageHistory() {
    const {
      filters,
      availabilityType,
      pageNum,
      publicationType,
    } = this.state;
    let query = '?';

    _mapObject(filters, (val, key) => {
      if (val) {
        query += `&${key}=${val}`;
      }
    });

    if (availabilityType === 'On Order' &&
      query.indexOf('availability') !== -1) {
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

  removeFilter(filter) {
    const {
      availabilityType,
      filters,
      pageNum,
      publicationType,
    } = this.state;
    let update = true;
    let page = pageNum;

    filters[filter] = '';

    // If every filter is blank, then we want to remove the Active flag
    // for the toggle popup.
    const active = _every(filters, f => f === '');

    if (active) {
      Actions.updateActiveFilters(false);
      Actions.updatePageNum(false);
      page = 1;
      update = false;
    }

    const queries = makeQuery(filters, availabilityType, page, update, publicationType);

    Actions.updateFiltered(filters);

    makeApiCall(queries, response => {
      Actions.updateNewArrivalsData(response.data);
      this.manageHistory();
    });
  }

  render() {
    const filters = this.getFilterList(this.state.filters);

    return filters && filters.length ?
      <ul className="selectedFilters">{filters}</ul> :
      null;
  }
}

export default SelectedFilters;
