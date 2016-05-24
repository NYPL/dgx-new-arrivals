import React from 'react';
import ReactDOM from 'react-dom';

import { findWhere as _findWhere } from 'underscore';

import BookCover from '../BookCover/BookCover.jsx';
import BookListItem from './BookListItem.jsx';
import appConfig from '../../../../appConfig.js';

import {
  titleShortener,
  createDate,
} from '../../utils/utils.js';

const { appFilters, itemTitleLength } = appConfig;
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
      const shortTitle = titleShortener(element.title, itemTitleLength);
      const target = `http://browse.nypl.org/iii/encore/record/C__Rb${element.bibNumber}`;
      const bookCover = (
        <BookCover
          imgSrc={element.imageUrl[0] ? element.imageUrl[0] : undefined}
          id={element.bibNumber}
          name={shortTitle}
          author={element.author}
          format={element.format}
          target={target}
          genre={element.genres[0]}
          linkClass="bookItem"
        />
      );
      const format = _findWhere(formatData, { id: element.format });
      const formatLabel = format ? `${format.label}` : '';
      const publishYear = element.publishYear ? `, ${element.publishYear}` : '';
      const date = createDate(element.createdDate);
      const bookListItem = (
        <BookListItem
          bookCover={bookCover}
          title={element.title}
          target={target}
          author={element.author}
          format={formatLabel}
          publishYear={publishYear}
          callNumber={element.callNumber}
          description={element.description}
          date={date}
        />
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
