import React from 'react';
import axios from 'axios';
import { extend as _extend } from 'underscore';

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
} from '../../utils/utils.js';

import {
  mapObject as _mapObject,
  omit as _omit,
  pick as _pick,
  isEmpty as _isEmpty,
} from 'underscore';

const { introText } = appConfig;

const history = createAppHistory();

history.listen(location => {
  const {
    action,
    search,
    state,
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
      const displayPagination = response.data.bibItems.length === 0 ? false : true;
      Actions.updateDisplayPagination(displayPagination);
      Actions.addMoreItems(response.data.bibItems);
      Actions.updatePageNum(true);

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
    } = this.state;
    const books = newArrivalsData && newArrivalsData.bibItems ? newArrivalsData.bibItems : [];
    const paginationHidden = displayPagination ? '' : 'hide';

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
