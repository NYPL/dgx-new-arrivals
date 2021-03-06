import React from 'react';

import { Header, navConfig } from '@nypl/dgx-header-component';
import Footer from '@nypl/dgx-react-footer';

import NewArrivals from '../NewArrivals/NewArrivals.jsx';
import Sidebar from '../Sidebar/Sidebar.jsx';

/**
 * The main React component for New Arrivals.
 * @extends {React}
 */
const App = () => (
  <div className="nyplNewArrivalsApp">
    <Header
      skipNav={{ target: 'mainContent' }}
      navData={navConfig.current}
    />

    <div className="nyplNewArrivals-grid nyplGrid-fullWidth">

      <Sidebar />

      <div className="nyplNewArrivals-container">
        <NewArrivals />
      </div>
    </div>

    <Footer id="footer" className="footer" />
  </div>
);

export default App;
