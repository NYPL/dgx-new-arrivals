import React from 'react';
import ReactDOM from 'react-dom';

import _ from 'underscore';
import ReactPaginate from 'react-paginate';
import axios from 'axios';

import Header from 'dgx-header-component';
import Footer from 'dgx-react-footer';

import NewArrivalsStore from '../../stores/Store.js';
import Actions from '../../actions/Actions.js';
import Isotopes from '../Isotopes/Isotopes.jsx';
import ToggleDisplay from '../ToggleDisplay/ToggleDisplay.jsx';

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
    const pagination = (<ReactPaginate previousLabel={"<"}
      nextLabel={">"}
      breakLabel={<li className="break"><a href="">...</a></li>}
      pageNum={10}
      marginPagesDisplayed={1}
      pageRangeDisplayed={3}
      clickCallback={this.handlePageClick.bind(this)}
      containerClassName={"pagination"}
      subContainerClassName={"pages pagination"}
      activeClassName={"active"} />);

    return (
      <div>
        <Header />
        <div className="app-wrapper">
          <h3>Browse New Arrivals</h3>
          <ToggleDisplay />
          <Isotopes
            booksArr={books}
            displayType={displayType} />
        </div>

        <Footer />
      </div>
    );
  }
}

export default App;
