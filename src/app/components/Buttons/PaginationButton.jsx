// Import React Libraries
import React from 'react';

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
      <div
        id={`${props.id}-list`}
        className={`paginationButton-list`}
      >
        {dotElements}
        <span
          id={`${props.id}-list-number`}
          className={`paginationButton-list-number`}
        >
          {props.label}
        </span>
      </div>
    </button>
  );
};

PaginationButton.propTypes = {
  id: React.PropTypes.string.isRequired,
  className: React.PropTypes.string.isRequired,
  name: React.PropTypes.string,
  label: React.PropTypes.string,
  lang: React.PropTypes.string,
  isLoading: React.PropTypes.bool.isRequired,
  dots: React.PropTypes.number,
  hidden: React.PropTypes.string,
  onClick: React.PropTypes.func,
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
