import React from 'react';
import Radium from 'radium';
import cx from 'classnames';

import ClickOutHandler from 'react-onclickout';
import axios from 'axios';

import PillButton from '../Buttons/PillButton.jsx';

import NewArrivalsStore from '../../stores/Store.js';
import Actions from '../../actions/Actions.js';

import Filter from '../Filter/Filter.jsx';

import _ from 'underscore';

/**
 * Displays the two buttons that are used to toggle the Isotopes grid and displays the filters.
 * @extends {React}
 */
class ToggleDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.state = NewArrivalsStore.getState();

    this._handleDisplayView = this._handleDisplayView.bind(this);
    this._handleFilterView = this._handleFilterView.bind(this);
    this._handleOnClickOut = this._handleOnClickOut.bind(this);
    this._onChange = this._onChange.bind(this);
  }

  componentDidMount() {
    NewArrivalsStore.listen(this._onChange);
  }

  componentWillUnmount() {
    NewArrivalsStore.unlisten(this._onChange);
  }

  /**
   * Triggers the Alt Action to update the Isotopes grid display.
   * @param {string} displayType - Display either 'grid' or 'list'.
   */
  _handleDisplayView(displayType) {
    Actions.updateDisplayView(displayType);
  }

  /**
   * Triggers the Alt Action to trigger displaying the filters.
   * @param {boolean} view
   */
  _handleFilterView(view) {
    Actions.toggleFilters(view);
  }

  /**
   * Close the filter list if it is displaying using react-onclickout.
   */
  _handleOnClickOut(e) {
    if (this.state.toggleFilter) {
      Actions.toggleFilters(false);
    }
  }

  _onChange() {
    this.setState(NewArrivalsStore.getState());
  }

  render() {
    const gridActive = this.state.displayType === 'grid';
    const viewIconClass = cx({
      '-grid-icon': gridActive,
      '-list-icon': !gridActive,
    });
    // Display the opposite 
    const displayTitle = gridActive ? 'list' : 'grid';
    const filterActive = this.state.toggleFilter;
    const filterIconClass = filterActive ? ' active' : '';
    const filterTitle = 'Filter';

    const viewSvgIcon =  gridActive ? 
      (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
        <title>list.icon</title>
        <path d="M23.4829,9.5H7.83a1.0143,1.0143,0,1,1,0-2.0285H23.4829A1.0143,1.0143,0,1,1,23.4829,9.5Z"/>
        <path d="M23.4829,19.5285H7.83a1.0143,1.0143,0,1,1,0-2.0285H23.4829A1.0143,1.0143,0,1,1,23.4829,19.5285Z"/>
        <path d="M16.8125,14.5h-9a0.977,0.977,0,0,1-1-.9857A1.0155,1.0155,0,0,1,7.83,12.5h8.7651a1.1951,1.1951,0,0,1,1.2178,1A0.9889,0.9889,0,0,1,16.8125,14.5Z"/>
        <path d="M16.5947,25.4H7.83a1.0143,1.0143,0,1,1,0-2.0285h8.7651A1.0143,1.0143,0,1,1,16.5947,25.4Z"/>
      </svg>) :
      (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
        <title>grid.icon.svg</title>
        <path d="M17,6H6V26H26V6H17ZM8,8h7v7H8V8ZM8,24V17h7v7H8Zm16,0H17V17h7v7Zm-7-9V8h7v7H17Z"/>
      </svg>);

    const svgFilterIcon = <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
        <title>filter.v3</title>
        <g>
          <circle cx="13.0944" cy="7.375" r="1.3192"/>
          <circle cx="19.6222" cy="6.375" r="1.3189"/>
          <circle cx="15.9997" cy="10.5242" r="1.3193"/>
          <g>
            <path d="M14.1785,27.562a0.95,0.95,0,0,1-.95-0.95v-10.27L6.6875,9.2893a0.95,0.95,0,0,1,1.3956-1.29l7.0455,7.598v11.015A0.95,0.95,0,0,1,14.1785,27.562Z"/>
            <path d="M18.0387,24.794a0.95,0.95,0,0,1-.95-0.95V15.603l7.126-7.8149a0.95,0.95,0,0,1,1.41,1.2744l-6.636,7.2729v7.5083A0.95,0.95,0,0,1,18.0387,24.794Z"/>
          </g>
        </g>
      </svg>;
    const iconClass = cx({
      'nypl-icon-wedge-down': !filterActive,
      'nypl-icon-solo-x': filterActive
    });

    return (
      <ul className="ToggleDisplay">
        <li>
          <PillButton
            className="view"
            icon={viewSvgIcon}
            title={displayTitle}
            value={displayTitle}
            onClick={this._handleDisplayView}
          />
        </li>
        <li>
          <ClickOutHandler onClickOut={this._handleOnClickOut.bind(this)} className="clickOutContainer">
            <div className="filterButton">
              <PillButton
                className="filters"
                icon={svgFilterIcon}
                title={filterTitle}
                value={!filterActive}
                onClick={this._handleFilterView}
                iconClass={iconClass}
              />
              <Filter active={filterIconClass} />
            </div>
          </ClickOutHandler>
        </li>
      </ul>
    );
  }
};

ToggleDisplay.defaultProps = {
  className: 'ToggleDisplay',
  id: 'ToggleDisplay'
};

export default Radium(ToggleDisplay);
