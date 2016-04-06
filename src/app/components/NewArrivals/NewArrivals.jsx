import React from 'react';
import ReactDOM from 'react-dom';

import _ from 'underscore';
import axios from 'axios';

import NewArrivalsStore from '../../stores/Store.js';
import Actions from '../../actions/Actions.js';
import Isotopes from '../Isotopes/Isotopes.jsx';
import ToggleDisplay from '../ToggleDisplay/ToggleDisplay.jsx';
import SelectedFilters from '../SelectedFilters/SelectedFilters.jsx';
import appConfig from '../../../../appConfig.js';

import PaginationButton from '../Buttons/PaginationButton.jsx';

const { appFilters } = appConfig;

/**
 * Renders the main section of the New Arrivals app.
 */
class NewArrivals extends React.Component {
  constructor(props) {
    super(props);

    const store = NewArrivalsStore.getState();
    this.state = NewArrivalsStore.getState();

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
    let queries = '';

    for (let filter in filters) {
      if (filters[filter] !== '') {
        queries += `&${filter}=${filters[filter]}`;
      }
    }

    axios
      .get(`/api?${queries}&itemCount=18`)
      .then(response => {
        Actions.addMoreItems(response.data.bibItems);

        setTimeout(() => {
          Actions.isotopeUpdate(true);
        }, 300);
      })
      .catch(error => {
        console.log(`error making ajax call: ${error}`);
      }); /* end Axios call */
  }

  render() {
    const books = this.state.newArrivalsData ? this.state.newArrivalsData.bibItems : [];
    const displayType = this.state.displayType;
    const isLoading = false;

    return (
      <div className="newArrivals-container">
        <h4>Browse New Releases</h4>
        <SelectedFilters />
        <ToggleDisplay />
        <Isotopes
          booksArr={books}
          displayType={displayType} />
        <PaginationButton
          id='page-button'
          className={`page-button`}
          dots="3"
          label="LOAD MORE"
          isLoading={isLoading}
          onClick={this.loadMore}/>
      </div>
    );
  }
}

export default NewArrivals;
