import React from 'react';

class BookCover extends React.Component {

  // Constructor used in ES6
  constructor(props) {
    super(props);

    this.state = {
      imageSrc: (this.props.imgSrc && this.props.imgSrc !== undefined) ?
        // Show the place holder if the book cover's ISBN is not available
        this.props.imgSrc : this.props.placeHolderEndpoint,
      // The original width of the source image
      naturalWidth: 150,
      errorStatus: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    this.checkImg();
  }

  checkImg() {
    this.setState({
      imageSrc: (this.props.imgSrc && this.props.imgSrc !== undefined) ?
        // Show the place holder if the book cover's ISBN is not available
        this.props.imgSrc : this.props.placeHolderEndpoint
    });
  }

  componentDidMount() {
    this.checkImg();

    // After the cover image is loaded
    this.refs.coverImage.addEventListener('load', () => {
      // Set the natural width to of source image to the component
      this.setState({ naturalWidth: this.refs.coverImage.naturalWidth}, () => {
        // Detect the natural width if it is smaller then 10px,
        // set the image source to the place holder
        if (this.state.imageSrc !== this.props.placeHolderEndpoint &&
          this.state.naturalWidth < 10 && this.state.naturalWidth > 0) {
          this.setState({
            imageSrc: this.props.placeHolderEndpoint,
            errorStatus: 'one-pixel',
          });
        }
      });
    }, true);
  }

  render() {
    return (
      <img
        id={`cover-${this.props.id}`}
        className={`${this.props.className} ${this.state.errorStatus}`}
        ref="coverImage"
        src={this.state.imageSrc}
        title={this.props.name}
        alt={this.props.name} />
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
