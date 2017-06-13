import React from 'react';
import PropTypes from 'prop-types';
import { trackNewArrivals } from '../../utils/utils.js';

/**
 * BookListItem
 * @extends {React}
 */
class BookListItem extends React.Component {
  constructor(props) {
    super(props);

    this.createDate = this.createDate.bind(this);
    this.createInfo = this.createInfo.bind(this);
    this.trackTitle = this.trackTitle.bind(this);
  }

  createDate(date) {
    return date ? `Added on ${date}` : null;
  }

  createInfo(info, infoClass) {
    return info ? (<p className={infoClass}>{info}</p>) : null;
  }

  trackTitle() {
    trackNewArrivals('Click Encore Item', 'List Item Title');
  }


  render() {
    const dateAdded = this.createDate(this.props.date);
    const callNumber = this.props.callNumber ? `Call Number: ${this.props.callNumber}` : '';
    const publishInfo = `${this.props.format} ${this.props.publishYear}`;

    return (
      <div className="list-item">
        {this.props.bookCover}
        <a
          ref="list-title"
          href={this.props.target}
          onClick={this.trackTitle}
          lang={this.props.lang}
          className="list-title"
        >
          {this.props.title}
        </a>
        {this.createInfo(this.props.author, 'author')}
        {this.createInfo(publishInfo, 'publishInfo')}
        {this.createInfo(callNumber, 'callNumber')}
        {this.createInfo(this.props.description, 'description')}
        {this.createInfo(dateAdded, 'date')}
      </div>
    );
  }
}

BookListItem.propTypes = {
  date: PropTypes.string,
  callNumber: PropTypes.string,
  format: PropTypes.string,
  publishYear: PropTypes.string,
  bookCover: PropTypes.object,
  author: PropTypes.string,
  description: PropTypes.string,
  target: PropTypes.string,
  title: PropTypes.string,
  lang: PropTypes.string,
};

export default BookListItem;
