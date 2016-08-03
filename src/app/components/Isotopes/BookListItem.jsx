import React from 'react';

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

        <h2 lang={this.props.lang}>
          <a href={this.props.target} onClick={this.trackTitle}>
            {this.props.title}
          </a>
        </h2>
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
  date: React.PropTypes.string,
  callNumber: React.PropTypes.string,
  format: React.PropTypes.string,
  publishYear: React.PropTypes.string,
  bookCover: React.PropTypes.object,
  author: React.PropTypes.string,
  description: React.PropTypes.string,
  target: React.PropTypes.string,
  title: React.PropTypes.string,
  lang: React.PropTypes.string,
};

export default BookListItem;
