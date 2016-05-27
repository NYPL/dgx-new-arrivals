import React from 'react';
import { CheckSoloIcon } from 'dgx-svg-icons';

import config from '../../../../appConfig.js';

const { recentlyReleased, justAdded } = config.publicationType;

// can select multiple filters but only one per each category.
class PublicationToggle extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.buttonLabel = this.buttonLabel.bind(this);
  }

  onChange(e) {
    const publicationType = e.currentTarget.value;
    this.props.managePublicationType(publicationType);
  }

  buttonLabel(type) {
    if (this.props.publicationType === type.id) {
      return (<span><CheckSoloIcon width="24" height="24" /> {type.label}</span>);
    }

    return type.label;
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
          checked={this.props.publicationType === recentlyReleased.id}
          onChange={this.onChange}
        />
        <label
          htmlFor="recentlyReleased"
          className="switch-label label-left"
        >
          {this.buttonLabel(recentlyReleased)}
        </label>
        <input
          type="radio"
          className="switch-input"
          name="publicationType"
          value={justAdded.id}
          id="justAdded"
          checked={this.props.publicationType === justAdded.id}
          onChange={this.onChange}
        />
        <label
          htmlFor="justAdded"
          className="switch-label label-right"
        >
          {this.buttonLabel(justAdded)}
        </label>
        <span className="switch-selection"></span>
      </fieldset>
    );
  }
}

PublicationToggle.propTypes = {
  managePublicationType: React.PropTypes.func,
  publicationType: React.PropTypes.string,
};

export default PublicationToggle;
