import Actions from '../actions/Actions.js';
import alt from 'dgx-alt-center';

class NewArrivalsStore {
  constructor() {
    this.bindListeners({
      handleNewArrivals: Actions.UPDATE_NEW_ARRIVALS_DATA,
      updateDisplayView: Actions.UPDATE_DISPLAY_VIEW,
      toggleFilters: Actions.TOGGLE_FILTERS,
    });

    this.on('init', () => {
      this.newArrivalsData = [];
      this.displayType =  'grid';
      this.toggleFilter = false;
    });
  }

  handleNewArrivals(data) {
    this.newArrivalsData = data;
  }

  updateDisplayView(displayType) {
    this.displayType = displayType;
  }

  toggleFilters(filter) {
    this.toggleFilter = filter;
  }
}

export default alt.createStore(NewArrivalsStore, 'NewArrivalsStore');
