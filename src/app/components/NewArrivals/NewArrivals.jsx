import React from 'react';
import ReactDOM from 'react-dom';

import _ from 'underscore';
import axios from 'axios';

import NewArrivalsStore from '../../stores/Store.js';
import Actions from '../../actions/Actions.js';
import Isotopes from '../Isotopes/Isotopes.jsx';
import ToggleDisplay from '../ToggleDisplay/ToggleDisplay.jsx';


class SelectedFilters extends React.Component {
  constructor(props) {
    super(props);

    this._onChange = this._onChange.bind(this);
    this._getFilterList = this._getFilterList.bind(this);
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

  _getFilterList(filters) {
    return _.map(this.state.filters, (filter, i) => {
      if (filter) {
        return <li key={i}>{filter}</li>;
      }

      return null;
    });
  }

  render() {
    const filters = this._getFilterList(this.state.filters);

    return filters.length ? <ul className="selectedFilters">{filters}</ul> : null;
  }
}

/**
 * Renders the main section of the New Arrivals app.
 */
class NewArrivals extends React.Component {
  constructor(props) {
    super(props);

    const store = NewArrivalsStore.getState();
    this.state = {
      all: store.newArrivalsData.bibItems,
      displayType: store.displayType,
    };

    this._onChange = this._onChange.bind(this);
    this._updateBooks = this._updateBooks.bind(this);
  }

  componentDidMount() {
    NewArrivalsStore.listen(this._onChange);
  }

  componentWillUnmount() {
    NewArrivalsStore.unlisten(this._onChange);
  }

  _onChange() {
    this.setState({
      displayType: NewArrivalsStore.getState().displayType,
      all: NewArrivalsStore.getState().newArrivalsData.bibItems
    });
  }

  _updateBooks(format, itemCount) {
    axios
      .get(`/api?format=${format}&itemCount=${itemCount}`)
      .then(response => {
        Actions.updateNewArrivalsData(response.data);
      }); /* end axios call */
  }

  render() {
    const books = this.state.all;
    const displayType = this.state.displayType;

    return (
      <div className="newArrivals-container">
        <h4>Browse New Releases</h4>
        <SelectedFilters />
        <ToggleDisplay />
        <Isotopes
          booksArr={books}
          displayType={displayType} />
      </div>
    );
  }
}

export default NewArrivals;
