import React from 'react';
import {
  RadioInactiveIcon,
  RadioActiveIcon,
} from 'dgx-svg-icons';

class FilterListItem extends React.Component {
  render() {
    const activeClass = this.props.active ? 'active' : '';
    const itemIdWithoutSpaces = (this.props.item.id).replace(/\s+/g, '');

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
          {this.props.active ? <RadioActiveIcon ariaHidden /> : <RadioInactiveIcon ariaHidden />}
          {this.props.item.label}
        </label>
      </div>
    );
  }
}

FilterListItem.propTypes = {
  onClick: React.PropTypes.func,
  item: React.PropTypes.object,
  active: React.PropTypes.bool,
  filter: React.PropTypes.string,
};

export default FilterListItem;
