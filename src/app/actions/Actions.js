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

  updateFiltered(obj) {
    this.dispatch(obj);
  }
};

export default alt.createActions(Actions);
