import React from 'react';

import Actions from '../../actions/Actions.js';

const ListSvgIcon = (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
  <path d="M23.4829,9.5H7.83a1.0143,1.0143,0,1,1,0-2.0285H23.4829A1.0143,1.0143,0,1,1,23.4829,9.5Z"/>
  <path d="M23.4829,19.5285H7.83a1.0143,1.0143,0,1,1,0-2.0285H23.4829A1.0143,1.0143,0,1,1,23.4829,19.5285Z"/>
  <path d="M16.8125,14.5h-9a0.977,0.977,0,0,1-1-.9857A1.0155,1.0155,0,0,1,7.83,12.5h8.7651a1.1951,1.1951,0,0,1,1.2178,1A0.9889,0.9889,0,0,1,16.8125,14.5Z"/>
  <path d="M16.5947,25.4H7.83a1.0143,1.0143,0,1,1,0-2.0285h8.7651A1.0143,1.0143,0,1,1,16.5947,25.4Z"/>
</svg>);
const GridSvgIcon = (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <rect x="8" y="8" width="7" height="7"/>
  <rect x="17" y="8" width="7" height="7"/>
  <rect x="8" y="17" width="7" height="7"/>
  <rect x="17" y="17" width="7" height="7"/>
</svg>);

class ViewTypeButton extends React.Component {
  constructor(props) {
    super(props);

    this._onChange = this._onChange.bind(this);
  }

  _onChange(e) {
    const displayType = e.currentTarget.value;
    Actions.updateDisplayView(displayType);
  }

  render() {
    return (
      <fieldset className="switch viewType" tabIndex="0">
        <legend>Display items as a list or grid?</legend>
        <input
          type="radio"
          className="switch-input"
          name="viewType"
          value="list"
          id="listInput"
          checked={this.props.type === 'list'}
          onChange={this._onChange}
        />
        <label
          htmlFor="listInput"
          className="switch-label label-left"
        >
          {ListSvgIcon} list
        </label>
        <input
          type="radio"
          className="switch-input"
          name="viewType"
          value="grid"
          id="gridInput"
          checked={this.props.type === 'grid'}
          onChange={this._onChange}
        />
        <label
          htmlFor="gridInput"
          className="switch-label label-right"
        >
          {GridSvgIcon} grid
        </label>
        <span className="switch-selection"></span>
      </fieldset>
    );
  }
}

ViewTypeButton.propTypes = {
  type: React.PropTypes.string.isRequired,
};

ViewTypeButton.defaultProps = {
  type: 'grid',
};

export default ViewTypeButton;
