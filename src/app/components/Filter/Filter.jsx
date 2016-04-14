import React from 'react';
import Radium from 'radium';
import axios from 'axios';

import PillButton from '../Buttons/PillButton.jsx';

import NewArrivalsStore from '../../stores/Store.js';
import Actions from '../../actions/Actions.js';

import FilterList from './FilterList.jsx';

import appConfig from '../../../../appConfig.js';

import _ from 'underscore';

const { appFilters } = appConfig;

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
    this._onChange = this._onChange.bind(this);
    this.state = {
      active: NewArrivalsStore.getState().activeFilters,
      filters: NewArrivalsStore.getState().filters,
    }
  }
  componentDidMount() {
    NewArrivalsStore.listen(this._onChange);
  }

  componentWillUnmount() {
    NewArrivalsStore.unlisten(this._onChange);
  }

  _onChange() {
    this.setState({
      active: NewArrivalsStore.getState().activeFilters,
      filters: NewArrivalsStore.getState().filters,
    });
  }

  _closeFilters() {
    Actions.toggleFilters(false);
  }

  _selectFilter(queries) {
    axios
      .get(`/api?${queries}&itemCount=18`)
      .then(response => {
        // console.log(response.data);
        Actions.updateNewArrivalsData(response.data);
        Actions.updateFiltered(this.state.filters);
        Actions.updateActiveFilters(this.state.active);

        setTimeout(() => {
          Actions.isotopeUpdate(true);
        }, 300);
      })
      .catch(error => {
        console.log(`error making ajax call: ${error}`);
      }); /* end Axios call */
  }

  manageSelected(item) {
    const filter = item.filter.toLowerCase();
    const filters = this.state.filters;
    let active = false;

    filters[filter] = item.selected;

    for (let filter in filters) {
      if (filters[filter] !== '') {
        active = true;
      }
    }

    this.setState({
      filters,
      active,
    });
  }

  _submitFilters() {
    const filters = this.state.filters;
    let queries = '';

    for (const filter in filters) {
      if (filters[filter] !== '') {
        if (filters[filter] === 'Research') {
          queries += `&audience=${filters[filter]}`;
        } else {
          queries += `&${filter}=${filters[filter]}`;
        }
      }
    }

    this._selectFilter(queries);
    this._closeFilters();
  }

  _resetFilters() {
    const filters = {
      format: '',
      audience: '',
      language: '',
    };

    this.setState({ filters });
    Actions.updateFiltered(filters);

    this._selectFilter();
  }

  render() {
    const filters = this.state.filters;
    const formatData = appFilters.formatData;
    const audienceData = appFilters.audienceData;
    const languageData = appFilters.languageData;
    const genreData = appFilters.genreData;
    const activeSubmitButtons = this.state.active ? 'active' : '';

    formatData.active = filters.format;
    audienceData.active = filters.audience;
    languageData.active = filters.language;
    genreData.active = filters.genre;

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
          <FilterList list={genreData} manageSelected={this.manageSelected} />
        </ul>

        <div className={`submit-buttons ${activeSubmitButtons}`}>
          <button className="PillButton apply" onClick={this._submitFilters}>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
              <title>apply.icon.svg</title>
              <path d="M23.26,13.1819a1.2736,1.2736,0,0,0-1.7332,0L17,17.6253V6.1041a1.0119,1.0119,0,1,0-2,0V17.6253l-4.5268-4.4434a1.2212,1.2212,0,0,0-1.6916,0,1.17,1.17,0,0,0-.0208,1.65L15.1786,21.26l0,0.0083a1.1694,1.1694,0,0,0,1.6488,0l0.0048-.0083L23.26,14.8318A1.17,1.17,0,0,0,23.26,13.1819Z" />
              <rect x="14.8333" y="16.3602" width="2.3333" height="16.6711" rx="1.1667" ry="1.1667" transform="translate(-8.6957 40.6957) rotate(-90)" />
            </svg>
            <span>Apply</span>
          </button>

          <button className="PillButton reset" onClick={this._resetFilters}>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
              <title>refresh.icon.svg</title>
              <path d="M10.96075,11l4.60907-3.19434a1,1,0,0,0-1.13965-1.64355L5.939,12.04688l8.83594,6.248a0.99981,0.99981,0,0,0,1.1543-1.63281L10.75061,13H23v8H6a1,1,0,0,0,0,2H25V11H10.96075Z"/>
            </svg>
            <span>Reset All</span>
          </button>
        </div>

      </div>
    );
  }
}

export default Filter;
