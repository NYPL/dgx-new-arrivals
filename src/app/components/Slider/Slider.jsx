import React from 'react';

import Slider from 'react-slick';
import _ from 'underscore';

import BookCover from './components/BookCover.js';

let styles = {
  bookItemsWidth: {
    width: '4500px',
  },
};

class BooklistWidget extends React.Component {
  constructor(props) {
    super(props);
  }

  _generateItemsToDisplay(bookLists) {
    const bookCoverItems = (bookLists && bookLists.length) ?
        bookLists.map((element, i) => {
          const target = element.link,
            img = element.image.bookCoverImage;

          return (
            <div key={i} className="slick-book-item">
              <a href={target} className="bookItem" target="_parent">
                <BookCover
                  id={`item-${i}`}
                  imgSrc={img}
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

  render() {
    // Pass in model builder method here
    const bookLists = this.props.bookLists,
      items = this._generateItemsToDisplay(bookLists),
      componentBemName = this.props.name,
      settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        arrows: true,
        variableWidth: true,
      };

    // If the items were fetched and parsed but are empty
    // then, display appropriate error.
    if (!items || _.isEmpty(items)) {
      return (
        <div>No data available...</div>
      );
    }

    // Items have been built, simply render.
    return (
      <Slider
        {...settings}
        className={`${componentBemName} ${this.props.className}`}
        id={this.props.id}>
        {items}
      </Slider>
    );
  }
}

BooklistWidget.propTypes = {
  className: React.PropTypes.string,
  id: React.PropTypes.string,
  bookLists: React.PropTypes.array,
  name: React.PropTypes.string,
};

BooklistWidget.defaultProps = {
  id: 'BooklistWidget',
  name: 'BooklistWidget',
  className: 'BooklistWidget',
  lang: 'en',
  bookLists: [],
};

export default BooklistWidget;
