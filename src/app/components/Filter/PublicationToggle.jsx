import React from 'react';
import { CheckSoloIcon } from 'dgx-svg-icons';

import { trackNewArrivals } from '../../utils/utils.js';
import config from '../../../../appConfig.js';

const { recentlyReleased, anyYear } = config.publicationType;

// can select multiple filters but only one per each category.
class PublicationToggle extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    const publicationType = e.currentTarget.value;
    this.props.managePublicationType(publicationType);
    trackNewArrivals('Toggle Publication Type', publicationType);
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
          <CheckSoloIcon width="24" height="24" />
          {recentlyReleased.label}
        </label>
        <input
          type="radio"
          className="switch-input"
          name="publicationType"
          value={anyYear.id}
          id="anyYear"
          checked={this.props.publicationType === anyYear.id}
          onChange={this.onChange}
        />
        <label
          htmlFor="anyYear"
          className="switch-label label-right"
        >
          <CheckSoloIcon width="24" height="24" />
          {anyYear.label}
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
