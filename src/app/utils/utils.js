import config from '../../../appConfig.js';

import {
  map as _map,
  mapObject as _mapObject,
} from 'underscore';

const {
  appFilters,
  itemCount,
} = config;

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

const makeQuery = (filters = {}, availability = '', items = itemCount) => {
  let queries = '';

  _mapObject(filters, (val, key) => {
    if (val !== '') {
      queries += (val === 'Research') ? `&audience=${val}` : `&${key}=${val}`;
    } else if (key === 'format') {
      queries += `&format=${formatFilters()}`;
    }
  });

  if (availability) {
    queries += `&availability=${availability}`;
  }

  queries += `&itemCount=${items}`;

  return queries;
};

export {
  formatFilters,
  makeQuery,
  titleShortener,
};
