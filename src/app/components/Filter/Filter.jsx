import React from 'react';
import Radium from 'radium';
import axios from 'axios';

import PillButton from '../Buttons/PillButton.jsx';

import NewArrivalsStore from '../../stores/Store.js';
import Actions from '../../actions/Actions.js';

import FilterList from './FilterList.jsx';

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
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="2rem" height="2rem">
        <title>solo.x</title>
       <polygon points="54.26 6.34 47.91 0 27.13 20.79 6.34 0 0 6.34 20.79 27.13 0 47.91 6.34 54.26 27.13 33.47 47.91 54.26 54.26 47.91 33.47 27.13 54.26 6.34" />
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
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
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
      </svg>
    );

    return (
      <span className={`${this.props.className} svgIcon`} {...this.props}>
        {icon}
      </span>
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
      })
      .catch(error => {
        console.log(`error making ajax call: ${error}`);
      }); /* end Axios call */
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

    // console.log(queries);
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
      data: ['AUDIOBOOK', 'BLU-RAY', 'BOOK/TEXT', 'DVD', 'E-AUDIOBOOK',
        'E-BOOK', 'LARGE PRINT', 'MUSIC CD'],
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
      data: ['Just Arrived', 'On Order'],
      active: this.state.availability,
    };

    // console.log(this.state);

    return (
      <div className={`filter-wrapper ${this.props.active}`}>
        <div className="filter-header-mobile">
          <FilterIcon className="mobile-filter svgIcon" />
          <h2>Filter by</h2>
          <CloseButton onClick={this._closeFilters} className='mobile-close' />
        </div>

        <ul>
          <FilterList list={formatData} manageSelected={this.manageSelected} />
          <FilterList list={audienceData} manageSelected={this.manageSelected} />
          <FilterList list={languageData} manageSelected={this.manageSelected} />
          <FilterList list={availabilityData} manageSelected={this.manageSelected} />
        </ul>

        <div className="submit-buttons">
          <button className="PillButton apply" onClick={this._submitFilters}>
            Apply
          </button>

          <button className="PillButton reset" onClick={this._resetFilters}>
            Reset All
          </button>
        </div>

      </div>
    );
  }
}

export default Filter;
