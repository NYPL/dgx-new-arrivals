import React from 'react';
import PropTypes from 'prop-types';
import { XIcon } from 'dgx-svg-icons';

import IconButton from './IconButton.jsx';

const CloseButton = ({ className, onClick }) => (
  <IconButton
    className={className}
    icon={<XIcon width="48" height="48" />}
    onClick={onClick}
    label="Close"
  />
);

CloseButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default CloseButton;
