import alt from 'dgx-alt-center';

class Actions {
  updateNewArrivalsData(data) {
    this.dispatch(data);
  }

  updateBookDisplay(displayType) {
    this.dispatch(displayType);
  }
};

export default alt.createActions(Actions);
