// ACTIONS
import alt from '../alt.js';

class Actions {
  updateNewArrivalsData(data) {
    return data;
  }

  updateBookDisplay(displayType) {
    return displayType;
  }
};

export default alt.createActions(Actions);
