import React from 'react';
import PropTypes from 'prop-types';
import {
  clone as _clone,
  every as _every,
  extend as _extend,
} from 'underscore';

import {
  FilterIcon,
  ResetIcon,
  CheckSoloIcon,
} from 'dgx-svg-icons';

import NewArrivalsStore from '../../stores/Store.js';
import Actions from '../../actions/Actions.js';

import FilterList from '../FilterList/FilterList.jsx';
import CloseButton from '../Buttons/CloseButton.jsx';
import PublicationToggle from '../ToggleUIs/PublicationToggle.jsx';

import IconButton from '../Buttons/IconButton.jsx';

import {
  makeFrontEndQuery,
  makeApiCall,
  createAppHistory,
  manageHistory,
  trackNewArrivals,
} from '../../utils/utils.js';
import appConfig from '../../../../appConfig.js';

const { appFilters } = appConfig;

const history = createAppHistory();

// can select multiple filters but only one per each category.
class Filter extends React.Component {
  constructor(props) {
    super(props);

    this.closeFilters = this.closeFilters.bind(this);
    this.manageSelected = this.manageSelected.bind(this);
    this.submitFilters = this.submitFilters.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
    this.selectFilter = this.selectFilter.bind(this);
    this.managePublicationType = this.managePublicationType.bind(this);
    this.onChange = this.onChange.bind(this);

    this.state = _extend(
      { genreData: appFilters.genreData.data },
      NewArrivalsStore.getState()
    );
  }

  componentDidMount() {
    NewArrivalsStore.listen(this.onChange);
  }

  componentWillUnmount() {
    NewArrivalsStore.unlisten(this.onChange);
  }

  onChange() {
    this.setState(_extend({}, NewArrivalsStore.getState()));
  }

  closeFilters(gaAction) {
    if (gaAction) {
      trackNewArrivals(gaAction, 'Close');
    }
    Actions.toggleFilters(false);
  }

  selectFilter(queries, updatePageNum, filters, active, publicationType, reset) {
    makeApiCall(queries, response => {
      const displayPagination = response.data.bibItems.length !== 0;
      Actions.updateDisplayPagination(displayPagination);
      Actions.updateNewArrivalsData(response.data);
      Actions.updateFiltered(filters);
      Actions.updateActiveFilters(active);
      Actions.updatePublicationType(publicationType);

      manageHistory(this.state, history, reset);

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

  managePublicationType(type) {
    this.setState({
      publicationType: type,
    });
  }

  submitFilters(gaAction = 'Filters') {
    const {
      filters,
      availabilityType,
      pageNum,
      publicationType,
    } = this.state;
    const queries = makeFrontEndQuery(filters, availabilityType, pageNum, publicationType, true);

    trackNewArrivals(gaAction, 'Apply');
    this.selectFilter(queries, true, filters, true, publicationType);
    this.closeFilters();
  }

  resetFilters(gaAction = 'Filters') {
    const filters = {
      format: 'AnyFormat',
      audience: 'AnyAudience',
      language: 'AnyLanguage',
      genre: 'AnyGenre',
    };

    trackNewArrivals(gaAction, 'Reset All');
    this.selectFilter('', false, filters, false, 'recentlyReleased', true);
  }

  render() {
    const {
      filters,
      languages,
      publicationType,
    } = this.state;
    const {
      formatData,
      audienceData,
      languageData,
      genreData,
    } = appFilters;
    const active = _every(filters, f => f === '');
    const activeSubmitButtons = active ? '' : 'active';
    const allGenres = this.state.genreData;
    // const basicGenres = genreData.data.slice(0, 3);
    let genreList;

    genreData.data = allGenres;
    genreList = (
      <FilterList
        list={genreData}
        manageSelected={this.manageSelected}
        dividerTitle={genreData.title}
        dividerIndex={13}
      />
    );

    languageData.data = languages;

    formatData.active = filters.format;
    audienceData.active = filters.audience;
    languageData.active = filters.language;
    genreData.active = filters.genre;

    return (
      <div className={`filterDialog ${this.props.active}`}>
        <div className="filterDialog-header-mobile">
          <FilterIcon className="mobile-filter" ariaHidden />
          <h2>Filter by</h2>

          <ul className="mobile-filter-buttons">
            <li>
              <IconButton
                className={'apply'}
                icon={<CheckSoloIcon ariaHidden />}
                onClick={() => this.submitFilters('Mobile Filter Window')}
                label="Apply Filters"
              />
            </li>
            <li>
              <IconButton
                className={'reset'}
                icon={<ResetIcon ariaHidden fill="#fff" />}
                onClick={() => this.resetFilters('Mobile Filter Window')}
                label="Reset All"
              />
            </li>
            <li>
              <CloseButton
                className="mobile-close"
                onClick={() => this.closeFilters('Mobile Filter Window')}
              />
            </li>
          </ul>
        </div>

        <div className="publication-filter">
          <p>Filter by Publish Date</p>
          <PublicationToggle
            managePublicationType={this.managePublicationType}
            publicationType={publicationType}
          />
        </div>

        <fieldset className="filterDialog-list" tabIndex="0">
          <legend>Filter on the following categories</legend>
          <FilterList list={formatData} manageSelected={this.manageSelected} />
          <FilterList list={audienceData} manageSelected={this.manageSelected} />
          <FilterList list={languageData} manageSelected={this.manageSelected} />
          {genreList}
        </fieldset>

        <ul className="filterDialog-actions">
          <li className={`submit-buttons buttonItems ${activeSubmitButtons}`}>
            <button
              className="PillButton apply"
              onClick={() => this.submitFilters('Filters')}
              aria-controls="isotopesContainer"
            >
              <CheckSoloIcon ariaHidden />
              <span>Apply</span>
            </button>
          </li>

          <li className={`submit-buttons buttonItems ${activeSubmitButtons}`}>
            <button
              className="PillButton reset"
              onClick={() => this.resetFilters('Filters')}
              aria-controls="isotopesContainer"
            >
              <ResetIcon ariaHidden fill="#fff" />
              <span>Reset All</span>
            </button>
          </li>
        </ul>

      </div>
    );
  }
}

Filter.propTypes = {
  active: PropTypes.string,
};

export default Filter;
