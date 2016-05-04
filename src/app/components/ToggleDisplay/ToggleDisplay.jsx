import React from 'react';
import cx from 'classnames';

import ClickOutHandler from 'react-onclickout';

import PillButton from '../Buttons/PillButton.jsx';

import NewArrivalsStore from '../../stores/Store.js';
import Actions from '../../actions/Actions.js';

import Filter from '../Filter/Filter.jsx';
import FilterToggle from '../Filter/FilterToggle.jsx';
import ViewTypeButton from './ViewTypeButton.jsx';

/**
 * Displays the two buttons that are used to toggle the Isotopes grid and displays the filters.
 * @extends {React}
 */
class ToggleDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.state = NewArrivalsStore.getState();

    this.handleFilterView = this.handleFilterView.bind(this);
    this.handleOnClickOut = this.handleOnClickOut.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    NewArrivalsStore.listen(this.onChange);
  }

  componentWillUnmount() {
    NewArrivalsStore.unlisten(this.onChange);
  }

  onChange() {
    this.setState(NewArrivalsStore.getState());
  }

  /**
   * Triggers the Alt Action to trigger displaying the filters.
   * @param {boolean} view
   */
  handleFilterView(view) {
    Actions.toggleFilters(view);
  }

  /**
   * Close the filter list if it is displaying using react-onclickout.
   */
  handleOnClickOut(e) {
    if (this.state.toggleFilter) {
      Actions.toggleFilters(false);
    }
  }

  render() {
    const displayType = this.state.displayType;
    const filterActive = this.state.toggleFilter;
    const filterIconClass = filterActive ? ' active' : '';
    const filterTitle = 'Filter';

    const svgFilterIcon = (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
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
    </svg>);
    const iconClass = cx({
      'nypl-icon-wedge-down': !filterActive,
      'nypl-icon-solo-x': filterActive,
    });

    return (
      <ul className="ToggleDisplay">
        <li>
          <FilterToggle />
        </li>
        <li>
          <ViewTypeButton type={displayType} />
        </li>
        <li>
          <ClickOutHandler onClickOut={this.handleOnClickOut.bind(this)} className="clickOutContainer">
            <div className="filterButton">
              <PillButton
                className="filters"
                icon={svgFilterIcon}
                title={filterTitle}
                value={!filterActive}
                onClick={this.handleFilterView}
                iconClass={iconClass}
              />
              <Filter active={filterIconClass} />
            </div>
          </ClickOutHandler>
        </li>
      </ul>
    );
  }
}

ToggleDisplay.defaultProps = {
  className: 'ToggleDisplay',
  id: 'ToggleDisplay',
};

ToggleDisplay.propTypes = {
  id: React.PropTypes.string,
  className: React.PropTypes.string,
};

export default ToggleDisplay;
