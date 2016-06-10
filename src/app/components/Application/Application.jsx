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
        <a className="browse-button" href="http://octane.nypl.org/books-music-dvds">
          Books/ Music/ DVDs >
        </a>
        <a href="http://browse.nypl.org/iii/encore/homepage?lang=eng" className="landing-page-link">
          <span>General Catalog</span>
        </a>
      </div>

      <div className="main-content">
        <NewArrivals />
      </div>
    </div>

    <Footer />
  </div>);

export default App;
