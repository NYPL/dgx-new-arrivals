import Actions from '../actions/Actions.js';
import alt from '../alt.js';

class NewArrivalsStore {
  constructor() {
    this.bindListeners({
      handleNewArrivals: Actions.UPDATE_NEW_ARRIVALS_DATA,
    });

    this.on('init', () => {
      this.newArrivalsData = []
    });
  }

  handleNewArrivals(data) {
    this.newArrivalsData = data;
  }
}

export default alt.createStore(NewArrivalsStore, 'NewArrivalsStore');
