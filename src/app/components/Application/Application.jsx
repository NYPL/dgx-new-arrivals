import React from 'react';
import ReactDOM from 'react-dom';

import Header from 'dgx-header-component';
import Footer from 'dgx-react-footer';

import Search from '../Search/Search.jsx';
import NewArrivals from '../NewArrivals/NewArrivals.jsx';

/**
 * The main React component for New Arrivals.
 * @extends {React}
 */
class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="nyplNewArrivalsApp">
        <Header />

        <div className="nyplNewArrivals nyplGrid-fullWidth">

          <div id="left-navigation" className="left-navigation">
            <a className="browse-button" href="http://nypl.org/browse">
              Browse >
            </a>
            <a id="back-button" className="back-button">
              <span>Books/ Music/ DVDs</span>
            </a>
          </div>

          <div className="main-content">
            <Search />

            <NewArrivals />
          </div>
        </div>

        <Footer />
      </div>
    );
  }
}

export default App;
