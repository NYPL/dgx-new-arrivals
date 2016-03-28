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

        <div className="nyplNewArrivals nyplGrid">

          <div id={`back-button-wrapper`} className={`back-button-wrapper`}>
            <a id={`back-button`} className={`back-button`}>
              <span className={`back-button__icon nypl-icon-circle-arrow-left`}>
              </span>
              <div className={`back-button__text`}>
                <p>Books/<br />Music/<br />DVDs</p>
              </div>
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
