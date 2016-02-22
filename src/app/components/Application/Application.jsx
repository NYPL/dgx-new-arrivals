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
      filtered: _.flatten(store.newArrivalsData),
      value: [],
      genres: [],
    };

    this._generateItemsToDisplay = this._generateItemsToDisplay.bind(this);
    this._selectChange = this._selectChange.bind(this);
    this._selectGenreChange = this._selectGenreChange.bind(this);
    this._getAttrList = this._getAttrList.bind(this);
    this._createLabel = this._createLabel.bind(this);
    this._createSelectObj = this._createSelectObj.bind(this);
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
      filtered: this.state.filtered
    });
  }

  _selectChange(value) {
    console.log(`Selected: ${value}`);
    let data = this.state.all;

    if (value.length) {
      data = _.where(this.state.all, {contentType: value.toUpperCase()})
    } 

    this.setState({
      filtered: data,
      value
    });
  }

  _selectGenreChange(genres) {
    console.log(`Selected genre: ${genres}`);
    let data = this.state.all;

    if (genres.length) {
      data = _.where(this.state.all, {genre: genres})
    } 

    this.setState({
      filtered: data,
      genres
    });
  }

  _generateItemsToDisplay(bookLists) {
    const bookCoverItems = (bookLists && bookLists.length) ?
        bookLists.map((element, i) => {
          const target = element.link || '#';

          return (
            <div key={i} className="slick-book-item">
              <a href={target} className="bookItem" target="_parent">
                <BookCover
                  id={`item-${i}`}
                  imgSrc={element.imageURL}
                  alt=""
                  className="cover-image" />
              </a>
            </div>
          );
        })
        : null;

    if (bookLists && bookLists.length) {
      styles.bookItemsWidth.width = `${bookCoverItems.length * 149 - 29}px`;
    }

    return bookCoverItems;
  }

  _createLabel(str) {
    const key = str.replace(/[_]/g, '-');
    return key;
  }

  _createSelectObj(list) {
    const arr = _.map(list, l => {
        const obj = {};
        obj.value = l;
        obj.label = this._createLabel(l);

        return obj;
      });

    return arr;
  }

  _getAttrList(list, attr) {
    const values = _.chain(list)
      .pluck(attr)
      .unique()
      .value();

    return this._createSelectObj(values);
  }
  
  render() {
    const newArrivals = this.state.filtered;

    // Used when the opts, genre, format, etc, are being
    // computed
    let isLoading = true;
    if (newArrivals.length) {
      isLoading = false;
    }

    return (
      <div className='app-wrapper'>
        Test
      </div>
    );
  }
}

export default App;
