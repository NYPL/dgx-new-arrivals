import Actions from '../actions/Actions.js';
import alt from 'dgx-alt-center';

/**
 * Alt Store for the New Arrivals app.
 */
class NewArrivalsStore {
  /**
   * Set up listeners and initial values for the store variables.
   */
  constructor() {
    this.bindListeners({
      handleNewArrivals: Actions.UPDATE_NEW_ARRIVALS_DATA,
      updateDisplayView: Actions.UPDATE_DISPLAY_VIEW,
      toggleFilters: Actions.TOGGLE_FILTERS,
      updateDropDownValue: Actions.UPDATE_DROP_DOWN_VALUE,
      updateFiltered: Actions.UPDATE_FILTERED,
      isotopeUpdate: Actions.ISOTOPE_UPDATE,
      updateActiveFilters: Actions.UPDATE_ACTIVE_FILTERS,
      addMoreItems: Actions.ADD_MORE_ITEMS,
      handleUpdatePageNum: Actions.UPDATE_PAGE_NUM,
    });

    this.on('init', () => {
      this.newArrivalsData = [];
      this.displayType = 'grid';
      this.toggleFilter = false;
      this.dropDownValue = '';
      this.filters = {
        format: '',
        audience: '',
        language: '',
        genre: '',
      };
      this.languages = [];
      this.isotopeUpdate = false;
      this.activeFilters = false;
      this.pageNum = 2;
    });
  }

  /**
   * @param {array} data - Array with updated data.
   */
  handleNewArrivals(data) {
    this.newArrivalsData = data;
  }

  /**
   * @param {string} displayType - Either 'grid' or 'list'.
   */
  updateDisplayView(displayType) {
    this.displayType = displayType;
  }

  /**
   * @param {boolean} filter - To display the list of filters.
   */
  toggleFilters(filter) {
    this.toggleFilter = filter;
  }

  /**
   * @param {string} value - The list of the drop down select.
   */
  updateDropDownValue(value) {
    this.dropDownValue = value;
  }

  updateFiltered(obj) {
    this.filters = obj;
  }

  isotopeUpdate(bol) {
    this.isotopeUpdate = bol;
  }

  updateActiveFilters(bol) {
    this.activeFilters = bol;
  }

  addMoreItems(data) {
    this.newArrivalsData.bibItems = this.newArrivalsData.bibItems.concat(data);
  }

  handleUpdatePageNum(bol) {
    if (bol) {
      this.pageNum += 1;
    } else {
      this.pageNum = 2;
    }
  }
}

export default alt.createStore(NewArrivalsStore, 'NewArrivalsStore');
