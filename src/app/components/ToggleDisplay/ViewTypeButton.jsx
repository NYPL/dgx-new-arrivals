import React from 'react';
import {
  ListIcon,
  GridIcon,
} from 'dgx-svg-icons';

import { trackNewArrivals } from '../../utils/utils.js';

import Actions from '../../actions/Actions.js';

class ViewTypeButton extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    const displayType = e.currentTarget.value;
    Actions.updateDisplayView(displayType);
    trackNewArrivals('Toggle View Type', displayType);
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
          onChange={this.onChange}
          aria-labelledby="label-list"
        />
        <label
          htmlFor="listInput"
          className="switch-label label-left"
          id="label-list"
        >
          <span>
          {<ListIcon />} list
          </span>
        </label>
        <input
          type="radio"
          className="switch-input"
          name="viewType"
          value="grid"
          id="gridInput"
          checked={this.props.type === 'grid'}
          onChange={this.onChange}
          aria-labelledby="label-grid"
        />
        <label
          htmlFor="gridInput"
          className="switch-label label-right"
          id="label-grid"
        >
          <span>
          {<GridIcon />} grid
          </span>
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
