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

  render() {
    const books = this.state.all;
    const displayType = this.state.displayType;

    return (
      <div className="newArrivals-container">
        <h4>Browse New Releases</h4>
        <ToggleDisplay />
        <Isotopes
          booksArr={books}
          displayType={displayType} />
      </div>
    );
  }
}

export default NewArrivals;
