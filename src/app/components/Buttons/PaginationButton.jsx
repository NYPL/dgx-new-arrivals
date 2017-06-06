// Import React Libraries
import React from 'react';
import PropTypes from 'prop-types';

const PaginationButton = (props) => {
  const dotElements = [];
    // Add loading class and the loading animation if it is loading now
  const isLoading = props.isLoading ? 'loading' : '';

  // Generate the dots for the pagination button.
  // The number of the dots is determinated by the props.
  for (let i = 0; i < props.dots; i++) {
    dotElements.push(
      <span
        id={`${props.id}-list-dot-${i}`}
        className={`paginationButton-list-dot ${isLoading}`}
        key={i}
      >
      </span>
    );
  }

  return (
    <button
      id={props.id}
      className={`paginationButton ${props.className} ${props.hidden}`}
      onClick={props.onClick}
    >
      <span
        id={`${props.id}-list`}
        className="paginationButton-list"
      >
        {dotElements}
        <span
          id={`${props.id}-list-number`}
          className="paginationButton-list-number"
        >
          {props.label}
        </span>
      </span>
    </button>
  );
};

PaginationButton.propTypes = {
  id: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  name: PropTypes.string,
  label: PropTypes.string,
  lang: PropTypes.string,
  isLoading: PropTypes.bool.isRequired,
  dots: PropTypes.number,
  hidden: PropTypes.string,
  onClick: PropTypes.func,
};

PaginationButton.defaultProps = {
  id: 'paginationButton',
  className: '',
  name: 'pagination button',
  label: 'Pagination Button',
  lang: 'en',
  dots: 3,
};

// Export the component
export default PaginationButton;
