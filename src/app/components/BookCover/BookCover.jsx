import React from 'react';

import {
  AudioHeadphoneIcon,
  MediaBluRayIcon,
  AudioDiscIcon,
  DvdDiscIcon,
  BookIcon,
  LargePrintIcon,
  EReaderIcon,
} from 'dgx-svg-icons';

import BookOverlay from './BookOverlay.jsx';

import { trackNewArrivals } from '../../utils/utils.js';

class BookCover extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      imageSrc: this.props.imgSrc,
      // The original width of the source image
      naturalWidth: 150,
      errorStatus: '',
    };

    this.checkImageWidth = this.checkImageWidth.bind(this);
    this.handleLoadedImage = this.handleLoadedImage.bind(this);
    this.handleLoadedImageError = this.handleLoadedImageError.bind(this);
  }

  componentDidMount() {
    // After the cover image is loaded
    const coverImage = this.refs.coverImage;
    if (coverImage && coverImage.naturalWidth) {
      this.checkImageWidth(coverImage.naturalWidth);
    }
  }

  shouldComponentUpdate(nextProps) {
    if (this.state.name !== nextProps.name &&
      this.state.imageSrc !== nextProps.imgSrc) {
      this.setState({
        imageSrc: nextProps.imgSrc,
        errorStatus: '',
      });
      return true;
    }

    if (!nextProps.imgSrc || this.state.name !== nextProps.name) {
      return true;
    }

    return false;
  }

  checkImageWidth(width) {
    if (width < 10 && width >= 0) {
      this.setState({
        errorStatus: 'one-pixel',
      });
    } else {
      this.setState({
        errorStatus: '',
      });
    }
  }

  handleLoadedImage() {
    this.checkImageWidth(this.refs.coverImage.naturalWidth);
    this.forceUpdate();
  }

  handleLoadedImageError() {
    this.setState({
      errorStatus: 'one-pixel',
      imageSrc: '',
    });
    this.forceUpdate();
  }

  render() {
    const imgClass = this.state.errorStatus === 'one-pixel' || (!this.state.imageSrc) ?
      'noImage' : '';
    let icon;
    let format;
    let item;

    switch (this.props.format) {
      case 'BOOK/TEXT':
        icon = <BookIcon width="32" height="32" ariaHidden />;
        format = 'Book';
        break;
      case 'AUDIOBOOK':
        icon = <AudioHeadphoneIcon ariaHidden />;
        format = 'Audiobook';
        break;
      case 'BLU-RAY':
        icon = <MediaBluRayIcon ariaHidden />;
        format = 'Blu-ray';
        break;
      case 'DVD':
        icon = <DvdDiscIcon ariaHidden />;
        format = 'DVD';
        break;
      case 'E-AUDIOBOOK':
        icon = <AudioHeadphoneIcon ariaHidden />;
        format = 'E-Audiobook';
        break;
      case 'E-BOOK':
        icon = <EReaderIcon ariaHidden />;
        format = 'E-Book';
        break;
      case 'LARGE PRINT':
        icon = <LargePrintIcon ariaHidden />;
        format = 'Large Print';
        break;
      case 'MUSIC CD':
        icon = <AudioDiscIcon ariaHidden />;
        format = 'Music CD';
        break;
      default:
        icon = <BookIcon width="32" height="32" ariaHidden />;
        format = this.props.format;
        break;
    }

    if (imgClass !== 'noImage') {
      item = (<img
        onLoad={this.handleLoadedImage}
        onError={this.handleLoadedImageError}
        id={`cover-${this.props.id}`}
        className={this.state.errorStatus}
        ref="coverImage"
        src={this.state.imageSrc}
        title={this.props.name}
        alt={this.props.name}
      />);
    } else {
      item = (<BookOverlay
        imgClass={imgClass}
        name={this.props.name}
        author={this.props.author}
        icon={icon}
        formatId={this.props.format}
        format={format}
        genre={this.props.genre}
        simple={this.props.simple}
        lang={this.props.lang}
      />);
    }

    return (
      <a
        tabIndex={this.props.tab ? '0' : '-1'}
        href={this.props.target}
        className={`${this.props.linkClass} ${imgClass}`}
        onClick={() =>
          trackNewArrivals('Click Encore Item', `${this.props.displayType} Item Image`)
        }
      >
        {item}
      </a>
    );
  }
}

BookCover.propTypes = {
  id: React.PropTypes.number,
  name: React.PropTypes.string,
  format: React.PropTypes.string,
  imageArgument: React.PropTypes.string,
  target: React.PropTypes.string,
  linkClass: React.PropTypes.string,
  imgSrc: React.PropTypes.string,
  author: React.PropTypes.string,
  genre: React.PropTypes.string,
  displayType: React.PropTypes.string,
  simple: React.PropTypes.bool,
  lang: React.PropTypes.string,
  tab: React.PropTypes.bool,
};

BookCover.defaultProps = {
  format: 'BOOK/TEXT',
  genre: '',
  tab: true,
};

export default BookCover;
