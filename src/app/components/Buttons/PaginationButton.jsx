// Import React Libraries
import React from 'react';

const styles = {
  base: {
    color: '#A3A19E',
    border: '2px solid #A3A19E',
  },
  dots: {
    border: '3px solid #A3A19E',
  },
};

const PaginationButton = (props) => {
  const dotElements = [];
    // Add loading class and the loading animation if it is loading now
  const isLoading = props.isLoading ? 'loading' : '';
  let i;

  // Generate the dots for the pagination button.
  // The number of the dots is determinated by the props.
  for (i = 0; i < props.dots; i++) {
    dotElements.push(
      <li
        id={`${props.id}__dot-row__element_${i}`}
        className={`${props.className}__dot-row__element ${isLoading}`}
        key={i}
        style={[
          styles.dots,
          props.dotStyle,
        ]}
      >
      </li>
    );
  }

  return (
    <div
      id={props.id}
      className={`${props.className} ${props.hidden}`}
      onClick={props.onClick}
      style={[
        styles.base,
        props.style,
      ]}
    >
      <ul
        id={`${props.id}__dot-row`}
        className={`${props.className}__dot-row`}
      >
        {dotElements}
        <li
          id={`${props.id}__dot-row__number`}
          className={`${props.className}__dot-row__number`}
        >
          {props.label}
        </li>
      </ul>
    </div>
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
  style: React.PropTypes.object,
  dotStyle: React.PropTypes.object,
};

PaginationButton.defaultProps = {
  id: 'PaginationButton',
  className: 'pagination-button',
  name: 'pagination button',
  label: 'Pagination Button',
  lang: 'en',
  dots: 3,
};

// Export the component
export default PaginationButton;
