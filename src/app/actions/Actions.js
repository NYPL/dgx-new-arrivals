// ACTIONS
import alt from 'dgx-alt-center';

class Actions {
  updateRecommendedRecentReleasesData(data) {
    this.dispatch(data);
  }
};

export default alt.createActions(Actions);
