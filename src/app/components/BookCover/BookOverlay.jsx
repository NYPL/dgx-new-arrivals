import React from 'react';

class BookOverlay extends React.Component {
  render () {
    const formatId = (this.props.formatId).replace(/\s+/g, '');
    let details = (
      <div className="default">
        {this.props.icon}
        <p>NO IMAGE AVAILABLE</p>
      </div>
    );
    
    if (!this.props.simple) {
      details = (
        <div>
          <h3>{this.props.name}</h3>
          <div className="details">
            <p className="author">{this.props.author}</p>
            <p className="format">{this.props.icon}{this.props.format}</p>
            <p className="genre">{this.props.genre}</p>
          </div>
        </div>
      );
    }

    return (
      <div className={`itemOverlay ${this.props.imgClass} ${formatId}`}>
        {details}
      </div>
    );
  };
}

BookOverlay.propTypes = {
  imgClass: React.PropTypes.string,
  name: React.PropTypes.string,
  author: React.PropTypes.string,
  icon: React.PropTypes.object,
  format: React.PropTypes.string,
  formatId: React.PropTypes.string,
  genre: React.PropTypes.string,
  simple: React.PropTypes.bool,
};

BookOverlay.defaultProps = {
  simple: true,
};

export default BookOverlay;
