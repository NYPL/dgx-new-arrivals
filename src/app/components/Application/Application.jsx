import React from 'react';

import Header from 'dgx-header-component';
import Footer from 'dgx-react-footer';

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
        <Header skipNav={{ target: 'maincontent' }} />

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
            <NewArrivals />
          </div>
        </div>

        <Footer />
      </div>
    );
  }
}

export default App;
