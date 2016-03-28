import React from 'react';
import ReactDOM from 'react-dom';

import _ from 'underscore';

import BookCover from '../BookCover/BookCover.jsx';

const styles = {
  listWidth: {
    width: '100%',
  },
  gridWidth: {
    width: '140px'
  },
};


/**
 * Isotopes grid container component
 * @extends {React}
 */
class Isotopes extends React.Component {
  constructor(props) {
    super(props);

    this.isoOptions = {
      itemSelector: '.book-item',
      masonry: {
        columnWidth: 140,
        isResizable: true,
        // isFitWidth: true,
        gutter: 10
      },
    };
  }

  /**
   * Arrange the grid once we get new props for the component.
   */
  componentDidUpdate(prevProps) {
    // this.iso.arrange();
  }

  /**
   * Once the component mounts, initialize the instance of Isotopes.
   */
  componentDidMount() {
    this._createIsotopeContainer();
  }

  /**
   * When the component unmounts, destroy the instance of Isotopes.
   */
  componentWillUnmount() {
    if (this.iso != null) {
      this.iso.destroy();
    }
  }

  /**
   * Generate a list item that is either a book cover or the title and author.
   * The BookCover component is being used but should be updated.
   * @param {array} booksArr - Array of book item objects.
   * @param {string} displayType - Either 'grid' or 'list'.
   */
  _generateItemsToDisplay(booksArr, displayType) {
    const bookCoverItems = booksArr; //_.chain(booksArr).flatten().value();

    const books = bookCoverItems.map((element, i) => {
      const target = `http://browse.nypl.org/iii/encore/record/C__Rb${element.bibNumber}`;
      const bookCover = (
        <a href={target} className="bookItem">
          <BookCover imgSrc={element.imageUrl[0] ? element.imageUrl[0] : null } testkey={i}/>
        </a>
      );
      const bookListItem = (
        <div>
          <a href={target}>
            <h2>{element.title}</h2>
          </a>
          <p>{element.author ? element.author : null}</p>
        </div>
      );
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
      }, 300);
    }

    return books;
  }

  /**
   * Create the Isotopes Instance if it doesn't already exist.
   */
  _createIsotopeContainer() {
    if (this.iso == null) {
      $('.isotopeGrid').css('opacity', '1');
      this.iso = new Isotope(ReactDOM.findDOMNode(this.refs.isotopeContainer), this.isoOptions);

      setTimeout(() => {
        this.iso.arrange();
      }, 250);
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
