import React from 'react';
import cx from 'classnames';

import ClickOutHandler from 'react-onclickout';
import { FilterIcon } from 'dgx-svg-icons';

import PillButton from '../Buttons/PillButton.jsx';

import NewArrivalsStore from '../../stores/Store.js';
import Actions from '../../actions/Actions.js';

import FilterDialog from '../FilterDialog/FilterDialog.jsx';
import AvailabilityToggle from '../ToggleUIs/AvailabilityToggle.jsx';
import ViewTypeButton from '../ToggleUIs/ViewTypeButton.jsx';

import { trackNewArrivals } from '../../utils/utils.js';

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
    const filterView = view ? 'Open' : 'Close';
    Actions.toggleFilters(view);
    trackNewArrivals('Filter Window', filterView);
  }

  /**
   * Close the filter list if it is displaying using react-onclickout.
   */
  handleOnClickOut() {
    if (this.state.toggleFilter) {
      Actions.toggleFilters(false);
      trackNewArrivals('Filter Window', 'Close');
    }
  }

  render() {
    const displayType = this.state.displayType;
    const filterActive = this.state.toggleFilter;
    const filterIconClass = filterActive ? ' active' : '';
    const filterTitle = 'Filter';

    const iconClass = cx({
      'nypl-icon-wedge-down': !filterActive,
      'nypl-icon-solo-x': filterActive,
    });

    return (
      <ul className="toggleDisplay">
        <li>
          <AvailabilityToggle />
        </li>
        <li>
          <ViewTypeButton type={displayType} />
        </li>
        <li>
          <ClickOutHandler
            onClickOut={() => this.handleOnClickOut()}
            className="clickOutContainer"
          >
            <div className="filterButton-wrapper">
              <PillButton
                className="filterButton"
                icon={<FilterIcon ariaHidden />}
                title={filterTitle}
                value={!filterActive}
                onClick={this.handleFilterView}
                iconClass={iconClass}
              />
              <FilterDialog active={filterIconClass} />
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
