import React from 'react';
import { every as _every } from 'underscore';

import NewArrivalsStore from '../../stores/Store.js';
import Actions from '../../actions/Actions.js';

import {
  makeQuery,
  makeApiCall,
} from '../../utils/utils.js';
import config from '../../../../appConfig.js';

const { recentlyReleased, justAdded } = config.publicationType;

// can select multiple filters but only one per each category.
class PublicationToggle extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.stateChange = this.stateChange.bind(this);
    this.selectFilter = this.selectFilter.bind(this);
    this.state = NewArrivalsStore.getState();
  }

  componentDidMount() {
    NewArrivalsStore.listen(this.stateChange);
  }

  componentWillUnmount() {
    NewArrivalsStore.unlisten(this.stateChange);
  }

  onChange(e) {
    const {
      filters,
      availabilityType,
      pageNum
    } = this.state;
    const publicationType = e.currentTarget.value;
    const update = true;
    const queries = makeQuery(filters, availabilityType, pageNum, update, publicationType);

    // Action for publication year.
    Actions.updatePublicationType(publicationType);
    this.selectFilter(queries);
  }

  stateChange() {
    this.setState(NewArrivalsStore.getState());
  }

  selectFilter(queries = '') {
    makeApiCall(queries, response => {
      Actions.updateNewArrivalsData(response.data);
    });
  }

  render() {
    return (
      <fieldset className="switch publicationType" tabIndex="0">
        <legend>Show Just Added or Recently Released?</legend>
         <input
          type="radio"
          className="switch-input"
          name="publicationType"
          value={recentlyReleased.id}
          id="recentlyReleased"
          checked={this.state.publicationType === recentlyReleased.id}
          onChange={this.onChange}
        />
        <label
          htmlFor="recentlyReleased"
          className="switch-label label-left"
        >
          {recentlyReleased.label}
        </label>
        <input
          type="radio"
          className="switch-input"
          name="publicationType"
          value={justAdded.id}
          id="justAdded"
          checked={this.state.publicationType === justAdded.id}
          onChange={this.onChange}
        />
        <label
          htmlFor="justAdded"
          className="switch-label label-right"
        >
          {justAdded.label}
        </label>
        <span className="switch-selection"></span>
      </fieldset>
    );
  }
}

export default PublicationToggle;
