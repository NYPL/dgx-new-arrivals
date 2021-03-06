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
  makeFrontEndQuery,
  makeApiCall,
  createAppHistory,
  manageHistory,
  getFilterLabel,
  trackNewArrivals,
} from '../../utils/utils.js';

const history = createAppHistory();

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
      const label = getFilterLabel(filter, value);

      if (value.indexOf('Any') === 0) {
        return null;
      }

      if (value) {
        return (
          <li key={i}>
            <button
              onClick={() => this.removeFilter(filter)}
              aria-controls="isotopesContainer"
            >
              <span aria-label={`${label}. Click to remove this filter`}>{label}</span>
              <XIcon height="20" width="20" ariaHidden />
            </button>
          </li>
        );
      }

      return null;
    });
  }

  removeFilter(filter) {
    const {
      availabilityType,
      filters,
      pageNum,
      publicationType,
    } = this.state;
    const filterToRemove = filters[filter];
    let update = true;
    let page = pageNum;

    filters[filter] = `Any${filter[0].toUpperCase()}${filter.substring(1)}`;

    // If every filter is blank, then we want to remove the Active flag
    // for the toggle popup.
    const active = _every(filters, f => f === '');

    if (active) {
      Actions.updateActiveFilters(false);
      Actions.updatePageNum(false);
      page = 1;
      update = false;
    }

    const queries = makeFrontEndQuery(filters, availabilityType, page, publicationType, update);

    trackNewArrivals('Remove Filter Active Display', `${filter} - ${filterToRemove}`);

    makeApiCall(queries, response => {
      const displayPagination = response.data.bibItems.length !== 0;

      Actions.updateDisplayPagination(displayPagination);
      Actions.updateFiltered(filters);
      Actions.updateNewArrivalsData(response.data);
      manageHistory(this.state, history);
    });
  }

  render() {
    const filters = this.getFilterList(this.state.filters);

    return (filters && filters.length) ?
      <ul className="selectedFilters">{filters}</ul> :
      null;
  }
}

export default SelectedFilters;
