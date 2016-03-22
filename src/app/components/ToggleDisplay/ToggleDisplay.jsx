import React from 'react';
import Radium from 'radium';
import cx from 'classnames';

import ClickOutHandler from 'react-onclickout';
import axios from 'axios';

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
    const activeClass = this.props.active ? 'active' : '';

    return (
      <li onClick={this.props.onClick} className={activeClass}>
        <a href="#">
          {this.props.item}
          <span className={`minus-icon ${activeClass}`}></span>
        </a>
      </li>
    );
  }
}

// Only select one filter per category
class FilterList extends React.Component {
  constructor(props) {
    super(props);

    this._setActive = this._setActive.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  _setActive(item) {
    const title = this.props.list.title;

    if (this.props.list.active === item) {
      this.props.manageSelected({
        filter: title,
        selected: '',
      });
    } else {
      this.props.manageSelected({
        filter: title,
        selected: item,
      });
    }
  }

  _renderList(list) {
    const activeItem = this.props.list.active;

    return _.map(list, (item, i) => {
      return <FilterListItem
              item={item}
              filter={this.props.list.title}
              active={activeItem === item}
              key={i}
              onClick={this._setActive.bind(this, item)} />
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

// can select multiple filters but only one per each category.
class Filter extends React.Component {
  constructor(props) {
    super(props);

    this._closeFilters = this._closeFilters.bind(this);
    this.manageSelected = this.manageSelected.bind(this);
    this._submitFilters = this._submitFilters.bind(this);
    this._resetFilters = this._resetFilters.bind(this);
    this.state = {
      format: '',
      audience: '',
      language: '',
      availability: '',
    }
  }

  _closeFilters() {
    Actions.toggleFilters(false);
  }

  _selectFilter(queries) {
    axios
      .get(`/api?${queries}&itemCount=18`)
      .then(response => {
        console.log(response.data);
        Actions.updateNewArrivalsData(response.data);
      }); /* end axios call */
  }

  manageSelected(item) {
    const filter = item.filter.toLowerCase();

    // ES6 dynamic keys! woohoo
    this.setState({
      [filter]: item.selected
    });
  }

  _submitFilters() {
    const filters = this.state;
    let queries = '';

    for (const filter in filters) {
      if (filters[filter] !== '' && (filter === 'format' || filter === 'language')) {
        queries += `&${filter}=${filters[filter]}`;
      }
    }

    console.log(queries);
    this._selectFilter(queries);
  }

  _resetFilters() {
    this.setState({
      format: '',
      audience: '',
      language: '',
      availability: '',
    });

    this._selectFilter();
  }

  render() {
    const formatData = {
      title: 'Format',
      data: ['BOOK/TEXT', 'E-BOOK', 'LARGE PRINT', 'AUDIOBOOK',
        'E-AUDIOBOOK', 'DVD', 'BLU-RAY', 'MUSIC CD'],
      active: this.state.format,
    };
    const audienceData = {
      title: 'Audience',
      data: ['Adult', 'Children', 'Young Adult'],
      active: this.state.audience,
    };
    const languageData = {
      title: 'Language',
      data: ['English', 'Spanish', 'Chinese', 'Russian', 'French'],
      active: this.state.language,
    };
    const availabilityData = {
      title: 'Availability',
      data: ['Available', 'Waitlist'],
      active: this.state.availability,
    };

    // console.log(this.state);

    return (
      <div className={`filter-wrapper ${this.props.active}`}>
        <div className="filter-header-mobile">
          <FilterIcon />
          <h2>Filter by</h2>
          <CloseButton onClick={this._closeFilters} className='mobile-close' />
        </div>

        <FilterList list={formatData} manageSelected={this.manageSelected} />
        <FilterList list={audienceData} manageSelected={this.manageSelected} />
        <FilterList list={languageData} manageSelected={this.manageSelected} />
        <FilterList list={availabilityData} manageSelected={this.manageSelected} />

        <div className="submit-buttons">
          <button className="PillButton" onClick={this._submitFilters}>
            Apply
          </button>

          <button className="PillButton" onClick={this._resetFilters}>
            Reset All
          </button>
        </div>

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
            value={displayTitle}
            onClick={this._handleDisplayView}
          />
        </li>
        <li>
          <ClickOutHandler onClickOut={this._handleOnClickOut.bind(this)} className="clickOutContainer">
            <div className="filterButton">
              <PillButton
                className="filters"
                iconClass={filterIconClass}
                title={filterTitle}
                value={!filterActive}
                onClick={this._handleFilterView}
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
