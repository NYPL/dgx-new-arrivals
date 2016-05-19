import React from 'react';
import { SoloXIcon } from 'dgx-svg-icons';

import IconButton from './IconButton.jsx';

const CloseButton = ({ className, onClick }) => (
  <IconButton className={className} icon={<SoloXIcon />} onClick={onClick} />
);

CloseButton.propTypes = {
  className: React.PropTypes.string,
  onClick: React.PropTypes.func,
};

export default CloseButton;
