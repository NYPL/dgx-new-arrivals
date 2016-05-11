import React from 'react';

/**
 * BookListItem
 * @extends {React}
 */
class BookListItem extends React.Component {
  constructor(props) {
    super(props);

    this.createDate = this.createDate.bind(this);
  }

  createDate(date) {
    if (!date) {
      return null;
    }

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
      'August', 'September', 'October', 'November', 'December'];
    const d = new Date(date);

    return `Added on ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  }

  createInfo(info, infoClass) {
    if (!info) {
      return null;
    }

    return (
      <p className={infoClass}>{info}</p>
    );
  }

  render() {
    const date = this.createDate(this.props.date);
    const callNumber = this.props.callNumber ? `Call Number: ${this.props.callNumber}` : '';
    const publishInfo = `${this.props.format} ${this.props.publishYear}`;

    return (
      <div className="list-item">
        {this.props.bookCover}
        
        <h2><a href={this.props.target}>{this.props.title}</a></h2>

        {this.createInfo(this.props.author, 'author')}
        {this.createInfo(publishInfo, 'publishInfo')}
        {this.createInfo(callNumber, 'callNumber')}
        {this.createInfo(this.props.description, 'description')}
        {this.createInfo(date, 'date')}
      </div>
    );
  }
}

BookListItem.propTypes = {
  booksArr: React.PropTypes.array,
  displayType: React.PropTypes.string,
};

export default BookListItem;
