import config from '../../../appConfig.js';

import {
  map as _map,
} from 'underscore';

const { appFilters } = config;

const formatFilters = () => {
  const formats = _map(appFilters.formatData.data, format => format.id);
  return formats.join(',');
};

const titleShortener = (title, itemTitleLength = 96) => {
  if (!title) {
    return '';
  }

  let updatedTitle = title.split(':')[0].split('/')[0];

  if (updatedTitle.length > itemTitleLength) {
    updatedTitle = updatedTitle.substring(0, itemTitleLength);
  }

  return updatedTitle;
};

export {
  formatFilters,
  titleShortener,
};
