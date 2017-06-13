import React from 'react';
import PropTypes from 'prop-types';
import {
  RadioInactiveIcon,
  RadioActiveIcon,
} from 'dgx-svg-icons';

class FilterListItem extends React.Component {
  render() {
    const activeClass = this.props.active ? 'active' : '';
    const itemIdWithoutSpaces = (this.props.item.id).replace(/\s+/g, '');
    const radioButton = this.props.active ?
      <RadioActiveIcon
        width="16px"
        height="16px"
        ariaHidden
      /> :
      <RadioInactiveIcon
        width="16px"
        height="16px"
        ariaHidden
      />;

    return (
      <div className={activeClass}>
        <input
          type="radio"
          className="switch-input"
          id={itemIdWithoutSpaces}
          ref={itemIdWithoutSpaces}
          name={this.props.filter}
          onClick={this.props.onClick}
          value={this.props.item.label}
          aria-labelledby={`label-${itemIdWithoutSpaces}`}
        />
        <label htmlFor={itemIdWithoutSpaces} id={`label-${itemIdWithoutSpaces}`}>
          {radioButton}
          {this.props.item.label}
        </label>
      </div>
    );
  }
}

FilterListItem.propTypes = {
  onClick: PropTypes.func,
  item: PropTypes.object,
  active: PropTypes.bool,
  filter: PropTypes.string,
};

export default FilterListItem;
