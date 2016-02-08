import Actions from '../actions/Actions.js';
import alt from 'dgx-alt-center';

class HomepageStore {
  constructor() {
    this.bindListeners({
      handleRecommendedRecentReleasesData: Actions.UPDATE_RECOMMENDED_RECENT_RELEASES_DATA,
    });

    this.on('init', () => {
      this.recommendedRecentReleasesData = []
    });
  }

  handleRecommendedRecentReleasesData(data) {
    this.recommendedRecentReleasesData = data;
  }
}

export default alt.createStore(HomepageStore, 'HomepageStore');
