import React from 'react';
import ReactDOM from 'react-dom';

import _ from 'underscore';

import NewArrivalsStore from '../../stores/Store.js';
import Isotopes from '../Isotopes/Isotopes.jsx';
import DisplayBtns from '../DisplayBtns/DisplayBtns.jsx';

let styles = {
  bookItemsWidth: {
    width: '4500px',
  },
};

class App extends React.Component {
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

  // Event listeners
  componentDidMount() {
    NewArrivalsStore.listen(this._onChange);
  }

  componentWillUnmount() {
    NewArrivalsStore.unlisten(this._onChange);
  }

  _onChange() {
    this.setState({
      displayType: NewArrivalsStore.getState().displayType
    });
  }

  render() {
    const books = this.state.all;
    let displayType = this.state.displayType;

    return (
      <div className="app-wrapper">
        <DisplayBtns />
        <Isotopes
          booksArr={books}
          displayType={displayType} />
      </div>
    );
  }
}

export default App;
