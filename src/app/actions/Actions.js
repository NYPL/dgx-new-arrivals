import alt from 'dgx-alt-center';

class Actions {
  updateNewArrivalsData(data) {
    this.dispatch(data);
  }

  updateDisplayView(displayType) {
    this.dispatch(displayType);
  }

  toggleFilters(toggle) {
    this.dispatch(toggle);
  }

  updateDropDownValue(value) {
    this.dispatch(value);
  }
};

export default alt.createActions(Actions);
