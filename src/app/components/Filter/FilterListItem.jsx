import React from 'react';

import { CircleDashIcon } from 'dgx-svg-icons';

class FilterListItem extends React.Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    e.preventDefault();

  }

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
        />
        <label htmlFor={formatId}>
          {this.props.active ? <CircleDashIcon /> : null}
          {this.props.item.label}
        </label>
      </div>
    );
  }
}

FilterListItem.propTypes = {
  onClick: React.PropTypes.func,
  item: React.PropTypes.string,
  active: React.PropTypes.bool,
};

export default FilterListItem;
