import React from 'react';

class FilterIcon extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const icon = (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32">
        <title>circle.dash</title>
        <path d="M16,3A13,13,0,1,1,3,16,13.0147,13.0147,0,0,1,16,3m0-3A16,16,0,1,0,32,16,16,16,0,0,0,16,0h0Z"/>
        <path d="M24,14H8a2.0025,2.0025,0,0,0,0,4H24A2.0025,2.0025,0,0,0,24,14Z"/>
      </svg>
    );

    return (
      <span className={`selected-svgIcon`} {...this.props}>
        {icon}
      </span>
    );
  }
}

class FilterListItem extends React.Component {
  constructor(props) {
    super(props);

    this._onClick = this._onClick.bind(this);
  }

  _onClick(e) {
    e.preventDefault();
  }

  render() {
    const activeClass = this.props.active ? 'active' : '';

    return (
      <li onClick={this.props.onClick} className={activeClass}>
        <a href="#" onClick={this._onClick}>
          {this.props.item}
          { this.props.active ? <FilterIcon /> : null }
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
