/* global $, Isotope */

import React from 'react';
import ReactDOM from 'react-dom';

import CatalogItems from '../CatalogItems/CatalogItems.jsx';

/**
 * Isotopes grid container component
 * @extends {React}
 */
class Isotopes extends React.Component {
  constructor(props) {
    super(props);

    this.isoOptions = {
      itemSelector: '.catalogItem',
      masonry: {
        // columnWidth: 140,
        isResizable: true,
        // isFitWidth: true,
        gutter: 10,
      },
    };
  }

  /**
   * Once the component mounts, initialize the instance of Isotopes.
   */
  componentDidMount() {
    this.createIsotopeContainer();
  }

  /**
   * Arrange the grid once we get new props for the component.
   */
  componentDidUpdate() {
    setTimeout(() => {
      this.iso.reloadItems();
    }, 250);

    if (this.iso != null) {
      setTimeout(() => {
        this.iso.arrange();
      }, 250);
    }
  }

  /**
   * When the component unmounts, destroy the instance of Isotopes.
   */
  componentWillUnmount() {
    if (this.iso != null) {
      this.iso.destroy();
    }
  }

  /**
   * Create the Isotopes Instance if it doesn't already exist.
   */
  createIsotopeContainer() {
    if (this.iso == null) {
      $('.isotopeGrid').css('opacity', '1');
      this.iso = new Isotope(ReactDOM.findDOMNode(this.refs.isotopeContainer), this.isoOptions);

      setTimeout(() => {
        this.iso.arrange();
      }, 200);
    }
  }

  render() {
    const booksArr = this.props.booksArr;
    const displayType = this.props.displayType;

    return (
      <div
        ref="isotopeContainer"
        style={{ opacity: '0' }}
        className={`isotopeGrid ${this.props.format}`}
        role="region"
        id="isotopesContainer"
        aria-live="polite"
        aria-atomic="true"
        aria-relevant="additions"
      >
        <span className="visuallyHidden">
          List of new arrivals has been updated.
        </span>
        <CatalogItems
          items={booksArr}
          displayType={displayType}
          ref="catalogItems"
        />
      </div>
    );
  }
}

Isotopes.propTypes = {
  booksArr: React.PropTypes.array,
  displayType: React.PropTypes.string,
  format: React.PropTypes.string,
};

Isotopes.defaultProps = {
  booksArr: [],
};

export default Isotopes;
