import React from 'react';

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
  }

  // Event listeners
  componentDidMount() {
    NewArrivalsStore.listen(this._onChange);
  }

  componentWillUnmount() {
    NewArrivalsStore.unlisten(this._onChange);
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

  
  render() {
    const books = this._generateItemsToDisplay();

    return (
      <div className='app-wrapper'>
        {books}
      </div>
    );
  }
}

export default App;
