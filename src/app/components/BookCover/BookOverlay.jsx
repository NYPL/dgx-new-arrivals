import React from 'react';
import PropTypes from 'prop-types';

const BookOverlay = (props) => {
  // Remove spaces for the format ID for the class name.
  const formatId = (props.formatId).replace(/\s+/g, '');
  const genre = (formatId !== 'MUSICCD' && props.genre !== '') ?
    <p className="genre">{props.genre}</p> : null;
  let details = (
    <div className="default">
      {props.icon}
      <p>NO IMAGE AVAILABLE</p>
    </div>
  );

  if (!props.simple) {
    details = (
      <div>
        <div className="title" lang={props.lang}>
          {props.name}
        </div>
        <div className="details" aria-hidden="true">
          <p className="author">{props.author}</p>
          <p className="format">{props.icon}{props.format}</p>
          {genre}
        </div>
      </div>
    );
  }

  return (
    <div className={`itemOverlay ${props.imgClass} ${formatId}`}>
      {details}
    </div>
  );
};

BookOverlay.propTypes = {
  imgClass: PropTypes.string,
  name: PropTypes.string,
  author: PropTypes.string,
  icon: PropTypes.object,
  format: PropTypes.string,
  formatId: PropTypes.string,
  genre: PropTypes.string,
  simple: PropTypes.bool,
  lang: PropTypes.string,
};

BookOverlay.defaultProps = {
  simple: true,
};

export default BookOverlay;
