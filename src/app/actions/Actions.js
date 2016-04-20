import alt from 'dgx-alt-center';

/**
 * Alt Actions for the app.
 */
class Actions {
  /**
   * @param {array} data - Data for the New Arrivals app.
   */
  updateNewArrivalsData(data) {
    this.dispatch(data);
  }

  /**
   * @param {string} displayType - Either 'grid' or 'list'.
   */
  updateDisplayView(displayType) {
    this.dispatch(displayType);
  }

  /**
   * @param {boolean} toggle - To display or hide the list of filters.
   */
  toggleFilters(toggle) {
    this.dispatch(toggle);
  }

  /**
   * @param {string} value - The value of the drop down.
   */
  updateDropDownValue(value) {
    this.dispatch(value);
  }

  /**
   * @param {object} obj - The key/value pairs of the selected filters.
   */
  updateFiltered(obj) {
    this.dispatch(obj);
  }

  /**
   * @param {boolean} bol - Whether the Isotopes grid needs to be updated.
   */
  isotopeUpdate(bol) {
    this.dispatch(bol);
  }

  /**
   * @param {boolean} bol - Whether there's at least one selected filter.
   */
  updateActiveFilters(bol) {
    this.dispatch(bol);
  }
}

export default alt.createActions(Actions);
