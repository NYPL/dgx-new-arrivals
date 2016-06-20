import React from 'react';

import Header from 'dgx-header-component';
import Footer from 'dgx-react-footer';

import NewArrivals from '../NewArrivals/NewArrivals.jsx';

/**
 * The main React component for New Arrivals.
 * @extends {React}
 */
const App = () => (
  <div className="nyplNewArrivalsApp">
    <Header skipNav={{ target: 'maincontent' }} />

    <div className="nyplNewArrivals nyplGrid-fullWidth">

      <div id="left-navigation" className="left-navigation">
        <a className="browse-button" href="/browse">
          Browse >
        </a>
        <span className="landing-page-link">New Arrivals</span>
      </div>

      <div className="main-content">
        <NewArrivals />
      </div>
    </div>

    <Footer />
  </div>);

export default App;
