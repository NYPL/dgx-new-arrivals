import React from 'react';

class BookCover extends React.Component {

  // Constructor used in ES6
  constructor(props) {
    super(props);

    this.state = {
      imageSrc: (!this.props.imgSrc && this.props.imgSrc && this.props.imgSrc !== '') ?
        // Show the place holder if the book cover's ISBN is not available
        this.props.imgSrc : this.props.placeHolderEndpoint,
      // The original width of the source image
      naturalWidth: 150,
      errorStatus: 'one-pixel',
    };

    this.handleLoadedImage = this.handleLoadedImage.bind(this);
    this.handleLoadedImageError = this.handleLoadedImageError.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    if (this.state.imageSrc !== nextProps.imgSrc) {
      this.setState({
        imageSrc: nextProps.imgSrc,
        errorStatus: '',
      });
      return true;
    }

    return false;
  }

  componentDidMount() {}

  handleLoadedImage() {
    const width = this.refs.coverImage.naturalWidth;
    if (width < 10 && width >= 0) {
      this.setState({
        errorStatus: 'one-pixel',
      });
    } else {
      this.setState({
        errorStatus: '',
      });
    }

    this.forceUpdate();
  }

  handleLoadedImageError() {
    this.setState({
      errorStatus: 'one-pixel',
    });
    this.forceUpdate();
  }

  render() {
    let imgClass = this.state.errorStatus === 'one-pixel' ? 'noImage' : '';

    return (
      <a href={this.props.target} className={`${this.props.linkClass} ${imgClass}`}>
        <img
            onLoad={this.handleLoadedImage}
            onError={this.handleLoadedImageError}
            id={`cover-${this.props.id}`}
            className={this.state.errorStatus}
            ref="coverImage"
            src={this.state.imageSrc}
            title={this.props.name}
            alt={this.props.name}
          />
        <div className={`itemOverlay ${imgClass}`}>
          <h3>{this.props.name}</h3>
          <div className="details">
            <p className="author">{this.props.author}</p>
            <p className="format">{this.props.format}</p>
            <p className="genre">Nonfiction</p>
          </div>
        </div>
      </a>
    );
  }
}

BookCover.propTypes = {
  id: React.PropTypes.string,
  className: React.PropTypes.string,
  name: React.PropTypes.string,
  imageEndpoint: React.PropTypes.string,
  imageArgument: React.PropTypes.string,
  placeHolderEndpoint: React.PropTypes.string,
  isbn: React.PropTypes.string,
  imgSrc: React.PropTypes.string,
};

BookCover.defaultProps = {
  id: 'BookCover',
  imageEndpoint: 'https://contentcafe2.btol.com/ContentCafe/Jacket.aspx?' +
    '&userID=NYPL49807&password=CC68707&Value=',
  imageArgument: '&content=M&Return=1&Type=M',
  placeHolderEndpoint: 'http://nypl.org/browse/recommendations/lists/src/client/images/' +
    'book-place-holder.png',
  isbn: '',
};

// Export components
export default BookCover;
