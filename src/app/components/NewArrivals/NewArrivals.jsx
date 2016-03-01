import React from 'react';
import ReactDOM from 'react-dom';

import _ from 'underscore';

import NewArrivalsStore from '../../stores/Store.js';
import Actions from '../../actions/Actions.js';
import Isotopes from '../Isotopes/Isotopes.jsx';
import ToggleDisplay from '../ToggleDisplay/ToggleDisplay.jsx';

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

  // Event listeners
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

  handlePageClick(data) {
    const page = data.selected + 1;
    const tempUrl = `http://10.224.6.14:8087/categories/1?days=20&pageNum=${page}`;

    axios
      .get(`/${page}`)
      .then(response => {
        Actions.updateNewArrivalsData(response.data);
      }); /* end axios call */

  };

  render() {
    const books = this.state.all;
    const displayType = this.state.displayType;

    return (
      <div className="nyplNewArrivalsApp">
        <h2>Browse New Releases</h2>
        <ToggleDisplay />
        <Isotopes
          booksArr={books}
          displayType={displayType} />
      </div>
    );
  }
}

export default NewArrivals;
