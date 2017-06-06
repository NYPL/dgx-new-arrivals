import alt from 'dgx-alt-center';

/**
 * Alt Actions for the app.
 */
class Actions {
  /**
   * @param {array} data - Data for the New Arrivals app.
   */
  updateNewArrivalsData(data) {
    return data;
  }

  /**
   * @param {string} displayType - Either 'grid' or 'list'.
   */
  updateDisplayView(displayType) {
    return displayType;
  }

  /**
   * @param {boolean} toggle - To display or hide the list of filters.
   */
  toggleFilters(toggle) {
    return toggle;
  }

  /**
   * @param {string} value - The value of the drop down.
   */
  updateDropDownValue(value) {
    return value;
  }

  /**
   * @param {object} obj - The key/value pairs of the selected filters.
   */
  updateFiltered(obj) {
    return obj;
  }

  /**
   * @param {boolean} bool - Whether there's at least one selected filter.
   */
  updateActiveFilters(bool) {
    return bool;
  }

  addMoreItems(data) {
    return data;
  }

  updatePageNum(bool) {
    return bool;
  }

  updateAvailabilityType(type) {
    return type;
  }

  updatePublicationType(type) {
    return type;
  }

  updateDisplayPagination(bool) {
    return bool;
  }
}

export default alt.createActions(Actions);
