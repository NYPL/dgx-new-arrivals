// ACTIONS
import alt from '../alt.js';

class Actions {
  updateNewArrivalsData(data) {
    this.dispatch(data);
  }
};

export default alt.createActions(Actions);
