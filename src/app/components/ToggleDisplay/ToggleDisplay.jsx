import React from 'react';
import Radium from 'radium';
import cx from 'classnames';
import ClickOutHandler from 'react-onclickout';

import PillButton from '../Buttons/PillButton.jsx';

import NewArrivalsStore from '../../stores/Store.js';
import Actions from '../../actions/Actions.js';

import _ from 'underscore';

class IconButton extends React.Component {
  constructor(props) {
    super(props);
    this._onClick = this._onClick.bind(this);
  }

  _onClick(e) {
    e.preventDefault();
    this.props.onClick();
  }

  render() {
    return (
      <button
        className={`${this.props.className} svgIcon`}
        onClick={this._onClick}
      >
        {this.props.icon}
      </button>
    );
  }
}


class CloseButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const icon = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 50 50"
        height={10}
        width={10}
      >
        <polygon points="50 5.84 44.16 0 25 19.16 5.84 0 0 5.84 19.16 25 0 44.16 5.84 50 25 30.84 44.16 50 50 44.16 30.84 25 50 5.84"/>
      </svg>
    );

    return (
      <IconButton
        {...this.props}
        icon={icon} />
    );
  }
}

class FilterIcon extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const icon = (
      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25">
       <title>filter</title>
       <g>
         <circle cx="8.494" cy="1.875" r="1.319" fill="#333"/>
         <circle cx="16.441" cy="1.875" r="1.319" fill="#333"/>
         <circle cx="12.578" cy="5.563" r="1.319" fill="#333"/>
         <g>
           <path d="M10.678,25a0.95,0.95,0,0,1-.95-0.95V11.842L0.253,1.6a0.95,0.95,0,0,1,1.4-1.29L11.629,11.1V24.05A0.95,0.95,0,0,1,10.678,25Z" transform="translate(0 0)" fill="#333"/>
           <path d="M14.539,20.294a0.95,0.95,0,0,1-.95-0.95V11.1L23.344,0.314a0.95,0.95,0,0,1,1.41,1.274L15.489,11.835v7.508A0.95,0.95,0,0,1,14.539,20.294Z" transform="translate(0 0)" fill="#333"/>
         </g>
       </g>
      </svg>
    );

    return (
      <span className={`${this.props.className} svgIcon`} {...this.props}>
        {icon}
      </span>
    );
  }
}

class FilterListItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <li>{this.props.item}</li>
    );
  }
}

class FilterList extends React.Component {
  constructor(props) {
    super(props);
  }

  _renderList(list) {
    return _.map(list, (item, i) => {
      return <FilterListItem item={item} key={i} />
    });
  }

  render() {
    const list = this._renderList(this.props.list.data);

    return (
      <div className="FilterList">
        <div className="inner">
          <h3>{this.props.list.title}</h3>
        </div>
        <ul>
          {list}
        </ul>
      </div>
    );
  }
}


class Filter extends React.Component {
  constructor(props) {
    super(props);

    this._closeFilters = this._closeFilters.bind(this);
  }

  _closeFilters() {
    Actions.toggleFilters(false);
  }

  render() {
    const formatData = {
      title: 'Format',
      data: ['BOOK/TEXT', 'E-BOOK', 'LARGE PRINT', 'AUDIOBOOK',
        'E-AUDIOBOOK', 'DVD', 'BLU-RAY', 'MUSIC CD'],
    };
    const audienceData = {
      title: 'Audience',
      data: ['Adult', 'Children', 'Young Adult'],
    };
    const languageData = {
      title: 'Language',
      data: ['English', 'Spanish', 'Chinese', 'Russian', 'French'],
    };
    const availabilityData = {
      title: 'Availability',
      data: ['Available', 'Waitlist'],
    };

    return (
      <div className={`filter-wrapper ${this.props.active}`}>
        <div className="filter-header-mobile">
          <FilterIcon />
          <h2>Filter by</h2>
          <CloseButton onClick={this._closeFilters} />
        </div>

        <FilterList list={formatData} />
        <FilterList list={audienceData} />
        <FilterList list={languageData} />
        <FilterList list={availabilityData} />

      </div>
    );
  }
}


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

    return (
      <ul className="ToggleDisplay">
        <li>
          <PillButton
            className="view"
            iconClass={viewIconClass}
            title={displayTitle}
            toggleValue={displayTitle}
            onClick={this._handleDisplayView}
          />
        </li>
        <li>
          <ClickOutHandler onClickOut={this._handleOnClickOut.bind(this)}>
            <PillButton
              className="filters"
              iconClass={filterIconClass}
              title={filterTitle}
              toggleValue={!filterActive}
              onClick={this._handleFilterView}
            />
            <Filter active={filterIconClass} />
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
