import React from 'react';

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
  imgClass: React.PropTypes.string,
  name: React.PropTypes.string,
  author: React.PropTypes.string,
  icon: React.PropTypes.object,
  format: React.PropTypes.string,
  formatId: React.PropTypes.string,
  genre: React.PropTypes.string,
  simple: React.PropTypes.bool,
  lang: React.PropTypes.string,
};

BookOverlay.defaultProps = {
  simple: true,
};

export default BookOverlay;
