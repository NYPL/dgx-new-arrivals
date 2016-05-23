import React from 'react';
import {
  map as _map,
  mapObject as _mapObject,
  clone as _clone,
} from 'underscore';
import {
  FilterIcon,
  ApplyIcon,
  ResetIcon,
} from 'dgx-svg-icons';

import NewArrivalsStore from '../../stores/Store.js';
import Actions from '../../actions/Actions.js';

import FilterList from './FilterList.jsx';
import CloseButton from '../Buttons/CloseButton.jsx';

import {
  makeQuery,
  makeApiCall,
} from '../../utils/utils.js';
import appConfig from '../../../../appConfig.js';

const { appFilters } = appConfig;

// can select multiple filters but only one per each category.
class Filter extends React.Component {
  constructor(props) {
    super(props);

    this.closeFilters = this.closeFilters.bind(this);
    this.manageSelected = this.manageSelected.bind(this);
    this.submitFilters = this.submitFilters.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
    this.selectFilter = this.selectFilter.bind(this);
    this.onChange = this.onChange.bind(this);

    this.state = {
      active: NewArrivalsStore.getState().activeFilters,
      filters: NewArrivalsStore.getState().filters,
      languages: NewArrivalsStore.getState().languages,
      availability: NewArrivalsStore.getState().availabilityType,
    };
  }

  componentDidMount() {
    NewArrivalsStore.listen(this.onChange);
  }

  componentWillUnmount() {
    NewArrivalsStore.unlisten(this.onChange);
  }

  onChange() {
    this.setState({
      active: NewArrivalsStore.getState().activeFilters,
      filters: NewArrivalsStore.getState().filters,
      pageNum: NewArrivalsStore.getState().pageNum,
      languages: NewArrivalsStore.getState().languages,
      availability: NewArrivalsStore.getState().availabilityType,
    });
  }

  closeFilters() {
    Actions.toggleFilters(false);
  }

  selectFilter(queries, updatePageNum, filters, active) {
    makeApiCall(queries, response => {
      Actions.updateNewArrivalsData(response.data);
      Actions.updateFiltered(filters);
      Actions.updateActiveFilters(active);

      if (!updatePageNum) {
        Actions.updatePageNum(false);
      }
    });
  }

  manageSelected(item) {
    const filter = item.filter.toLowerCase();
    const filters = _clone(this.state.filters);
    let active = false;

    filters[filter] = item.selected;

    _mapObject(filters, f => {
      if (f !== '') {
        active = true;
      }
    });

    Actions.updateActiveFilters(active);
    this.setState({
      filters,
    });
  }

  submitFilters() {
    const filters = this.state.filters;
    const availability = this.state.availability;
    const pageNum = this.state.pageNum;
    const queries = makeQuery(filters, availability, pageNum, true);

    this.selectFilter(queries, true, filters, true);
    this.closeFilters();
  }

  resetFilters() {
    const filters = {
      format: '',
      audience: '',
      language: '',
      genre: '',
    };

    this.selectFilter('', false, filters, false);
  }

  render() {
    const filters = this.state.filters;
    const formatData = appFilters.formatData;
    const audienceData = appFilters.audienceData;
    const languageData = appFilters.languageData;
    const genreData = appFilters.genreData;
    const activeSubmitButtons = this.state.active ? 'active' : '';

    const updatedLanguages = _map(this.state.languages, language =>
      ({
        id: language.name,
        label: language.name,
        count: language.count,
      })
    );

    languageData.data = updatedLanguages;

    formatData.active = filters.format;
    audienceData.active = filters.audience;
    languageData.active = filters.language;
    genreData.active = filters.genre;

    return (
      <div className={`filter-wrapper ${this.props.active}`}>
        <div className="filter-header-mobile">
          <FilterIcon className="mobile-filter svgIcon" />
          <h2>Filter by</h2>
          <CloseButton onClick={this.closeFilters} className="mobile-close" />
        </div>

        <ul>
          <FilterList list={formatData} manageSelected={this.manageSelected} />
          <FilterList list={audienceData} manageSelected={this.manageSelected} />
          <FilterList list={languageData} manageSelected={this.manageSelected} />
          <FilterList list={genreData} manageSelected={this.manageSelected} />
        </ul>

        <div className={`submit-buttons ${activeSubmitButtons}`}>
          <button className="PillButton apply" onClick={this.submitFilters}>
            <ApplyIcon />
            <span>Apply</span>
          </button>

          <button className="PillButton reset" onClick={this.resetFilters}>
            <ResetIcon />
            <span>Reset All</span>
          </button>
        </div>
      </div>
    );
  }
}

Filter.propTypes = {
  active: React.PropTypes.string,
};

export default Filter;
