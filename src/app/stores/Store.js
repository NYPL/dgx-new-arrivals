import Actions from '../actions/Actions.js';
import alt from '../alt.js';

class NewArrivalsStore {
  constructor() {
    this.bindListeners({
      handleNewArrivals: Actions.UPDATE_NEW_ARRIVALS_DATA,
      updateBookDisplay: Actions.UPDATE_BOOK_DISPLAY,
    });

    this.on('init', () => {
      this.newArrivalsData = [];
      this.displayType =  'grid';
    });
  }

  handleNewArrivals(data) {
    this.newArrivalsData = data;
  }

  updateBookDisplay(displayType) {
    this.displayType = displayType;
  }
}

export default alt.createStore(NewArrivalsStore, 'NewArrivalsStore');
