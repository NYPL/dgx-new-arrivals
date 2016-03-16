import React from 'react';
import ReactDOM from 'react-dom';

import _ from 'underscore';
import axios from 'axios';

import NewArrivalsStore from '../../stores/Store.js';
import Actions from '../../actions/Actions.js';
import Isotopes from '../Isotopes/Isotopes.jsx';
import ToggleDisplay from '../ToggleDisplay/ToggleDisplay.jsx';

/**
 * Renders the main section of the New Arrivals app.
 */
class NewArrivals extends React.Component {
  constructor(props) {
    super(props);

    const store = NewArrivalsStore.getState();
    this.state = {
      // all: _.flatten(store.newArrivalsData),
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
        <ul style={{cursor: 'pointer', display: 'inline-block'}}>
          <li onClick={this._updateBooks.bind(this, 'BOOK/TEXT', 18)}>BOOK/TEXT</li>
          <li onClick={this._updateBooks.bind(this, 'E-BOOK', 18)}>E-BOOK</li>
          <li onClick={this._updateBooks.bind(this, 'LARGE%20PRINT', 18)}>LARGE PRINT</li>
          <li onClick={this._updateBooks.bind(this, 'AUDIOBOOK', 18)}>AUDIOBOOK</li>
          <li onClick={this._updateBooks.bind(this, 'E-AUDIOBOOK', 18)}>E-AUDIOBOOK</li>
          <li onClick={this._updateBooks.bind(this, 'DVD', 18)}>DVD</li>
          <li onClick={this._updateBooks.bind(this, 'BLU-RAY', 18)}>BLU-RAY</li>
          <li onClick={this._updateBooks.bind(this, 'MUSIC%20CD', 18)}>MUSIC CD</li>
        </ul>
        <ToggleDisplay />
        <Isotopes
          booksArr={books}
          displayType={displayType} />
      </div>
    );
  }
}

export default NewArrivals;
