import React from 'react';

const BookOverlay = ({ imgClass, name, author, icon, format, genre }) => (
  <div className={`itemOverlay ${imgClass}`}>
    <h3>{name}</h3>
    <div className="details">
      <p className="author">{author}</p>
      <p className="format">{icon}{format}</p>
      <p className="genre">{genre}</p>
    </div>
  </div>
);

BookOverlay.propTypes = {
  imgClass: React.PropTypes.string,
  name: React.PropTypes.string,
  author: React.PropTypes.string,
  icon: React.PropTypes.object,
  format: React.PropTypes.string,
  genre: React.PropTypes.string,
};

export default BookOverlay;
