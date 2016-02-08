import React from 'react';
import Slick from 'react-slick';

import _ from 'underscore';

import NewArrivalsStore from '../../stores/Store.js';
import BookCover from '../BookCover/BookCover.jsx';

import Select from 'react-select';

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

    this._selectChange = this._selectChange.bind(this);
    this._selectGenreChange = this._selectGenreChange.bind(this);
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
      data = _.where(this.state.all, {contentType: value})
    } 

    this.setState({
      filtered: data,
      value
    });
  }

  _selectGenreChange(genres) {
    console.log(`Selected: ${genres}`);

    this.setState({
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
  
  render() {
    const newArrivals = this.state.filtered;
    const settings = {
        dots: true,
        mobileFirst: true,
        infinite: false,
        speed: 300,
        slidesToShow: 6,
        slidesToScroll: 6,
        slickGoTo: 1,
        // responsive: [
        //   {
        //     breakpoint: 320,
        //     settings: {
        //       slidesToShow: 2,
        //       slidesToScroll: 2
        //     }
        //   },
        //   {
        //     breakpoint: 600,
        //     settings: {
        //       slidesToShow: 3,
        //       slidesToScroll: 3
        //     }
        //   },
        //   {
        //     breakpoint: 768,
        //     settings: {
        //       slidesToShow: 4,
        //       slidesToScroll: 4
        //     }
        //   },
        //   {
        //     breakpoint: 1024,
        //     settings: {
        //       slidesToShow: 5,
        //       slidesToScroll: 5,
        //       infinite: true,
        //       dots: true
        //     }
        //   },
        //   {
        //     breakpoint: 1500,
        //     settings: {
        //       slidesToShow: 6,
        //       slidesToScroll: 6
        //     }
        //   },
        //   // You can unslick at a given breakpoint now by adding:
        //   // settings: "unslick"
        //   // instead of a settings object
        // ]
      };
    const items = this._generateItemsToDisplay(newArrivals);
    let opts = [
        {value: 'BOOK_TEXT', label: 'Books'},
        {value: 'DVD', label: 'DVDs'},
        {value: 'MUSIC_NON_CD', label: 'Music'},
      ];
    const genres = [
        {value: 'fiction', label: 'Fiction'},
        {value: 'non_fiction', label: 'Non-Fiction'},
        {value: 'science_fiction', label: 'Science Fiction'},
        {value: 'horror', label: 'Horror'},
        {value: 'mystery', label: 'Mystery'},
      ];

    return (
      <div className='app-wrapper'>
        <div className='select-wrapper'>
          <Select name='form-field'
            options={opts}
            onChange={this._selectChange}
            searchable={false}
            value={this.state.value}
            simpleValue
            placeholder='Format'
            multi={true} />
        </div>
        <div className='select-wrapper'>
          <Select name='form-field'
            options={genres}
            onChange={this._selectGenreChange}
            searchable={false}
            value={this.state.genres}
            simpleValue
            placeholder='Genre'
            multi={true} />
        </div>
        <Slick {...settings}>
          {items}
        </Slick>
      </div>
    );
  }
}

export default App;
