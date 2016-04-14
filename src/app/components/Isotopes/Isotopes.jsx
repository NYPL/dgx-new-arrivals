import React from 'react';
import ReactDOM from 'react-dom';

import _ from 'underscore';

import BookCover from '../BookCover/BookCover.jsx';

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
        // columnWidth: 140,
        isResizable: true,
        // isFitWidth: true,
        gutter: 10
      },
    };

    this._createDate = this._createDate.bind(this);
  }

  /**
   * Arrange the grid once we get new props for the component.
   */
  componentDidUpdate(prevProps) {
    setTimeout(() => {
      this.iso.reloadItems();
    }, 150);
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

  _createDate(date) {
    if (!date) {
      return null;
    }

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
      'August', 'September', 'October', 'November', 'December'];
    const d = new Date(date);

    return (<p>Added on {months[d.getMonth()]} {d.getDate()}, {d.getFullYear()}</p>);
  }

  /**
   * Generate a list item that is either a book cover or the title and author.
   * The BookCover component is being used but should be updated.
   * @param {array} booksArr - Array of book item objects.
   * @param {string} displayType - Either 'grid' or 'list'.
   */
  _generateItemsToDisplay(booksArr, displayType) {
    const bookCoverItems = booksArr; //_.chain(booksArr).flatten().value();

    if (bookCoverItems.length === 0) {
      return null;
    }

    const books = bookCoverItems.map((element, i) => {
      const target = `http://browse.nypl.org/iii/encore/record/C__Rb${element.bibNumber}`;
      const bookCover = (
        <BookCover
          imgSrc={element.imageUrl[0] ? element.imageUrl[0] : undefined } testkey={i}
          name={element.title}
          author={element.author}
          format={element.format}
          target={target}
          linkClass="bookItem"
        />
      );
      const createdDate = this._createDate(element.createdDate);
      const bookListItem = (
        <div>
          <a href={target}>
            <h2>{element.title}</h2>
          </a>
          <p>{element.author ? element.author : null}</p>
          <p>{element.format ? element.format : null}</p>
          <p>{element.description ? element.description : null}</p>
          {createdDate}
        </div>
      );

      return (
        <li className={`book-item ${displayType}`} key={i}>
          {displayType === 'grid' ? bookCover : bookListItem}
        </li>
      );
    });

    if (this.iso != null) {
      setTimeout(() => {
        this.iso.arrange();
      }, 200);
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
      }, 200);
    }
  }
  
  render() {
    const booksArr = this.props.booksArr && this.props.booksArr.length ? this.props.booksArr : [];
    const displayType = this.props.displayType;
    let books = this._generateItemsToDisplay(booksArr, displayType);

    if (!booksArr.length) {
      books = <li className="book-item noResults">
          <span>No items found with the selected filters.</span>
        </li>;
    }

    return (
      <ul className="isotopeGrid" ref="isotopeContainer" style={{opacity: '0'}}>
        {books}
      </ul>
    );
  }
}

export default Isotopes;
