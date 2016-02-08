import React from 'react';
import Slick from 'react-slick';

import HomepageStore from '../../stores/Store.js';
import BookCover from '../BookCover/BookCover.jsx';

let styles = {
  bookItemsWidth: {
    width: '4500px',
  },
};

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = HomepageStore.getState();
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
    const newArrivals = this.state.recommendedRecentReleasesData;
    const books = newArrivals.slots;
    const settings = {
        dots: true,
        mobileFirst: true,
        infinite: false,
        speed: 300,
        slidesToShow: 4,
        slidesToScroll: 4,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              infinite: true,
              dots: true
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
          // You can unslick at a given breakpoint now by adding:
          // settings: "unslick"
          // instead of a settings object
        ]
      };
    const items = this._generateItemsToDisplay(books);

    return (
      <div className='app-wrapper'>
        <Slick {...settings} >
          {items}
        </Slick>
      </div>
    );
  }
}

export default App;
