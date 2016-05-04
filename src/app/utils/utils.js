import config from '../../../appConfig.js';
import {
  map as _map,
} from 'underscore';

const { appFilters } = config;

function formatFilters() {
  const formats = _map(appFilters.formatData.data, format => format.id);
  return formats.join(',');
}

export {
  formatFilters,
};
