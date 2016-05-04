import React from 'react';
import ReactDOM from 'react-dom';

import { findWhere as _findWhere } from 'underscore';

import BookCover from '../BookCover/BookCover.jsx';
import appConfig from '../../../../appConfig.js';

const { appFilters } = appConfig;
const formatData = appFilters.formatData.data;

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
        gutter: 10,
      },
    };

    this.createDate = this.createDate.bind(this);
  }

  /**
   * Once the component mounts, initialize the instance of Isotopes.
   */
  componentDidMount() {
    this.createIsotopeContainer();
  }

  /**
   * Arrange the grid once we get new props for the component.
   */
  componentDidUpdate() {
    setTimeout(() => {
      this.iso.reloadItems();
    }, 150);
  }

  /**
   * When the component unmounts, destroy the instance of Isotopes.
   */
  componentWillUnmount() {
    if (this.iso != null) {
      this.iso.destroy();
    }
  }

  createDate(date) {
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
  generateItemsToDisplay(booksArr, displayType) {
    const bookCoverItems = booksArr;

    if (bookCoverItems.length === 0) {
      return null;
    }

    const books = bookCoverItems.map((element, i) => {
      const shortTitle = element.title ? element.title.split(':')[0] : '';
      const target = `http://browse.nypl.org/iii/encore/record/C__Rb${element.bibNumber}`;
      const bookCover = (
        <BookCover
          imgSrc={element.imageUrl[0] ? element.imageUrl[0] : undefined}
          testkey={i}
          name={shortTitle}
          author={element.author}
          format={element.format}
          target={target}
          linkClass="bookItem"
        />
      );
      const formatLabel = _findWhere(formatData, { id: element.format });

      const createdDate = this.createDate(element.createdDate);
      const bookListItem = (
        <div>
          <a href={target}>
            <h2>{element.title}</h2>
          </a>
          <p>{element.author ? element.author : null}</p>
          <p>
            {formatLabel ? `${formatLabel.label}, ` : null}
            {element.publishYear ? element.publishYear : null}
          </p>
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
  createIsotopeContainer() {
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
    let books = this.generateItemsToDisplay(booksArr, displayType);

    if (!booksArr.length) {
      books = (
        <li className="book-item noResults">
          <span>No items found with the selected filters.</span>
        </li>
      );
    }

    return (
      <ul className="isotopeGrid" ref="isotopeContainer" style={{ opacity: '0' }}>
        {books}
      </ul>
    );
  }
}

Isotopes.propTypes = {
  booksArr: React.PropTypes.array,
  displayType: React.PropTypes.string,
};

export default Isotopes;
