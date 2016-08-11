import React from 'react';

import {
  map as _map,
  clone as _clone,
  every as _every,
} from 'underscore';

import {
  FilterIcon,
  ResetIcon,
  CheckSoloIcon,
} from 'dgx-svg-icons';

import NewArrivalsStore from '../../stores/Store.js';
import Actions from '../../actions/Actions.js';

import FilterList from './FilterList.jsx';
import CloseButton from '../Buttons/CloseButton.jsx';
import PublicationToggle from './PublicationToggle.jsx';

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
      format: '',
      audience: '',
      language: '',
      genre: '',
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
      <div className={`filter ${this.props.active}`}>
        <div className="filter-header-mobile">
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
                icon={<ResetIcon ariaHidden />}
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

        <ul className="filter-actions">
          <li className="buttonItems">
            <p>Filter by Publish Date</p>
            <PublicationToggle
              managePublicationType={this.managePublicationType}
              publicationType={publicationType}
            />
          </li>

          <li className={`submit-buttons buttonItems ${activeSubmitButtons}`}>
            <button className="PillButton apply" onClick={() => this.submitFilters('Filters')}>
              <CheckSoloIcon ariaHidden />
              <span>Apply</span>
            </button>
          </li>
          
          <li className={`submit-buttons buttonItems ${activeSubmitButtons}`}>
            <button className="PillButton reset" onClick={() => this.resetFilters('Filters')}>
              <ResetIcon ariaHidden />
              <span>Reset All</span>
            </button>
          </li>
        </ul>

        <fieldset className="filter-list" tabIndex="0">
          <legend>Filter on the following categories</legend>
          <FilterList list={formatData} manageSelected={this.manageSelected} />
          <FilterList list={audienceData} manageSelected={this.manageSelected} />
          <FilterList list={languageData} manageSelected={this.manageSelected} />
          <FilterList list={genreData} manageSelected={this.manageSelected} />
        </fieldset>
      </div>
    );
  }
}

Filter.propTypes = {
  active: React.PropTypes.string,
};

export default Filter;
