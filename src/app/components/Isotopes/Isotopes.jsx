import React from 'react';
import ReactDOM from 'react-dom';

import _ from 'underscore';
import BookCover from '../BookCover/BookCover.jsx';

let styles = {
  bookItemsWidth: {
    width: '4500px',
  },
  listWidth: {
    width: '100%',
  },
  gridWidth: {
    width: '150px'
  },
};

class Isotopes extends React.Component {
  constructor(props) {
    super(props);

    this.isoOptions = {
      itemSelector: '.book-item',
      masonry: {
        columnWidth: 150,
        isResizable: true,
        isFitWidth: true,
        gutter: 10
      },
    };
  }

  componentDidUpdate(prevProps) {
    this.iso.arrange();
  }

  // Event listeners
  componentDidMount() {
    this._createIsotopeContainer();
  }

  componentWillUnmount() {
    if (this.iso != null) {
      this.iso.destroy();
    }
  }

  _generateItemsToDisplay(booksArr, displayType) {
    const bookCoverItems = _.chain(booksArr)
      .flatten()
      .value();

    const books = bookCoverItems.map((element, i) => {
        const target = '#';
        // <img
        //   width="150"
        //   src={element.imageUrls[0]}/>
        // <BookCover imgSrc={element.imageUrls[0]} />
        const bookCover = (<a href={target} className="bookItem">
                    <img
                      width="150"
                      src={element.imageUrls[0]}/>
                </a>);
        const bookListItem = (<div>
            <h2>{element.title}</h2>
            <p>By: {element.genre}</p>
          </div>);
        const listDisplay = displayType === 'grid' ? styles.gridWidth : styles.listWidth;

        return (
          <li className='book-item' key={i} style={listDisplay}>
            {displayType === 'grid' ? bookCover : bookListItem}
          </li>
        );
      });

    if (this.iso != null) {
      setTimeout(() => {
        this.iso.arrange();
      }, 800);
    }

// console.log(books);
    return books;
  }

  _createIsotopeContainer() {
    if (this.iso == null) {
      $('.isotopeGrid').css('opacity', '1');
      this.iso = new Isotope(ReactDOM.findDOMNode(this.refs.isotopeContainer), this.isoOptions);
    }
  }
  
  render() {
    const booksArr = this.props.booksArr;
    const displayType = this.props.displayType;
    const books = this._generateItemsToDisplay(booksArr, displayType);

    return (
      <ul className="isotopeGrid" ref="isotopeContainer" style={{opacity: '0'}}>
        {books}
      </ul>
    );
  }
}

export default Isotopes;
