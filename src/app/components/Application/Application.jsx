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
          <Search />

          <NewArrivals />
        </div>

        <Footer />
      </div>
    );
  }
}

export default App;
