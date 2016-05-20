import config from '../../../appConfig.js';
import {
  map as _map,
  mapObject as _mapObject,
} from 'underscore';

const { appFilters } = config;

function formatFilters() {
  const formats = _map(appFilters.formatData.data, format => format.id);
  return formats.join(',');
}

const makeQuery = (filters = {}, availability = '') => {
  let queries = '';

  _mapObject(filters, (val, key) => {
    if (val !== '') {
      queries += `&${key}=${val}`;
    } else if (key === 'format') {
      queries += `&format=${formatFilters()}`;
    }
  });

  if (availability) {
    queries += `&availability=${availability}`;
  }

  return queries;
};

export {
  formatFilters,
  makeQuery,
};
