import React from 'react';

import NewArrivalsStore from '../../stores/Store.js';
import Actions from '../../actions/Actions.js';
import Isotopes from '../Isotopes/Isotopes.jsx';
import ToggleDisplay from '../ToggleDisplay/ToggleDisplay.jsx';
import SelectedFilters from '../SelectedFilters/SelectedFilters.jsx';
import PaginationButton from '../Buttons/PaginationButton.jsx';
import appConfig from '../../../../appConfig.js';

import axios from 'axios';
import { extend as _extend } from 'underscore';

const { appFilters } = appConfig;

/**
 * Renders the main section of the New Arrivals app.
 */
class NewArrivals extends React.Component {
  constructor(props) {
    super(props);

    this.state = _extend({
      isLoading: false,
    }, NewArrivalsStore.getState());

    this._onChange = this._onChange.bind(this);
    this.loadMore = this.loadMore.bind(this);
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

  loadMore() {
    const filters = this.state.filters;
    const pageNum = this.state.pageNum;
    let queries = '';

    for (let filter in filters) {
      if (filters[filter] !== '') {
        queries += `&${filter}=${filters[filter]}`;
      }
    }

    console.log(`/api?${queries}&itemCount=18&pageNum=${pageNum}`);

    axios.interceptors.request.use(config => {
      // Do something before request is sent
      this.setState({ isLoading : true });
      return config;
    }, error => {
      // Do something with request error
      return Promise.reject(error);
    });

    axios
      .get(`/api?${queries}&itemCount=18&pageNum=${pageNum}`)
      .then(response => {
        Actions.addMoreItems(response.data.bibItems);
        Actions.updatePageNum(true);

        this.setState({ isLoading : false });

        setTimeout(() => {
          Actions.isotopeUpdate(true);
        }, 300);
      })
      .catch(error => {
        this.setState({ isLoading : false });
        console.log(`error making ajax call: ${error}`);
      }); /* end Axios call */
  }

  render() {
    const books = this.state.newArrivalsData && this.state.newArrivalsData.bibItems ?
      this.state.newArrivalsData.bibItems : [];
    const displayType = this.state.displayType;
    const isLoading = this.state.isLoading;
    const paginationHidden = books.length ? '' : 'hide';

    return (
      <div className="newArrivals-container" id="maincontent" tabIndex="-1">
        <h4>Browse New Releases</h4>
        <SelectedFilters />
        <ToggleDisplay />
        <Isotopes
          booksArr={books}
          displayType={displayType}
        />
        <PaginationButton
          id='page-button'
          hidden={paginationHidden}
          className={`page-button`}
          dots="3"
          label="LOAD MORE"
          isLoading={isLoading}
          onClick={this.loadMore}
        />
      </div>
    );
  }
}

export default NewArrivals;
