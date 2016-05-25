import React from 'react';
import { XIcon } from 'dgx-svg-icons';

import IconButton from './IconButton.jsx';

const CloseButton = ({ className, onClick }) => (
  <IconButton
    className={className}
    icon={<XIcon width="48" height="48" />}
    onClick={onClick}
  />
);

CloseButton.propTypes = {
  className: React.PropTypes.string,
  onClick: React.PropTypes.func,
};

export default CloseButton;
