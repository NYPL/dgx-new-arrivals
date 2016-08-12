import React from 'react';
import axios from 'axios';

import NewArrivalsStore from '../../stores/Store.js';
import Actions from '../../actions/Actions.js';

import Isotopes from '../Isotopes/Isotopes.jsx';
import ToggleDisplay from '../ToggleDisplay/ToggleDisplay.jsx';
import SelectedFilters from '../SelectedFilters/SelectedFilters.jsx';
import PaginationButton from '../Buttons/PaginationButton.jsx';
import appConfig from '../../../../appConfig.js';

import {
  makeFrontEndQuery,
  makeApiCall,
  createAppHistory,
  manageHistory,
  trackNewArrivals,
} from '../../utils/utils.js';

import {
  extend as _extend,
  omit as _omit,
} from 'underscore';

const { introText } = appConfig;

const history = createAppHistory();

history.listen(location => {
  const {
    action,
    search,
    query,
    state,
  } = location;
  const filters = _omit(query, ['availability', 'publishYear', 'pageNum']);
  const {
    availability,
    publishYear,
  } = query;

  if (state === null) {
    history.push({
      state: { start: true },
      search,
    });
  }

  if (action === 'POP' && state !== null) {
    makeApiCall(search, response => {
      const availabilityType = availability || 'New Arrival';
      const publicationType = publishYear || 'recentlyReleased';

      if (response.data && response.data.bibItems) {
        Actions.updateFiltered(filters);
        Actions.updateNewArrivalsData(response.data);
        Actions.updatePublicationType(publicationType);
        Actions.updateAvailabilityType(availabilityType);
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
    const updatedPage = (parseInt(pageNum, 10)) + 1;
    const queries = makeFrontEndQuery(filters, availabilityType, updatedPage, publicationType);

    axios.interceptors.request.use(config => {
      // Do something before request is sent
      this.setState({ isLoading: true });
      return config;
    }, error => Promise.reject(error));

    makeApiCall(queries, response => {
      const displayPagination = response.data.bibItems.length !== 0;
      Actions.updateDisplayPagination(displayPagination);
      Actions.addMoreItems(response.data.bibItems);
      Actions.updatePageNum(true);

      trackNewArrivals('Click', `Load More: page ${pageNum + 1}`);
      manageHistory(this.state, history);

      this.setState({ isLoading: false });
    });
  }

  render() {
    const {
      newArrivalsData,
      displayType,
      isLoading,
      displayPagination,
      filters,
    } = this.state;
    const books = newArrivalsData && newArrivalsData.bibItems ? newArrivalsData.bibItems : [];
    const paginationHidden = displayPagination ? '' : 'hide';
    const layoutFormat = filters.format ? filters.format.replace(/\s+/g, '') : '';

    return (
      <div className="newArrivals" id="mainContent" tabIndex="-1">
        <h1>New Arrivals</h1>
        <p className="newArrivals-introText">
          {introText}
        </p>
        <SelectedFilters />
        <ToggleDisplay />
        <Isotopes
          booksArr={books}
          displayType={displayType}
          format={layoutFormat}
        />
        <PaginationButton
          id="page-button"
          hidden={paginationHidden}
          className="page-button"
          dots={3}
          label="LOAD MORE"
          isLoading={isLoading}
          onClick={this.loadMore}
          aria-controls="isotopesContainer"
        />
      </div>
    );
  }
}

export default NewArrivals;
