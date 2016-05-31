import React from 'react';
import axios from 'axios';
import { extend as _extend } from 'underscore';
import { createHistory, createMemoryHistory, useQueries } from 'history';

import NewArrivalsStore from '../../stores/Store.js';
import Actions from '../../actions/Actions.js';

import Isotopes from '../Isotopes/Isotopes.jsx';
import ToggleDisplay from '../ToggleDisplay/ToggleDisplay.jsx';
import SelectedFilters from '../SelectedFilters/SelectedFilters.jsx';
import PaginationButton from '../Buttons/PaginationButton.jsx';
import appConfig from '../../../../appConfig.js';

import {
  makeQuery,
  makeApiCall,
} from '../../utils/utils.js';

import {
  mapObject as _mapObject,
  omit as _omit,
  pick as _pick,
} from 'underscore';

const { introText } = appConfig;

let history;
if (typeof(window) !== 'undefined') {
  history = useQueries(createHistory)();
} else {
  history = useQueries(createMemoryHistory)();
}

history.listen(location => {
  const {
    action,
    search,
    query,
  } = location;

  const filters = _omit(query, ['availability','publishYear', 'pageNum']);
  const {
    pageNum,
    availability,
    publishYear,
  } = query;

  if (action === 'POP') {
    makeApiCall(search, response => {
      console.log('Making call from historyjs');
      if (response.data && response.data.bibItems) {
        Actions.updateFiltered(filters);
        Actions.updateNewArrivalsData(response.data);
        Actions.updatePublicationType(publishYear);
        Actions.updateAvailabilityType(availability);
      }
    });
  }
});

/**
 * Renders the main section of the New Arrivals app.
 */
class NewArrivals extends React.Component {
  constructor(props) {
    super(props);

    this.state = _extend({
      isLoading: false,
    }, NewArrivalsStore.getState());

    this.onChange = this.onChange.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.manageHistory = this.manageHistory.bind(this);
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

  loadMore() {
    const {
      filters,
      availabilityType,
      pageNum,
      publicationType,
    } = this.state;

    const queries = makeQuery(filters, availabilityType, pageNum, false, publicationType);

    axios.interceptors.request.use(config => {
      // Do something before request is sent
      this.setState({ isLoading: true });
      return config;
    }, error => Promise.reject(error));

    // Add PAGE NUMBER
    makeApiCall(queries, response => {
      Actions.addMoreItems(response.data.bibItems);
      Actions.updatePageNum(true);

      this.manageHistory();

      this.setState({ isLoading: false });
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

    if (availabilityType === 'On Order') {
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

  render() {
    const books = this.state.newArrivalsData && this.state.newArrivalsData.bibItems ?
      this.state.newArrivalsData.bibItems : [];
    const displayType = this.state.displayType;
    const isLoading = this.state.isLoading;
    const paginationHidden = books.length ? '' : 'hide';

    return (
      <div className="newArrivals-container" id="maincontent" tabIndex="-1">
        <h4>New Arrivals</h4>
        <p className="newArrivals-introText">
          {introText}
        </p>
        <SelectedFilters />
        <ToggleDisplay />
        <Isotopes
          booksArr={books}
          displayType={displayType}
        />
        <PaginationButton
          id="page-button"
          hidden={paginationHidden}
          className="page-button"
          dots={3}
          label="LOAD MORE"
          isLoading={isLoading}
          onClick={this.loadMore}
        />
      </div>
    );
  }
}

export default NewArrivals;
