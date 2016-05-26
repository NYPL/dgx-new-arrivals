import React from 'react';

import {
  map as _map,
  mapObject as _mapObject,
  clone as _clone,
  every as _every,
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
import PublicationToggle from './PublicationToggle.jsx';

import IconButton from '../Buttons/IconButton.jsx';

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

    this.state = NewArrivalsStore.getState();
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

  closeFilters() {
    Actions.toggleFilters(false);
  }

  selectFilter(queries, updatePageNum, filters, active) {
    console.log('making clal');
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
    filters[filter] = item.selected;

    this.setState({ filters });
  }

  submitFilters() {
    const {
      filters,
      availabilityType,
      pageNum,
      publicationType,
    } = this.state;
    const queries = makeQuery(filters, availabilityType, pageNum, true, publicationType);

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
    const {
      filters,
      languages,
    } = this.state;
    const formatData = appFilters.formatData;
    const audienceData = appFilters.audienceData;
    const languageData = appFilters.languageData;
    const genreData = appFilters.genreData;
    const active = _every(filters, f => f === '');
    const activeSubmitButtons = active ? '' : 'active';

    const updatedLanguages = _map(languages, language =>
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

          <ul className="mobile-filter-buttons">
            <li>
              <IconButton
                className={'apply'}
                icon={<ApplyIcon />}
                onClick={this.submitFilters}
              />
            </li>
            <li>
              <IconButton
                className={'reset'}
                icon={<ResetIcon />}
                onClick={this.resetFilters}
              />
            </li>
            <li>
              <CloseButton onClick={this.closeFilters} className="mobile-close" />
            </li>
          </ul>
        </div>

        <ul className="filter-apply-wrapper">
          <li className="buttonItems">
            <p>Filter by Publish Date</p>
            <PublicationToggle />
          </li>

          <li className={`submit-buttons buttonItems ${activeSubmitButtons}`}>
            <button className="PillButton apply" onClick={this.submitFilters}>
              <ApplyIcon />
              <span>Apply</span>
            </button>
          </li>
          <li className={`submit-buttons buttonItems ${activeSubmitButtons}`}>
            <button className="PillButton reset" onClick={this.resetFilters}>
              <ResetIcon />
              <span>Reset All</span>
            </button>
          </li>
        </ul>

        <ul>
          <FilterList list={formatData} manageSelected={this.manageSelected} />
          <FilterList list={audienceData} manageSelected={this.manageSelected} />
          <FilterList list={languageData} manageSelected={this.manageSelected} />
          <FilterList list={genreData} manageSelected={this.manageSelected} />
        </ul>
      </div>
    );
  }
}

Filter.propTypes = {
  active: React.PropTypes.string,
};

export default Filter;
