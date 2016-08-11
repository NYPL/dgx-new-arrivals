import React from 'react';

import { CircleDashIcon } from 'dgx-svg-icons';

// const FilterListItem = (props) => {
class FilterListItem extends React.Component {

  render() {

    const activeClass = this.props.active ? 'active' : '';
    const formatId = (this.props.item.id).replace(/\s+/g, '');

    return (
      <div className={activeClass}>
        <input
          type="radio"
          className="switch-input"
          id={formatId}
          name={this.props.filter}
          onClick={this.props.onClick}
          value={this.props.item.label}
          aria-labelledby={`label-${formatId}`}
        />
        <label htmlFor={formatId} id={`label-${formatId}`} ref={`label-${formatId}`}>
          {this.props.active ? <CircleDashIcon ariaHidden /> : null}
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
