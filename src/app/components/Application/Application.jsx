import React from 'react';
import ReactDOM from 'react-dom';

import _ from 'underscore';

import NewArrivalsStore from '../../stores/Store.js';
import BookCover from '../BookCover/BookCover.jsx';

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
      all: _.flatten(store.newArrivalsData),
    };

    this.isoOptions = {
      itemSelector: '.book-item',
      masonry: {
        columnWidth: 250,
        isResizable: true,
        isFitWidth: true,
        gutter: 10
      },
    };
  }

  // Event listeners
  componentDidMount() {
    NewArrivalsStore.listen(this._onChange);
    this._createIsotopeContainer();
  }

  componentWillUnmount() {
    NewArrivalsStore.unlisten(this._onChange);
    if (this.iso != null) {
      this.iso.destroy();
    }
  }

  _onChange() {
    this.setState({});
  }

  _generateItemsToDisplay() {
    const bookCoverItems = _.chain(NewArrivalsStore.getState().newArrivalsData)
      .flatten()
      .value();

    const books = bookCoverItems.map((element, i) => {
        const target = '#';
        return (
          <li className='book-item' key={i}>
            <a href={target} className="bookItem">
              <BookCover
                imgSrc={element.imageURL}
                alt=""
                className="cover-image" />
            </a>
          </li>
        );
      });

    return books;
  }

  _createIsotopeContainer() {
    if (this.iso == null) {
      this.iso = new Isotope(ReactDOM.findDOMNode(this.refs.isotopeContainer), this.isoOptions);
    }
  }
  
  render() {
    const books = this._generateItemsToDisplay();

    return (
      <div className="app-wrapper" ref="isotopeContainer">
        {books}
      </div>
    );
  }
}

export default App;
