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

    return (
      <li onClick={this.props.onClick} className={activeClass}>
        <a href="#" onClick={this.onClick}>
          {this.props.item}
          {this.props.active ? <CircleDashIcon className="selected-svgIcon" /> : null}
        </a>
      </li>
    );
  }
}

FilterListItem.propTypes = {
  onClick: React.PropTypes.func,
  item: React.PropTypes.string,
  active: React.PropTypes.bool,
};

export default FilterListItem;
